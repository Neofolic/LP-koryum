import { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ClipboardList, Mic, Package, ShoppingCart, Sparkles } from 'lucide-react';

const RECURSOS = [
  { Icone: CalendarDays, nome: 'Agenda', sub: 'Todas as agendas e unidades numa tela só' },
  { Icone: ClipboardList, nome: 'Prontuário', sub: 'Evolução, documentos e prescrição pela Memed' },
  { Icone: ShoppingCart, nome: 'Vendas e orçamentos', sub: 'Pacotes, orçamentos e recebimentos' },
  { Icone: Package, nome: 'Estoque', sub: 'Lotes, validades e contagem sem planilha' },
];

const NOVIDADES = [
  { Icone: Sparkles, nome: 'Koryum AI' },
  { Icone: Mic, nome: 'Transcrição da consulta' },
];

// Desenho de traço simples (próprio) para o cartão "Por que o Koryum?": uma clínica com a cruz no topo
const Ilustracao = () => (
  <svg viewBox="0 0 240 120" className="recursos__ilustra" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M20 118V58h200v60" />
      <path d="M10 58h220L120 14 10 58Z" />
      <path d="M112 30h16M120 22v16" />
      <path d="M36 118V74h36v44M54 74v44" />
      <path d="M102 118V78h36v40" />
      <path d="M168 118V74h36v44M186 74v44" />
      <path d="M4 118h232" />
    </g>
  </svg>
);

// Painel aberto pelo item "Funcionalidades" do menu: abre ao passar o mouse, ao clicar ou pelo teclado
export default function MenuRecursos() {
  const [aberto, setAberto] = useState(false);
  // o painel continua na tela durante a animação de saída
  const [montado, setMontado] = useState(false);
  useEffect(() => {
    if (aberto) {
      setMontado(true);
      return undefined;
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setMontado(false);
      return undefined;
    }
    const t = setTimeout(() => setMontado(false), 140);
    return () => clearTimeout(t);
  }, [aberto]);
  const raiz = useRef(null);
  const timer = useRef(0);
  const tipoPonteiro = useRef('');

  const abrir = () => {
    clearTimeout(timer.current);
    setAberto(true);
  };
  const fecharDepois = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAberto(false), 140);
  };

  useEffect(() => {
    if (!aberto) return undefined;
    const fora = (e) => {
      if (!raiz.current?.contains(e.target)) setAberto(false);
    };
    const esc = (e) => {
      if (e.key === 'Escape') {
        setAberto(false);
        raiz.current?.querySelector('.recursos__gatilho')?.focus();
      }
    };
    document.addEventListener('mousedown', fora);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', fora);
      document.removeEventListener('keydown', esc);
    };
  }, [aberto]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="recursos" ref={raiz} onMouseEnter={abrir} onMouseLeave={fecharDepois}>
      <button
        type="button"
        className="recursos__gatilho"
        aria-expanded={aberto}
        aria-controls="painel-recursos"
        onPointerDown={(e) => (tipoPonteiro.current = e.pointerType)}
        onClick={(e) => {
          // com mouse o painel já abriu ao passar por cima: o clique só garante que fique aberto.
          // No toque e no teclado (Enter), o clique abre e fecha.
          if (e.detail > 0 && tipoPonteiro.current === 'mouse') setAberto(true);
          else setAberto((a) => !a);
        }}
      >
        Funcionalidades
        <ChevronDown className="recursos__seta" size={16} strokeWidth={2} aria-hidden="true" />
      </button>

      {montado && (
        <div className={`recursos__painel${aberto ? '' : ' recursos__painel--saindo'}`} id="painel-recursos">
          <div className="recursos__col">
            <p className="recursos__titulo">Recursos</p>
            <ul>
              {RECURSOS.map(({ Icone, nome, sub }) => (
                <li key={nome}>
                  <a href="#recursos" className="recursos__item" onClick={() => setAberto(false)}>
                    <Icone className="recursos__icone" size={22} strokeWidth={1.75} aria-hidden="true" />
                    <span>
                      <span className="recursos__nome">{nome}</span>
                      <span className="recursos__sub">{sub}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="recursos__lado">
            <p className="recursos__titulo">Novidades</p>
            <ul>
              {NOVIDADES.map(({ Icone, nome }) => (
                <li key={nome}>
                  <a href="#koryum-ai" className="recursos__novidade" onClick={() => setAberto(false)}>
                    <Icone size={18} strokeWidth={1.9} aria-hidden="true" />
                    {nome}
                  </a>
                </li>
              ))}
            </ul>
            <div className="recursos__porque">
              <p className="recursos__porque-titulo">Por que o Koryum?</p>
              <p className="recursos__porque-texto">Agenda, prontuário e vendas da clínica num só login.</p>
              <Ilustracao />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
