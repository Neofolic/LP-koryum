import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  BarChart3,
  Boxes,
  Building2,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileText,
  FlaskConical,
  ListChecks,
  MessagesSquare,
  Mic,
  Package,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Tv,
  UserCog,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import logoAsaas from '../assets/asaas.png';
import logoAssinko from '../assets/assinko.png';
import logoIndiko from '../assets/indiko.png';
import logoMemed from '../assets/memed.png';

// Telas de desenho, com o centro dos arcos no meio da base. No celular o radar é o mesmo,
// só que menor: arcos mais próximos e itens compactos, num palco de 440 × 425.
const GEOMETRIAS = {
  computador: { L: 1300, A: 700, raios: [330, 490, 630] },
  celular: { L: 440, A: 425, raios: [165, 270, 375] },
};
const LIMITE_CELULAR = 900;

// Cada arco gira como um radar: os itens andam sobre a linha e somem ao passar abaixo da base.
// voltaEmS = segundos para uma volta inteira; sentido 1 = anti-horário, -1 = horário;
// inicio = ângulo do primeiro item (0° = esquerda, 90° = topo), para os destaques começarem espalhados.
const ARCOS = [
  {
    raio: 330,
    voltaEmS: 45,
    sentido: 1,
    inicio: 40,
    itens: [
      { tipo: 'cartao', nome: 'Koryum AI', sub: 'Inteligência artificial', Icone: Sparkles, cor: 'marca' },
      { tipo: 'pilula', nome: 'Transcrição', Icone: Mic },
      { tipo: 'pilula', nome: 'Prontuário', Icone: ClipboardList },
      { tipo: 'pilula', nome: 'Documentos', Icone: FileText },
      { tipo: 'cartao', nome: 'Indiko', sub: 'Sistema de indicações', img: logoIndiko },
      { tipo: 'pilula', nome: 'Exames', Icone: FlaskConical },
    ],
  },
  {
    raio: 490,
    voltaEmS: 60,
    sentido: -1,
    inicio: 120,
    itens: [
      { tipo: 'cartao', nome: 'Assinko', sub: 'Assinatura eletrônica', img: logoAssinko },
      { tipo: 'pilula', nome: 'Vendas e orçamentos', Icone: ShoppingCart },
      { tipo: 'pilula', nome: 'Estoque', Icone: Package },
      { tipo: 'pilula', nome: 'Pacotes', Icone: Boxes },
      { tipo: 'cartao', nome: 'Asaas', sub: 'Pagamentos e cobranças', img: logoAsaas },
      { tipo: 'pilula', nome: 'Relatórios', Icone: BarChart3 },
      { tipo: 'pilula', nome: 'Procedimentos', Icone: Stethoscope },
      { tipo: 'pilula', nome: 'Tarefas', Icone: ListChecks },
    ],
  },
  {
    raio: 630,
    voltaEmS: 75,
    sentido: 1,
    inicio: 70,
    itens: [
      { tipo: 'cartao', nome: 'Memed', sub: 'Prescrição digital', img: logoMemed },
      { tipo: 'pilula', nome: 'Agenda', Icone: CalendarDays },
      { tipo: 'pilula', nome: 'Pacientes', Icone: Users },
      { tipo: 'pilula', nome: 'Filas e painel', Icone: Tv },
      { tipo: 'pilula', nome: 'Formulários', Icone: ClipboardCheck },
      { tipo: 'pilula', nome: 'Convênios', Icone: CreditCard },
      { tipo: 'pilula', nome: 'Equipe', Icone: UserCog },
      { tipo: 'pilula', nome: 'Unidades e salas', Icone: Building2 },
      { tipo: 'pilula', nome: 'Cardápio', Icone: UtensilsCrossed },
      { tipo: 'pilula', nome: 'Chat da equipe', Icone: MessagesSquare },
    ],
  },
];

// posição de um item no instante t (em segundos): ângulo inicial espalhado igualmente no arco
const ponto = (g, n, arco, i, t) => {
  const passo = 360 / arco.itens.length;
  const graus = arco.inicio + i * passo + arco.sentido * (360 / arco.voltaEmS) * t;
  const r = (graus * Math.PI) / 180;
  const raio = g.raios[n];
  return { x: g.L / 2 - raio * Math.cos(r), y: g.A - raio * Math.sin(r) };
};

const Simbolo = () => (
  <svg width="24" height="34" viewBox="10 7.25 12 17.5" fill="#fff" aria-hidden="true">
    <path d="M13.0349 7.5H17.7791L15.0116 17.3837H10.2674L13.0349 7.5Z" />
    <path d="M18.1744 8.29071H21.7326L16.1977 16.1977H13.8256L18.1744 8.29071Z" />
    <path d="M15.0116 16.9883H17.7791L21.7326 24.5H18.5698L15.0116 16.9883Z" />
  </svg>
);

