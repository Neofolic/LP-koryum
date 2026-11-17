import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Mic,
  Package,
  ShoppingCart,
  Users,
  Zap,
} from 'lucide-react';

// Dois palcos de tamanho fixo (computador e celular), reduzidos inteiros para caber na largura.
// altura do desenho do computador sem as três capacidades (módulos terminam em y 370 + rótulo)
const ALTURA_SEM_RECURSOS = 440;

const PALCOS = {
  computador: {
    L: 1240,
    A: 600,
    nucleo: { x: 620, y: 200, r: 88 },
    mods: [
      { nome: 'Agenda', Icone: CalendarDays, x: 70, y: 30 },
      { nome: 'Pacientes', Icone: Users, x: 130, y: 200 },
      { nome: 'Prontuário', Icone: ClipboardList, x: 70, y: 370 },
      { nome: 'Vendas', Icone: ShoppingCart, x: 1170, y: 30 },
      { nome: 'Estoque', Icone: Package, x: 1110, y: 200 },
      { nome: 'Relatórios', Icone: BarChart3, x: 1170, y: 370 },
    ],
  },
  celular: {
    L: 400,
    A: 340,
    nucleo: { x: 200, y: 170, r: 64 },
    mods: [
      { nome: 'Agenda', Icone: CalendarDays, x: 36, y: 40 },
      { nome: 'Pacientes', Icone: Users, x: 36, y: 170 },
      { nome: 'Prontuário', Icone: ClipboardList, x: 36, y: 300 },
      { nome: 'Vendas', Icone: ShoppingCart, x: 364, y: 40 },
      { nome: 'Estoque', Icone: Package, x: 364, y: 170 },
      { nome: 'Relatórios', Icone: BarChart3, x: 364, y: 300 },
    ],
  },
};

const R_MOD = 30; // raio do círculo de cada módulo
const R_NUC = 88; // raio do anel de luz do núcleo (as linhas terminam nele)

// curva suave do módulo até o núcleo, saindo na horizontal dos dois lados
const curva = (m, n) => {
  const s = m.x < n.x ? 1 : -1;
  const x0 = m.x + s * R_MOD;
  const x1 = n.x - s * (n.r ?? R_NUC);
  const dx = Math.abs(x1 - x0);
  return `M${x0} ${m.y} C${x0 + s * dx * 0.55} ${m.y} ${x1 - s * dx * 0.45} ${n.y} ${x1} ${n.y}`;
};

const RECURSOS = [
  { Icone: MessageSquare, nome: 'Pergunte sobre a clínica', texto: 'Quantos retornos tenho amanhã? A resposta sai dos seus dados.' },
  { Icone: Zap, nome: 'Peça e ele faz', texto: 'Agendar, remarcar ou abrir um cadastro, direto pela conversa.' },
  { Icone: Mic, nome: 'Transcrição da consulta', texto: 'A conversa vira texto no prontuário, e o áudio é descartado.' },
];

const Simbolo = ({ tamanho = 22, cor = '#fff' }) => (
  <svg width={tamanho} height={tamanho * 1.46} viewBox="10 7.25 12 17.5" fill={cor} aria-hidden="true">
    <path d="M13.0349 7.5H17.7791L15.0116 17.3837H10.2674L13.0349 7.5Z" />
    <path d="M18.1744 8.29071H21.7326L16.1977 16.1977H13.8256L18.1744 8.29071Z" />
    <path d="M15.0116 16.9883H17.7791L21.7326 24.5H18.5698L15.0116 16.9883Z" />
  </svg>
);

// núcleo: anel de luz (um traço fino brilhante + ondas de luz por dentro, que giram e se deformam)
// com o centro escuro e o símbolo do Koryum. Sem esfera branca.
const Nucleo = ({ x, y, tamanho }) => (
  <div className="ai__nucleo" style={{ left: x, top: y, width: tamanho, height: tamanho }}>
    <span className="ai__aura" aria-hidden="true" />
    <span className="ai__luz" aria-hidden="true">
      <span className="ai__giro ai__giro--1"><i className="ai__onda" /></span>
      <span className="ai__giro ai__giro--2"><i className="ai__onda" /></span>
      <span className="ai__giro ai__giro--3"><i className="ai__onda" /></span>
      <i className="ai__anel" />
    </span>
    <span className="ai__miolo">
      <Simbolo tamanho={20} />
    </span>
  </div>
);

