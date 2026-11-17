import { useLayoutEffect, useRef, useState } from 'react';
import { Check, Minus, Sparkles } from 'lucide-react';
import { PARCELAS_IMPLANTACAO, DESCONTO_A_VISTA, PLANOS, RECURSOS, parcela, primeiros24, implantacaoAVista, economiaAVista } from '../precos.js';

// R$ 1.297 (os valores do modelo V2 são inteiros, sem centavos)
const reais = (valor) => `R$ ${valor.toLocaleString('pt-BR')}`;

const Simbolo = () => (
  <svg className="cta__icon" width="14" height="20" viewBox="10 7.25 12 17.5" fill="#fff" aria-hidden="true">
    <path d="M13.0349 7.5H17.7791L15.0116 17.3837H10.2674L13.0349 7.5Z" />
    <path d="M18.1744 8.29071H21.7326L16.1977 16.1977H13.8256L18.1744 8.29071Z" />
    <path d="M15.0116 16.9883H17.7791L21.7326 24.5H18.5698L15.0116 16.9883Z" />
  </svg>
);

const prescritores = (n) => (n === 1 ? '1 prescritor' : `${n} prescritores incluídos`);

// texto da cobrança abaixo do botão, no lugar das letras miúdas da referência
function comoCobra(p, aVista) {
  if (aVista) return `${reais(implantacaoAVista(p))} de implantação, pagos hoje com ${DESCONTO_A_VISTA}% de desconto.`;
  return `Implantação de ${reais(p.implantacao)} em ${PARCELAS_IMPLANTACAO}x de ${reais(parcela(p))}. Depois, ${reais(p.mensalidade)}/mês.`;
}

export default function Precos({ abrirForm }) {
  const [aVista, setAVista] = useState(false);
  // o marcador desliza até o botão escolhido, medindo a largura real de cada um
  const opcoes = useRef([]);
  const [marca, setMarca] = useState({ left: 4, width: 0 });
  useLayoutEffect(() => {
    const medir = () => {
      const b = opcoes.current[aVista ? 1 : 0];
      if (b) setMarca({ left: b.offsetLeft, width: b.offsetWidth });
    };
    medir();
    window.addEventListener('resize', medir);
    document.fonts?.ready.then(medir);
    return () => window.removeEventListener('resize', medir);
  }, [aVista]);

  return (
    <section className="precos" id="precos" aria-labelledby="precos-titulo">
      <div className="precos__cab">
        <span className="faq__badge">Preços</span>
        <h2 id="precos-titulo">Você paga só por quem prescreve</h2>
        <p>Agendas, unidades e equipe de apoio ilimitadas em todos os planos.</p>
      </div>

      <div className="precos__barra">
        <div className="ciclo" role="group" aria-label="Pagamento da implantação">
          <span className="ciclo__marcador" style={{ transform: `translateX(${marca.left}px)`, width: marca.width }} aria-hidden="true" />
          <button type="button" ref={(el) => (opcoes.current[0] = el)} className="ciclo__opcao" aria-pressed={!aVista} onClick={() => setAVista(false)}>
            Implantação em {PARCELAS_IMPLANTACAO}x
          </button>
          <button type="button" ref={(el) => (opcoes.current[1] = el)} className="ciclo__opcao" aria-pressed={aVista} onClick={() => setAVista(true)}>
            À vista
          </button>
        </div>
        <p className="precos__barra-nota">{aVista ? `${DESCONTO_A_VISTA}% de desconto na implantação.` : `Parcelas junto com a mensalidade. Contrato mínimo de ${PARCELAS_IMPLANTACAO} meses.`} Reajuste anual pelo IPCA.</p>
      </div>

      <ul className="precos__planos">
        {PLANOS.map((p, n) => {
          const economia = `Economize ${reais(economiaAVista(p))}`;
          const fixo = p.destaque ? 'Recomendado' : p.novo ? 'Novo' : null;
          // à vista, todos mostram a economia real (o destaque continua no cartão escuro e no selo em degradê)
          const selo = aVista ? economia : fixo;
          const rotulo = `${p.nome} · implantação ${aVista ? 'à vista' : `em ${PARCELAS_IMPLANTACAO}x`}`;
          return (
            <li key={p.nome} className={`plano${p.destaque ? ' plano--destaque' : ''}`}>
              <div className="plano__topo">
                {selo && <span className={`plano__selo${p.destaque ? ' plano__selo--forte' : ''}`}>{selo}</span>}
              </div>
              <p className="plano__nome">
                {p.destaque && <Sparkles size={18} strokeWidth={2} aria-hidden="true" />}
                {p.nome}
              </p>
              <p className="plano__para">{p.para}</p>

              <p className="plano__antes">{aVista ? 'Mensalidade' : `Do 1º ao ${PARCELAS_IMPLANTACAO}º mês`}</p>
              <p className="plano__preco">
                {reais(aVista ? p.mensalidade : primeiros24(p))}
                <span className="plano__mes">/mês</span>
              </p>

              {p.destaque ? (
                <button type="button" className="cta plano__botao" onClick={() => abrirForm(rotulo)}>
                  <span className="cta__border" aria-hidden="true" />
                  <Simbolo />
                  <span className="cta__text">Testar grátis por 15 dias</span>
                </button>
              ) : (
                <button type="button" className="plano__botao plano__botao--linha" onClick={() => abrirForm(rotulo)}>
                  Testar grátis por 15 dias
                </button>
              )}

              <p className="plano__letras">{comoCobra(p, aVista)}</p>

              <div className="plano__ia">
                <span className="plano__ia-txt">
                  <b>Koryum AI</b>
                  <strong>{p.transcricao[0]}</strong>
                  <span>{p.transcricao[1]}</span>
                </span>
                <span className="plano__ia-ico" aria-hidden="true"><Sparkles size={18} strokeWidth={2} /></span>
              </div>

              <ul className="plano__itens">
                <li>
                  <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                  {prescritores(p.incluidos)}
                </li>
                <li className={p.adicional ? '' : 'plano__item--nao'}>
                  {p.adicional ? <Check size={16} strokeWidth={2.25} aria-hidden="true" /> : <Minus size={16} strokeWidth={2.25} aria-hidden="true" />}
                  {p.adicional ? `Prescritor extra: ${reais(p.adicional)}/mês` : 'Prescritor extra'}
                </li>
                {RECURSOS.map((r) => {
                  const tem = r.planos.includes(n);
                  return (
                    <li key={r.texto} className={tem ? '' : 'plano__item--nao'}>
                      {tem ? <Check size={16} strokeWidth={2.25} aria-hidden="true" /> : <Minus size={16} strokeWidth={2.25} aria-hidden="true" />}
                      {r.texto}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