const Conteudo = ({ item }) =>
  item.tipo === 'cartao' ? (
    <>
      {item.img ? (
        <img className="eco__selo eco__selo--logo" src={item.img} alt="" width="38" height="38" />
      ) : (
        <span className={`eco__selo eco__selo--${item.cor}`}>
          <item.Icone size={18} strokeWidth={2} aria-hidden="true" />
        </span>
      )}
      <span>
        <span className="eco__nome">{item.nome}</span>
        <span className="eco__sub">{item.sub}</span>
      </span>
    </>
  ) : (
    <>
      <item.Icone size={16} strokeWidth={1.9} aria-hidden="true" />
      {item.nome}
    </>
  );

const Centro = () => (
  <div className="eco__centro">
    <span className="eco__marca"><Simbolo /></span>
    <p className="eco__centro-nome">Koryum</p>
    <p className="eco__centro-sub">Tudo conectado em um único login</p>
  </div>
);

const Botao = ({ onClick }) => (
  <button type="button" className="cta eco__cta" onClick={onClick}>
    <span className="cta__border" aria-hidden="true" />
    <svg className="cta__icon" width="14" height="20" viewBox="10 7.25 12 17.5" fill="#fff" aria-hidden="true">
      <path d="M13.0349 7.5H17.7791L15.0116 17.3837H10.2674L13.0349 7.5Z" />
      <path d="M18.1744 8.29071H21.7326L16.1977 16.1977H13.8256L18.1744 8.29071Z" />
      <path d="M15.0116 16.9883H17.7791L21.7326 24.5H18.5698L15.0116 16.9883Z" />
    </svg>
    <span className="cta__text">Testar grátis por 15 dias</span>
  </button>
);

export default function Ecossistema({ testarGratis }) {
  // O desenho tem tamanho fixo e é reduzido inteiro para caber na largura disponível.
  const caixa = useRef(null);
  const itens = useRef([]);
  const [escala, setEscala] = useState(1);
  const [modo, setModo] = useState('computador');
  const g = GEOMETRIAS[modo];

  useLayoutEffect(() => {
    const el = caixa.current;
    if (!el) return undefined;
    const medir = () => {
      const largura = el.clientWidth;
      const m = largura < LIMITE_CELULAR ? 'celular' : 'computador';
      setModo(m);
      setEscala(Math.min(1, largura / GEOMETRIAS[m].L));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // movimento do radar: só roda com a seção na tela e sem "reduzir movimento" ligado
  useEffect(() => {
    const el = caixa.current;
    if (!el) return undefined;
    const parado = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let quadro = 0;
    let inicio = 0;
    let visivel = false;
    const desenhar = (t) => {
      let k = 0;
      ARCOS.forEach((arco, n) =>
        arco.itens.forEach((_, i) => {
          const no = itens.current[k++];
          if (!no) return;
          const { x, y } = ponto(g, n, arco, i, t);
          no.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
          // some suavemente ao chegar perto da base
          no.style.opacity = String(Math.max(0, Math.min(1, (g.A - 20 - y) / (g.A * 0.085))));
        })
      );
    };
    const passo = (agora) => {
      if (!inicio) inicio = agora;
      desenhar((agora - inicio) / 1000);
      quadro = requestAnimationFrame(passo);
    };
    desenhar(0);
    if (parado) return undefined;
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      cancelAnimationFrame(quadro);
      if (visivel) {
        // continua de onde parou
        const tempoAtual = inicio ? (performance.now() - inicio) / 1000 : 0;
        inicio = performance.now() - tempoAtual * 1000;
        quadro = requestAnimationFrame(passo);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [g]);

  let k = 0;
  return (
    <section className="eco" id="funcionalidades" aria-labelledby="eco-titulo">
      <div className="eco__cab">
        <span className="faq__badge">Ecossistema Koryum</span>
        <h2 id="eco-titulo">Tudo o que a sua clínica precisa, da recepção ao consultório</h2>
        <p>Agenda, prontuário, vendas, estoque e inteligência artificial criados para funcionar juntos na rotina da clínica.</p>
        <Botao onClick={testarGratis} />
      </div>

      {/* radar: o mesmo desenho no computador e no celular, só muda o tamanho */}
      <div className={`eco__orbita eco__orbita--${modo}`} ref={caixa} style={{ height: g.A * escala }}>
        <div className={`eco__palco eco__palco--${modo}`} style={{ width: g.L, height: g.A, transform: `translateX(-50%) scale(${escala})` }}>
          <div className="eco__luz" aria-hidden="true" />
          {/* o desenho dos arcos sobra 400 px para cada lado, para as linhas seguirem até a borda da tela */}
          <svg className="eco__arcos" viewBox={`-400 0 ${g.L + 800} ${g.A}`} style={{ left: -400, width: g.L + 800 }} aria-hidden="true">
            {g.raios.map((r) => (
              <circle key={r} cx={g.L / 2} cy={g.A} r={r} />
            ))}
          </svg>
          <ul className="eco__itens">
            {ARCOS.flatMap((arco) =>
              arco.itens.map((item) => {
                const idx = k++;
                return (
                  <li
                    key={item.nome}
                    ref={(n) => (itens.current[idx] = n)}
                    className={item.tipo === 'cartao' ? 'eco__cartao' : 'eco__pilula'}
                  >
                    <Conteudo item={item} />
                  </li>
                );
              })
            )}
          </ul>
          <Centro />
        </div>
      </div>

    </section>
  );
}