function Palco({ tipo, dados, refPalco, comRecursos }) {
  const caixa = useRef(null);
  const [escala, setEscala] = useState(1);
  // entre 721 e 1100 px as três capacidades saem do desenho e viram uma linha embaixo
  const [compacto, setCompacto] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1100px)');
    const ver = () => setCompacto(mq.matches);
    ver();
    mq.addEventListener('change', ver);
    return () => mq.removeEventListener('change', ver);
  }, []);
  useLayoutEffect(() => {
    const el = caixa.current;
    if (!el) return undefined;
    const medir = () => setEscala(Math.min(1, el.clientWidth / dados.L));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dados.L]);

  const { L, A, nucleo, mods } = dados;
  return (
    <div className={`ai__mapa ai__mapa--${tipo}`} ref={caixa} style={{ height: (comRecursos && compacto ? ALTURA_SEM_RECURSOS : A) * escala }}>
      <div className="ai__palco" ref={refPalco} style={{ width: L, height: A, transform: `translateX(-50%) scale(${escala})` }}>
        <span className="ai__pontilhado" style={{ left: nucleo.x, top: nucleo.y }} aria-hidden="true" />
        <svg className="ai__linhas" viewBox={`0 0 ${L} ${A}`} aria-hidden="true">
          <defs>
            <filter id={`ai-borra-${tipo}`} x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            {/* cada linha começa apagada no módulo e acende chegando ao núcleo */}
            {mods.map((m, i) => (
              <linearGradient key={m.nome} id={`ai-luz-${tipo}-${i}`} gradientUnits="userSpaceOnUse" x1={m.x} y1={m.y} x2={nucleo.x} y2={nucleo.y}>
                <stop offset="0" stopColor={m.x < nucleo.x ? '#0d89f1' : '#2ebe6c'} stopOpacity="0.25" />
                <stop offset="0.7" stopColor={m.x < nucleo.x ? '#3aa3ff' : '#3fd07e'} stopOpacity="0.85" />
                <stop offset="1" stopColor="#c8f3ff" stopOpacity="1" />
              </linearGradient>
            ))}
          </defs>
          {mods.map((m, i) => {
            const d = curva(m, nucleo);
            return (
              <g key={m.nome}>
                <path d={d} className="ai__linha-brilho" stroke={`url(#ai-luz-${tipo}-${i})`} filter={`url(#ai-borra-${tipo})`} />
                <path d={d} className="ai__linha" stroke={`url(#ai-luz-${tipo}-${i})`} />
                {/* pulso de luz que corre do módulo até o núcleo (movido pelo GSAP) */}
                <path d={`${d} L${nucleo.x} ${nucleo.y}`} className="ai__caminho" />
                <circle r="3.5" className={`ai__pulso ai__pulso--${m.x < nucleo.x ? 'e' : 'd'}`} opacity="0" />
              </g>
            );
          })}
        </svg>

        {mods.map((m) => (
          <span key={m.nome} className={`ai__mod${m.x > nucleo.x ? ' ai__mod--d' : ''}`} style={{ left: m.x, top: m.y }} title={m.nome}>
            <m.Icone size={22} strokeWidth={1.8} aria-hidden="true" />
            <span className="ai__mod-nome">{m.nome}</span>
          </span>
        ))}

        <Nucleo x={nucleo.x} y={nucleo.y} tamanho={nucleo.r * 2} />

        {comRecursos && (
          <ul className="ai__recursos">
            {RECURSOS.map(({ Icone, nome, texto }, i) => (
              <li key={nome} className={`ai__recurso ai__recurso--${i}`}>
                <span className="ai__recurso-icone"><Icone size={20} strokeWidth={1.9} aria-hidden="true" /></span>
                <p className="ai__recurso-nome">{nome}</p>
                <p className="ai__recurso-texto">{texto}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Seção Koryum AI no modelo da referência: fundo claro, núcleo em esfera no centro, módulos nas pontas
// ligados por curvas, e as três capacidades em arco embaixo. Animações com GSAP ao entrar na tela.
export default function KoryumAI({ testarGratis }) {
  const secao = useRef(null);
  const palcoPc = useRef(null);
  const palcoCel = useRef(null);

  useEffect(() => {
    const el = secao.current;
    if (!el) return undefined;
    const parado = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {}, el);
    const pulsos = [];

    if (parado) return () => ctx.revert();

    const iniciar = (palco) => {
      if (!palco || palco.dataset.animado) return;
      palco.dataset.animado = '1';
      const linhas = [...palco.querySelectorAll('.ai__linha, .ai__linha-brilho')];
      ctx.add(() => {
        linhas.forEach((l) => {
          const c = l.getTotalLength();
          gsap.set(l, { strokeDasharray: c, strokeDashoffset: c });
        });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from(palco.querySelector('.ai__nucleo'), { scale: 0.7, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)' })
          .from(palco.querySelectorAll('.ai__mod'), { scale: 0.6, autoAlpha: 0, duration: 0.5, stagger: 0.06 }, '-=0.4')
          .to(linhas, { strokeDashoffset: 0, duration: 1.1, stagger: 0.07, ease: 'power2.inOut' }, '-=0.3')
          .from(palco.querySelectorAll('.ai__recurso'), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.12 }, '-=0.6');

        // uma bolinha por vez de cada módulo, indo até o centro do núcleo; os módulos se revezam
        const grupos = [...palco.querySelectorAll('.ai__linhas g')];
        const ordem = [0, 3, 1, 4, 2, 5]; // alterna esquerda e direita
        const VIAGEM = 3.4; // viagem mais longa e sem tranco
        const INTERVALO = 0.9;
        const ciclo = ordem.length * INTERVALO; // cada módulo solta uma bolinha a cada ciclo
        ordem.forEach((idx, k) => {
          const g = grupos[idx];
          if (!g) return;
          const l = g.querySelector('.ai__caminho');
          const ponto = g.querySelector('.ai__pulso');
          const c = l.getTotalLength();
          const prog = { t: 0 };
          pulsos.push(
            gsap.to(prog, {
              t: 1,
              duration: VIAGEM,
              ease: 'sine.inOut',
              repeat: -1,
              repeatDelay: Math.max(0, ciclo - VIAGEM),
              delay: 1.6 + k * INTERVALO,
              onUpdate: () => {
                const p = l.getPointAtLength(prog.t * c);
                ponto.setAttribute('cx', p.x);
                ponto.setAttribute('cy', p.y);
                // aparece ao sair do módulo e só some quando chega no centro
                const o = prog.t < 0.18 ? prog.t / 0.18 : prog.t > 0.82 ? (1 - prog.t) / 0.18 : 1;
                ponto.setAttribute('opacity', String(o));
              },
            })
          );
        });

        // ondas de luz: mudam de forma o tempo todo, com valores sorteados a cada ciclo
        const raio = () => {
          const r = () => gsap.utils.random(34, 66, 1);
          return `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;
        };
        palco.querySelectorAll('.ai__onda').forEach((onda) => {
          pulsos.push(
            gsap.to(onda, {
              borderRadius: raio,
              x: () => gsap.utils.random(-8, 8),
              y: () => gsap.utils.random(-8, 8),
              scale: () => gsap.utils.random(0.93, 1.07),
              duration: () => gsap.utils.random(1.1, 2),
              ease: 'sine.inOut',
              repeat: -1,
              repeatRefresh: true,
            })
          );
        });

        // a aura "respira"
        pulsos.push(gsap.to(palco.querySelector('.ai__aura'), { scale: 1.18, opacity: 1, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
      });
    };

    // começa quando a seção entra na tela; pausa os pulsos fora dela
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          [palcoPc.current, palcoCel.current].forEach((p) => p && p.offsetParent && iniciar(p));
          pulsos.forEach((t) => t.resume());
        } else {
          pulsos.forEach((t) => t.pause());
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section className="ai" id="koryum-ai" aria-labelledby="ai-titulo" ref={secao}>
      <div className="ai__dentro">
        <div className="ai__cab">
          <p className="ai__selo">
            <span className="ai__selo-marca"><Simbolo tamanho={9} /></span>
            Koryum AI em todas as telas
          </p>
          <h2 id="ai-titulo">
            Um <strong className="ai__destaque">núcleo</strong> que conhece a sua clínica inteira
          </h2>
          <p className="ai__apoio">
            O Koryum AI lê a agenda, os pacientes, o prontuário e as vendas.{' '}
            <br />
            Pergunte em português e ele responde ou faz a tarefa por você.
          </p>
          <button type="button" className="cta ai__cta" onClick={testarGratis}>
            <span className="cta__border" aria-hidden="true" />
            <span className="cta__text">Testar grátis por 15 dias</span>
            <ArrowRight className="cta__icon" size={18} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>

        <Palco tipo="computador" dados={PALCOS.computador} refPalco={palcoPc} comRecursos />
        <Palco tipo="celular" dados={PALCOS.celular} refPalco={palcoCel} />

        <ul className="ai__recursos-lista">
          {RECURSOS.map(({ Icone, nome, texto }) => (
            <li key={nome}>
              <span className="ai__recurso-icone"><Icone size={20} strokeWidth={1.9} aria-hidden="true" /></span>
              <p className="ai__recurso-nome">{nome}</p>
              <p className="ai__recurso-texto">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
