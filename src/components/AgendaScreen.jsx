import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import agenda from '../assets/telas/agenda.webp';
import agendaHover from '../assets/telas/agenda-hover.webp';
import transcrevendo from '../assets/telas/transcrevendo.webp';
import revisar from '../assets/telas/revisar.webp';
import sala from '../assets/telas/sala.webp';
import chamar from '../assets/telas/chamar.webp';
import chamados from '../assets/telas/chamados.webp';
import prontuario from '../assets/telas/prontuario.webp';
import resumoIa from '../assets/telas/resumo-ia.webp';
import vendas from '../assets/telas/vendas.webp';
import estoque from '../assets/telas/estoque.webp';

// Passeio pelas telas reais do Figma KORYUM V2 (exportadas em PNG e convertidas para WebP).
// Palco de 1440 x 960, reduzido para caber. Menu lateral (280 px) e barra do topo (80 px) ficam
// parados enquanto o conteúdo rola, como no sistema.
const W = 1440;
const H = 960;
const MENU_L = 280;
const TOPO = 80;
// Nas telas mais altas que 960 px, o rodapé do menu (Team chat, Configurações, tema) fica lá embaixo:
// nelas ele é emprestado da tela da Agenda. Nas telas com modal ele vem da própria tela, já escurecido.
const MENU_FIM = 800;

const TELAS = [
  { id: 'agenda', src: agenda },
  { id: 'agendaHover', src: agendaHover },
  { id: 'transcrevendo', src: transcrevendo },
  { id: 'revisar', src: revisar },
  { id: 'sala', src: sala },
  { id: 'chamar', src: chamar },
  { id: 'chamados', src: chamados },
  { id: 'prontuario', src: prontuario, pe: true },
  { id: 'resumoIa', src: resumoIa },
  { id: 'vendas', src: vendas, pe: true },
  { id: 'estoque', src: estoque, pe: true },
];

// pontos de clique, medidos nas telas (coordenadas de 1440 x 960)
const MENU = { agenda: [100, 256], filas: [100, 296], pacientes: [100, 336], estoque: [100, 536], relatorios: [100, 576] };

// Uma tela em três camadas: menu lateral e topo fixos, conteúdo que pode rolar
// As camadas são desenhadas já no tamanho final (sem transform: scale), para o navegador
// reduzir a imagem direto para os pixels da tela, com mais nitidez.
function Camada({ src, pe, ativa, rolagem, k }) {
  const px = (n) => `${n * k}px`;
  const caixa = (x, y, w, h) => ({ left: px(x), top: px(y), width: px(w), height: px(h) });
  const fundo = (img, x, y) => ({ backgroundImage: `url(${img})`, backgroundPosition: `${px(-x)} ${px(-y)}` });
  return (
    <div className={`kp-tela${ativa ? ' kp-tela--on' : ''}`} style={{ '--tam': px(W) }}>
      <div style={{ ...caixa(0, 0, MENU_L, MENU_FIM), ...fundo(src, 0, 0) }} />
      <div style={{ ...caixa(0, MENU_FIM, MENU_L, H - MENU_FIM), ...fundo(pe ? agenda : src, 0, MENU_FIM) }} />
      <div style={{ ...caixa(MENU_L, 0, W - MENU_L, TOPO), ...fundo(src, MENU_L, 0) }} />
      <div className="kp-conteudo" style={{ ...caixa(MENU_L, TOPO, W - MENU_L, H - TOPO), ...fundo(src, MENU_L, TOPO + rolagem) }} />
    </div>
  );
}

const Cursor = ({ x, y, clique, visivel, k }) => (
  <div className={`kt-cursor${visivel ? ' kt-cursor--on' : ''}`} style={{ transform: `translate(${x * k}px, ${y * k}px)` }} aria-hidden="true">
    <span key={clique} className={clique ? 'kt-clique' : ''} />
    <svg width="26" height="26" viewBox="0 0 24 24">
      <path d="M5 3l14 7.5-6.2 1.6L10 18.5z" fill="#111214" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  </div>
);

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AgendaScreen() {
  const ref = useRef(null);
  const visivel = useRef(false);
  const [escala, setEscala] = useState(1);
  const [desloca, setDesloca] = useState(0);
  const [ativa, setAtiva] = useState('agenda');
  const [rolagem, setRolagem] = useState({});
  const [cursor, setCursor] = useState({ x: 1180, y: 760, clique: 0, visivel: false });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // Proporcional em qualquer largura: a tela inteira cabe, e a altura acompanha a largura.
    // Ao mudar a largura, a rolagem do conteúdo não anima (senão a tela "escorrega" até o lugar).
    let tempo;
    const medir = () => {
      el.classList.add('screen--medindo');
      clearTimeout(tempo);
      tempo = setTimeout(() => el.classList.remove('screen--medindo'), 150);
      setEscala(el.clientWidth / W);
      setDesloca(0);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visivel.current = e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => {
      clearTimeout(tempo);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let vivo = true;
    const pausa = async (ms) => {
      await espera(ms);
      while (vivo && (!visivel.current || document.hidden)) await espera(400);
    };
    const mover = async ([x, y], ms = 950) => {
      setCursor((c) => ({ ...c, x: x - 4, y: y - 4, visivel: true }));
      await pausa(ms);
    };
    const clicar = async () => {
      setCursor((c) => ({ ...c, clique: c.clique + 1 }));
      await espera(200);
    };
    const ir = async (ponto, tela, depois) => {
      await mover(ponto);
      await clicar();
      setAtiva(tela);
      await pausa(depois);
    };
    (async () => {
      await pausa(2600);
      while (vivo) {
        // Agenda: passa o mouse num agendamento, abre os detalhes e a transcrição do Koryum AI
        await mover([746, 484]);
        setAtiva('agendaHover');
        await pausa(1500);
        await ir([1088, 726], 'transcrevendo', 2600);
        await ir([1330, 264], 'revisar', 3200);
        // Filas e painel: chama a paciente para a triagem
        await ir(MENU.filas, 'sala', 1400);
        await ir([1260, 400], 'chamar', 1300);
        await ir([848, 610], 'chamados', 2200);
        // Prontuário: resumo gerado pelo Koryum AI
        await ir(MENU.pacientes, 'prontuario', 1300);
        await ir([1330, 340], 'resumoIa', 3200);
        // Relatórios e estoque, rolando o conteúdo
        await ir(MENU.relatorios, 'vendas', 700);
        setRolagem({ vendas: 224 });
        await pausa(2600);
        await ir(MENU.estoque, 'estoque', 700);
        setRolagem({ estoque: 206 });
        await pausa(2600);
        await ir(MENU.agenda, 'agenda', 600);
        setRolagem({});
        await pausa(1800);
      }
    })();
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <div
      ref={ref}
      className="screen"
      style={{ height: H * escala }}
      role="img"
      aria-label="Demonstração do Koryum passando pelas telas de agenda, transcrição do Koryum AI, fila e painel, prontuário, relatório de vendas e estoque."
    >
      <div className="kp-palco" style={{ width: W * escala, height: H * escala, transform: `translateX(${desloca}px)` }} aria-hidden="true">
        {TELAS.map((t) => (
          <Camada key={t.id} src={t.src} pe={t.pe} k={escala} ativa={ativa === t.id} rolagem={rolagem[t.id] || 0} />
        ))}
        <Cursor {...cursor} k={escala} />
      </div>
    </div>
  );
}
