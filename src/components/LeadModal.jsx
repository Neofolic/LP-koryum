import { useEffect, useRef, useState } from 'react';
import { Loader2, Lock, X } from 'lucide-react';
import { CONFIRMACAO_URL, POLITICA_URL, WEBHOOK_URL } from '../config.js';
import DdiSelect from './DdiSelect.jsx';
import Logo from './Logo.jsx';

const SEGMENTOS = ['Estética', 'Dermatologia', 'Cirurgia plástica', 'Harmonização', 'Outro'];
const PROFISSIONAIS = ['Só eu', '2 a 3', '4 a 10', 'Mais de 10'];

const VAZIO = { nome: '', ddi: '55', whatsapp: '', email: '', instagram: '', segmento: '', profissionais: '' };

// Aceita "@perfil", "perfil" ou o link do perfil colado, e devolve só o nome do perfil
function perfilInstagram(valor) {
  return valor
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^instagram\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]
    .trim();
}

// (85) 99999-9999
function mascaraTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function validar(f) {
  const e = {};
  if (f.nome.trim().split(/\s+/).length < 2) e.nome = 'Digite nome e sobrenome.';
  const tel = f.whatsapp.replace(/\D/g, '');
  if (f.ddi === '55' ? tel.length < 10 || tel.length > 11 : tel.length < 6 || tel.length > 14)
    e.whatsapp = f.ddi === '55' ? 'Digite o WhatsApp com DDD.' : 'Digite o número completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Digite um e-mail válido.';
  const perfil = perfilInstagram(f.instagram);
  if (!perfil) e.instagram = 'Digite o Instagram da clínica.';
  else if (!/^[a-z0-9._]{1,30}$/i.test(perfil)) e.instagram = 'Use só letras, números, ponto e sublinhado.';
  if (!f.segmento) e.segmento = 'Escolha o segmento.';
  if (!f.profissionais) e.profissionais = 'Escolha uma opção.';
  return e;
}

// De onde a pessoa veio (anúncio, campanha), para o comercial e o tráfego saberem a origem do contato
function origem() {
  const q = new URLSearchParams(window.location.search);
  const chaves = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  const dados = Object.fromEntries(chaves.filter((k) => q.get(k)).map((k) => [k, q.get(k)]));
  return { ...dados, pagina: window.location.href, referencia: document.referrer || null };
}

function irParaConfirmacao() {
  // Na prévia (arquivo único) não existe /obrigado, então usa o endereço com #obrigado
  if (import.meta.env.MODE === 'singlefile') {
    window.location.hash = 'obrigado';
    window.scrollTo(0, 0);
    return;
  }
  window.location.assign(CONFIRMACAO_URL);
}

