import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, RotateCcw } from 'lucide-react';
import { PERGUNTAS, RESPOSTA_PADRAO } from '../faq.js';

const semAcento = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Acha a resposta pela pergunta digitada: conta quantas palavras-chave aparecem
function encontrar(texto) {
  const t = semAcento(texto);
  let melhor = null;
  let pontos = 0;
  for (const item of PERGUNTAS) {
    const p = item.palavras.filter((pal) => t.includes(pal)).length + (semAcento(item.pergunta) === t ? 10 : 0);
    if (p > pontos) {
      melhor = item;
      pontos = p;
    }
  }
  return melhor;
}

const reduzMovimento = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const Simbolo = ({ tamanho = 14 }) => (
  <svg width={tamanho} height={tamanho * 1.43} viewBox="10 7.25 12 17.5" fill="#fff" aria-hidden="true">
    <path d="M13.0349 7.5H17.7791L15.0116 17.3837H10.2674L13.0349 7.5Z" />
    <path d="M18.1744 8.29071H21.7326L16.1977 16.1977H13.8256L18.1744 8.29071Z" />
    <path d="M15.0116 16.9883H17.7791L21.7326 24.5H18.5698L15.0116 16.9883Z" />
  </svg>
);

// Perguntas frequentes no formato de conversa com o Koryum AI.
// As respostas são fixas (vêm de src/faq.js); não há IA de verdade por trás.
export default function Faq({ abrirForm }) {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const corpo = useRef(null);
  const timers = useRef([]);

  const sugeridas = useMemo(() => PERGUNTAS.filter((p) => p.sugerida), []);
  const jaFeitas = new Set(mensagens.filter((m) => m.de === 'voce').map((m) => m.texto));
  const proximas = PERGUNTAS.filter((p) => !jaFeitas.has(p.pergunta)).slice(0, 3);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // A altura da área do chat é a da tela inicial (saudação + perguntas), medida no navegador.
  // Ela fica travada nesse valor durante a conversa, que passa a rolar por dentro.
  const [altura, setAltura] = useState(null);
  const vazio = mensagens.length === 0;
  useLayoutEffect(() => {
    if (!vazio) return undefined;
    const medir = () => {
      const el = corpo.current;
      if (!el) return;
      el.style.height = 'auto';
      setAltura(el.scrollHeight);
      el.style.height = '';
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [vazio]);

  // como um chat de verdade: a conversa rola dentro do cartão e sempre mostra a última mensagem
  useEffect(() => {
    const el = corpo.current;
    if (el && mensagens.length) el.scrollTo({ top: el.scrollHeight, behavior: reduzMovimento() ? 'auto' : 'smooth' });
  }, [mensagens, ocupado]);

  const perguntar = (pergunta) => {
    const limpa = pergunta.trim();
    if (!limpa || ocupado) return;
    const item = encontrar(limpa);
    const resposta = item ? item.resposta : RESPOSTA_PADRAO;
    const especialista = item ? !!item.especialista : true;
    setTexto('');
    setOcupado(true);
    setMensagens((m) => [...m, { de: 'voce', texto: limpa }, { de: 'koryum', texto: '', digitando: true }]);

    const palavras = resposta.split(' ');
    const atraso = reduzMovimento() ? 0 : 650;
    const passo = reduzMovimento() ? 0 : 28;
    timers.current.push(
      setTimeout(() => {
        if (!passo) {
          setMensagens((m) => [...m.slice(0, -1), { de: 'koryum', texto: resposta, especialista }]);
          setOcupado(false);
          return;
        }
        palavras.forEach((_, i) => {
          timers.current.push(
            setTimeout(() => {
              const fim = i === palavras.length - 1;
              setMensagens((m) => [
                ...m.slice(0, -1),
                { de: 'koryum', texto: palavras.slice(0, i + 1).join(' '), especialista: fim && especialista },
              ]);
              if (fim) setOcupado(false);
            }, i * passo)
          );
        });
      }, atraso)
    );
  };

  const recomecar = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setMensagens([]);
    setOcupado(false);
    setTexto('');
  };

  return (
    <section className="faq" id="perguntas" aria-labelledby="faq-titulo">
      {/* luz orgânica suave atrás do chat */}
      <div className="faq__luz" aria-hidden="true">
        <span className="faq__mancha faq__mancha--azul" />
        <span className="faq__mancha faq__mancha--verde" />
        <span className="faq__mancha faq__mancha--meio" />
      </div>

      <div className="faq__cab">
        <span className="faq__badge">F.A.Q</span>
        <h2 id="faq-titulo">Perguntas frequentes</h2>
        <p>Escolha uma pergunta ou escreva a sua.</p>
      </div>

      <div className="chat">
        <div className="chat__topo">
          <span className="chat__avatar">
            <Simbolo tamanho={14} />
          </span>
          <div>
            <p className="chat__nome">Koryum AI</p>
            <p className="chat__papel">Dúvidas sobre o Koryum</p>
          </div>
          {mensagens.length > 0 && (
            <button type="button" className="chat__recomecar" onClick={recomecar} aria-label="Recomeçar conversa">
              <RotateCcw size={15} strokeWidth={2} aria-hidden="true" />
              <span>Recomeçar</span>
            </button>
          )}
        </div>

        <div className="chat__corpo" ref={corpo} style={altura ? { height: altura } : undefined}>
          {mensagens.length === 0 ? (
            <div className="chat__inicio">
              <ul className="chat__sugestoes">
                {sugeridas.map((p) => (
                  <li key={p.pergunta}>
                    <button type="button" className="chat__sugestao" onClick={() => perguntar(p.pergunta)}>
                      {p.pergunta}
                      <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="chat__conversa" aria-live="polite">
              {mensagens.map((m, i) =>
                m.de === 'voce' ? (
                  <p key={i} className="msg msg--voce">{m.texto}</p>
                ) : (
                  <div key={i} className="msg msg--koryum">
                    <span className="chat__avatar chat__avatar--p" aria-hidden="true">
                      <Simbolo tamanho={10} />
                    </span>
                    <div className="msg__balao">
                      {m.digitando ? (
                        <span className="msg__digitando" aria-label="Digitando">
                          <i /><i /><i />
                        </span>
                      ) : (
                        <p>{m.texto}</p>
                      )}
                      {m.especialista && (
                        <button type="button" className="msg__cta" onClick={abrirForm}>
                          Falar com um especialista
                          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
              {!ocupado && proximas.length > 0 && (
                <div className="chat__mais">
                  {proximas.map((p) => (
                    <button key={p.pergunta} type="button" className="chat__chip" onClick={() => perguntar(p.pergunta)}>
                      {p.pergunta}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <form
          className="chat__entrada"
          onSubmit={(e) => {
            e.preventDefault();
            perguntar(texto);
          }}
        >
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Digite sua pergunta..."
            aria-label="Digite sua pergunta"
            maxLength={200}
          />
          <button type="submit" className="chat__enviar" disabled={!texto.trim() || ocupado} aria-label="Enviar pergunta">
            <ArrowUp size={18} strokeWidth={2.25} />
          </button>
        </form>
      </div>
    </section>
  );
}