export default function LeadModal({ aberto, plano = '', aoFechar }) {
  const ref = useRef(null);
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
    if (!aberto && d.open) d.close();
    if (!aberto) document.documentElement.style.overflow = '';
  }, [aberto]);

  const mudar = (campo) => (ev) => {
    const valor = ev.target.value;
    setForm((f) => {
      if (campo === 'whatsapp') return { ...f, whatsapp: f.ddi === '55' ? mascaraTelefone(valor) : valor.replace(/[^\d\s-]/g, '').slice(0, 18) };
      // ao trocar o país, o número é reformatado (máscara só para o Brasil)
      if (campo === 'ddi') {
        const d = f.whatsapp.replace(/\D/g, '');
        return { ...f, ddi: valor, whatsapp: valor === '55' ? mascaraTelefone(d) : d };
      }
      return { ...f, [campo]: valor };
    });
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    if (enviando) return;
    const e = validar(form);
    setErros(e);
    setFalhou(false);
    if (Object.keys(e).length) {
      const primeiro = Object.keys(e)[0];
      ref.current?.querySelector(`[name="${primeiro}"]`)?.focus();
      return;
    }

    const dados = {
      nome: form.nome.trim(),
      whatsapp: `${form.ddi}${form.whatsapp.replace(/\D/g, '')}`,
      ddi: form.ddi,
      email: form.email.trim().toLowerCase(),
      instagram: `@${perfilInstagram(form.instagram).toLowerCase()}`,
      segmento: form.segmento,
      profissionais: form.profissionais,
      origem: origem(),
      plano_interesse: plano || null,
      enviado_em: new Date().toISOString(),
    };

    setEnviando(true);
    try {
      if (WEBHOOK_URL) {
        const r = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        });
        if (!r.ok) throw new Error(`Webhook respondeu ${r.status}`);
      } else {
        console.warn('[Koryum] WEBHOOK_URL vazio: dados não enviados (modo de teste).', dados);
      }
      // Evento para o Google Tag Manager, se estiver instalado na página
      window.dataLayer?.push({ event: 'gerar_lead', segmento: dados.segmento });
      setForm(VAZIO);
      aoFechar();
      irParaConfirmacao();
    } catch (err) {
      console.error(err);
      setFalhou(true);
    } finally {
      setEnviando(false);
    }
  };

  const campo = (nome, rotulo, props = {}) => (
    <label className={`lead__campo${erros[nome] ? ' lead__campo--erro' : ''}`}>
      <span className="lead__rotulo">{rotulo}</span>
      <input
        name={nome}
        value={form[nome]}
        onChange={mudar(nome)}
        aria-invalid={!!erros[nome]}
        aria-describedby={erros[nome] ? `erro-${nome}` : undefined}
        {...props}
      />
      {erros[nome] && <span id={`erro-${nome}`} className="lead__erro">{erros[nome]}</span>}
    </label>
  );

  const selecao = (nome, rotulo, opcoes) => (
    <label className={`lead__campo${erros[nome] ? ' lead__campo--erro' : ''}`}>
      <span className="lead__rotulo">{rotulo}</span>
      <select
        name={nome}
        value={form[nome]}
        onChange={mudar(nome)}
        aria-invalid={!!erros[nome]}
        aria-describedby={erros[nome] ? `erro-${nome}` : undefined}
        className={form[nome] ? '' : 'lead__vazio'}
      >
        <option value="" disabled>Escolha</option>
        {opcoes.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {erros[nome] && <span id={`erro-${nome}`} className="lead__erro">{erros[nome]}</span>}
    </label>
  );

  return (
    <dialog
      ref={ref}
      className="vmodal lead"
      aria-labelledby="lead-titulo"
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
    >
      <button type="button" className="vmodal__fechar" onClick={aoFechar} aria-label="Fechar formulário">
        <X size={28} strokeWidth={1.75} />
      </button>

      <form className="lead__painel" onSubmit={enviar} noValidate>
        <div className="lead__topo">
          <span className="modal__logo"><Logo height={28} /></span>
          {/* Todos os botões (Falar com especialista e Testar grátis dos planos) abrem este mesmo modal.
              O plano clicado não aparece na tela, mas segue no envio (plano_interesse) para o comercial. */}
          <p id="lead-titulo" className="lead__titulo">Fale com um especialista</p>
          <p className="lead__apoio">Conte um pouco sobre a sua clínica. Um especialista do Koryum chama você no WhatsApp.</p>
        </div>

        <div className="lead__grade">
          {campo('nome', 'Nome e sobrenome', { autoComplete: 'name', placeholder: 'Maria Souza' })}
          <div className={`lead__campo${erros.whatsapp ? ' lead__campo--erro' : ''}`}>
            <label className="lead__rotulo" htmlFor="lead-whatsapp">WhatsApp</label>
            <div className="lead__tel">
              <DdiSelect
                valor={form.ddi}
                aoMudar={(v) => mudar('ddi')({ target: { value: v } })}
                aoEscolher={() => ref.current?.querySelector('#lead-whatsapp')?.focus()}
              />
              <input
                id="lead-whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={form.ddi === '55' ? '(85) 99999-9999' : 'Número'}
                value={form.whatsapp}
                onChange={mudar('whatsapp')}
                aria-invalid={!!erros.whatsapp}
                aria-describedby={erros.whatsapp ? 'erro-whatsapp' : undefined}
              />
            </div>
            {erros.whatsapp && <span id="erro-whatsapp" className="lead__erro">{erros.whatsapp}</span>}
          </div>
          {campo('email', 'E-mail', { type: 'email', autoComplete: 'email', placeholder: 'voce@clinica.com.br' })}
          <div className={`lead__campo${erros.instagram ? ' lead__campo--erro' : ''}`}>
            <label className="lead__rotulo" htmlFor="lead-instagram">Instagram da clínica</label>
            <div className="lead__tel">
              <span className="lead__prefixo" aria-hidden="true">@</span>
              <input
                id="lead-instagram"
                name="instagram"
                type="text"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="suaclinica"
                value={form.instagram}
                onChange={mudar('instagram')}
                onBlur={() => form.instagram && setForm((f) => ({ ...f, instagram: perfilInstagram(f.instagram) }))}
                aria-invalid={!!erros.instagram}
                aria-describedby={erros.instagram ? 'erro-instagram' : undefined}
              />
            </div>
            {erros.instagram && <span id="erro-instagram" className="lead__erro">{erros.instagram}</span>}
          </div>
          {selecao('segmento', 'Segmento', SEGMENTOS)}
          {selecao('profissionais', 'Profissionais de saúde', PROFISSIONAIS)}
        </div>


        {falhou && (
          <p className="lead__falha" role="alert">
            Não conseguimos enviar seus dados agora. Confira a conexão e tente de novo.
          </p>
        )}

        <button type="submit" className="cta lead__enviar" disabled={enviando}>
          <span className="cta__border" aria-hidden="true" />
          {enviando ? (
            <Loader2 className="cta__icon lead__girando" size={18} strokeWidth={2.25} aria-hidden="true" />
          ) : (
            <svg className="cta__icon" width="14" height="20" viewBox="10 7.25 12 17.5" fill="#fff" aria-hidden="true">
              <path d="M13.0349 7.5H17.7791L15.0116 17.3837H10.2674L13.0349 7.5Z" />
              <path d="M18.1744 8.29071H21.7326L16.1977 16.1977H13.8256L18.1744 8.29071Z" />
              <path d="M15.0116 16.9883H17.7791L21.7326 24.5H18.5698L15.0116 16.9883Z" />
            </svg>
          )}
          <span className="cta__text">{enviando ? 'Enviando' : 'Quero falar com um especialista'}</span>
        </button>

        <p className="lead__seguro">
          <Lock size={13} strokeWidth={2} aria-hidden="true" />
          Dados seguros e criptografados
          {POLITICA_URL && (
            <>
              {' · '}
              <a href={POLITICA_URL} target="_blank" rel="noopener noreferrer">Política de privacidade</a>
            </>
          )}
        </p>
      </form>
    </dialog>
  );
}
