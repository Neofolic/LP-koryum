import { useEffect, useRef, useState } from 'react';
import {
  CalendarDays, Check, ChevronDown, MousePointer2, Search, SlidersHorizontal, QrCode, ScanBarcode, ShoppingBag, Sparkles, Zap,
} from 'lucide-react';

// Recursos: 5 destaques em bento grid, com ilustrações desenhadas em código (animadas só com a seção na tela).
// Só entra aqui o que existe nas telas do Figma KORYUM V2.

// ---------- ilustrações ----------
// Cada uma tem um palco de tamanho fixo (as ligações ficam exatas), centralizado e reduzido no celular.

// agenda: recortes da interface real (abas de agendas e novo agendamento com encaixe), no estilo de produto limpo
const AGENDAS_MENU = ['Laser', 'Dra. Ana Lima', 'Harmonização'];

function IlAgenda() {
  return (
    <div className="rx-palco rx-palco--ag">
      <div className="rx-painel rx-painel--e">
        <b className="rx-painel__tit">Agenda</b>
        <small>Agendamentos da unidade</small>
        <div className="rx-abas"><span className="rx-aba rx-aba--on">Todos</span><span className="rx-aba">Avaliações</span><span className="rx-aba">+3 agendas</span></div>
        <div className="rx-semana-mini">
          {['Seg', 'Ter', 'Qua'].map((d) => <span key={d}>{d}</span>)}
          <i className="rx-mini rx-mini--azul" style={{ gridColumn: 1, gridRow: 2 }} />
          <i className="rx-mini rx-mini--verde" style={{ gridColumn: 3, gridRow: 3 }} />
          <i className="rx-mini rx-mini--roxo" style={{ gridColumn: 2, gridRow: 4 }} />
        </div>
      </div>
      <div className="rx-menu">
        <span className="rx-menu__luz" />
        {AGENDAS_MENU.map((t) => <span key={t} className="rx-menu__item"><CalendarDays size={13} />{t}</span>)}
        <span className="rx-menu__sep" />
        <span className="rx-menu__item rx-menu__item--suave"><SlidersHorizontal size={13} />Gerenciar agendas</span>
      </div>
      <span className="rx-cursor"><MousePointer2 size={16} /><span>Recepção</span></span>

      <div className="rx-painel rx-painel--d">
        <b className="rx-painel__tit">Novo agendamento</b>
        <small>Unidade Centro</small>
        <span className="rx-rotulo">Paciente</span>
        <span className="rx-campo"><Search size={12} />Maria Souza</span>
        <span className="rx-rotulo">Profissional</span>
        <span className="rx-campo"><span className="rx-ini rx-ini--p">AL</span>Dra. Ana Lima<ChevronDown size={12} className="rx-campo__fim" /></span>
        <div className="rx-aviso">
          <span><b>Horário ocupado</b><small>Pedro A. às 09:00</small></span>
          <span className="rx-chave"><i /></span><span className="rx-chave__txt">Encaixe</span>
        </div>
        <span className="rx-marcar"><span className="rx-caixa rx-caixa--on"><Check size={10} strokeWidth={3.2} /></span>Confirmação por WhatsApp</span>
      </div>
    </div>
  );
}

const ONDINHA = [6, 10, 16, 9, 18, 12, 20, 14, 8, 16, 7, 12, 5, 9, 14, 6, 11, 17, 8, 13];

// falas e resumo reais das telas "Revisar transcrição" do Figma KORYUM V2
const FALAS = [
  ['Profissional', '00:12', 'Bom dia! Me conta o que te trouxe aqui hoje.', 300],
  ['Paciente', '00:18', 'Meu cabelo começou a cair na frente há dois anos.', 2000],
  ['Profissional', '00:31', 'Alguém na sua família tem calvície?', 3900],
  ['Paciente', '00:35', 'Meu pai, sim. Ele começou bem cedo.', 5300],
];
const RESUMO = [
  ['Queixa principal', 'Queda de cabelo na região frontal há cerca de 2 anos, com piora nos últimos 6 meses.', 9500],
  ['Histórico', 'Nega doenças crônicas. Usa anticoncepcional oral. Pai com calvície.', 10000],
  ['Conduta', 'Tricoscopia na próxima consulta e pedido de hemograma, ferritina e vitamina D.', 10500],
];
// linha do tempo da animação, em ms
const T = { cursor1: 6900, clique1: 7800, gera: 8100, resumo: 9300, cursor2: 11700, clique2: 12500, salvo: 12700, some: 14600, fim: 15100 };
const MS_LETRA = 30;
const MS_LETRA_RESUMO = 12;

function useRelogio(ativo, duracao = T.fim) {
  const [t, setT] = useState(0);
  const [reduzido, setReduzido] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduzido(mq.matches);
    if (!ativo || mq.matches) return undefined;
    const inicio = performance.now();
    const id = setInterval(() => setT((performance.now() - inicio) % duracao), 40);
    return () => clearInterval(id);
  }, [ativo, duracao]);
  return reduzido ? null : t;
}

// o relógio acompanha os horários das falas: (ms da animação, segundos da consulta)
const MARCOS = [[0, 10], [150, 12], [1850, 18], [3750, 31], [5150, 35], [7800, 41]];
function segundos(t) {
  for (let i = 1; i < MARCOS.length; i += 1) {
    const [t0, s0] = MARCOS[i - 1];
    const [t1, s1] = MARCOS[i];
    if (t <= t1) return Math.floor(s0 + ((t - t0) / (t1 - t0)) * (s1 - s0));
  }
  return MARCOS[MARCOS.length - 1][1];
}

const digitado = (txt, t, de, ms) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((t - de) / ms))));

function IlTranscricao({ ativo }) {
  const relogio = useRelogio(ativo);
  const t = relogio ?? 8000; // movimento reduzido: transcrição completa, parada
  const fase = relogio === null ? 'grava' : t < T.gera ? 'grava' : t < T.resumo ? 'gera' : 'resumo';
  const seg = segundos(Math.min(t, T.clique1));
  const rola = t >= FALAS[3][3] - 200;
  const cursor = relogio === null ? 'fora' : t >= T.cursor1 && t < T.gera + 200 ? 'encerrar' : t >= T.cursor2 && t < T.salvo + 600 ? 'aprovar' : 'fora';
  const clicando = (t >= T.clique1 && t < T.clique1 + 220) || (t >= T.clique2 && t < T.clique2 + 220);

  return (
    <div className={`rx-palco rx-palco--tr${t >= T.some ? ' rx-palco--some' : ''}`}>
      <div className="rx-painel rx-painel--tr">
        <div className="rx-grava">
          {fase === 'grava' ? (
            <>
              <span className="rx-grava__pausa"><i /><i /></span>
              <span className="rx-grava__txt"><small>Transcrevendo com Koryum AI</small><b>{`00:${String(seg).padStart(2, '0')}`}</b></span>
              <span className="rx-ondinha">{ONDINHA.map((h, i) => <i key={i} style={{ height: h, animationDelay: `${i * 0.06}s` }} />)}</span>
              <span className={`rx-botao${clicando && cursor === 'encerrar' ? ' rx-botao--clique' : ''}`}><span className="rx-botao__stop" />Encerrar</span>
            </>
          ) : (
            <>
              <span className="rx-grava__ia"><Sparkles size={15} /></span>
              <span className="rx-grava__txt">
                <b>{fase === 'gera' ? 'Gerando resumo com Koryum AI' : 'Revisar transcrição'}</b>
                <small>Maria Souza · Avaliação inicial · 18 min de conversa</small>
              </span>
            </>
          )}
        </div>

        <div className="rx-corpo">
          <div className={`rx-vista${fase === 'grava' ? ' rx-vista--on' : ''}`}>
            <div className="rx-falas">
              <div className="rx-falas__rolo" style={{ transform: rola ? 'translateY(-42px)' : 'none' }}>
                {FALAS.map(([quem, hora, txt, de]) => {
                  const parcial = digitado(txt, t, de, MS_LETRA);
                  const escrevendo = parcial.length > 0 && parcial.length < txt.length;
                  return (
                    <div key={hora} className={`rx-fala${t >= de - 150 ? ' rx-fala--on' : ''}`}>
                      <span className={`rx-fala__quem${quem === 'Paciente' ? ' rx-fala__quem--p' : ''}`}>{quem}<small>{hora}</small></span>
                      <span className="rx-fala__txt">{parcial}{escrevendo && <i className="rx-caret" />}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={`rx-vista${fase === 'gera' ? ' rx-vista--on' : ''}`}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="rx-campo-r">
                <span className="rx-esq rx-esq--rot" />
                <span className="rx-esq rx-esq--box" />
              </div>
            ))}
          </div>

          <div className={`rx-vista${fase === 'resumo' ? ' rx-vista--on' : ''}`}>
            {RESUMO.map(([rot, txt, de]) => (
              <div key={rot} className="rx-campo-r">
                <span className="rx-campo-r__rot">{rot}</span>
                <span className="rx-campo-r__box">{digitado(txt, t, de, MS_LETRA_RESUMO)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`rx-rodape${fase === 'resumo' ? ' rx-rodape--on' : ''}`}>
          <span className="rx-botao">Salvar rascunho</span>
          <span className={`rx-botao rx-botao--pri${clicando && cursor === 'aprovar' ? ' rx-botao--clique' : ''}`}>Aprovar e salvar</span>
        </div>
      </div>

      <span className={`rx-cursor rx-cursor--${cursor}`}><MousePointer2 size={16} /><span>Dra. Ana</span></span>
      <span className={`rx-salvo${t >= T.salvo && fase === 'resumo' ? ' rx-salvo--on' : ''}`}>
        <span className="rx-ok"><Check size={11} strokeWidth={3} /></span>Salvo no prontuário de Maria Souza
      </span>
    </div>
  );
}

// tarefas: o modelo ligado ao procedimento gera as tarefas sozinho (nomes e números das telas de Tarefas do Figma)
const TAREFAS_MODELO = [
  ['Conferir exames pré-operatórios', '4 subtarefas', 'TAR-110'],
  ['Enviar orientações pré-operatórias', '3 subtarefas', 'TAR-111'],
  ['Confirmar presença e jejum', '2 subtarefas', 'TAR-112'],
];
const TT = { chave: 400, primeira: 800, passo: 750, criando: 600, some: 6600, fim: 7100 };
const ALTURA_TAREFA = 40;
const VAO_TAREFA = 8;

function IlTarefas({ ativo }) {
  const relogio = useRelogio(ativo, TT.fim);
  const t = relogio ?? TT.some - 1; // movimento reduzido: tudo criado, parado
  const ligada = t >= TT.chave;
  const estado = (i) => {
    const ini = TT.primeira + i * TT.passo;
    if (t < ini) return 'oculta';
    return t < ini + TT.criando ? 'criando' : 'pronta';
  };
  const visiveis = TAREFAS_MODELO.filter((_, i) => estado(i) !== 'oculta').length;
  const linha = visiveis ? (visiveis - 1) * (ALTURA_TAREFA + VAO_TAREFA) + ALTURA_TAREFA / 2 : 0;

  return (
    <div className={`rx-palco rx-palco--tf${relogio !== null && t >= TT.some ? ' rx-palco--some' : ''}`}>
      <div className="rx-modelo">
        <span className="rx-modelo__ico"><Zap size={14} /></span>
        <span className="rx-modelo__txt"><b>Tarefas do modelo</b><small>Nascem quando o Transplante capilar é agendado.</small></span>
        <span className={`rx-chave${ligada ? ' rx-chave--on' : ''}`}><i /></span>
      </div>
      <div className="rx-arvore">
        <span className="rx-arvore__tronco" style={{ height: linha }} />
        {TAREFAS_MODELO.map(([titulo, sub, id], i) => {
          const e = estado(i);
          return (
            <div key={id} className={`rx-galho rx-galho--${e}`} style={{ '--esmaece': [1, 1, 0.75][i] }}>
              {e === 'criando' ? (
                <span className="rx-galho__criando"><Sparkles size={13} />Criando tarefa do modelo...</span>
              ) : (
                <>
                  <span className="rx-galho__txt"><b>{titulo}</b><small>{sub}</small></span>
                  <span className="rx-galho__id"><Zap size={10} />{id}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// venda: pacote com sinal pago; o restante é recebido e a venda fecha (rótulos das telas de Vendas do Figma)
const VENDA = { total: 110000, sinal: 30000 }; // em centavos, para a conta dar exata
const TV = { cursor: 1500, clique: 2300, pago: 2500, conta: 800, some: 6900, fim: 7400 };

// QR da etiqueta desenhado em grade 21x21: três marcadores nos cantos e módulos de um sorteio fixo (ilustrativo)
const QR_N = 21;
const QR_MODULOS = (() => {
  const marcador = (x, y) => {
    for (const [ox, oy] of [[0, 0], [14, 0], [0, 14]]) {
      const dx = x - ox;
      const dy = y - oy;
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) {
        const borda = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const miolo = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return borda || miolo ? 1 : 0;
      }
      if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) return 0;
    }
    return null;
  };
  let semente = 20261116;
  const sorteio = () => {
    semente = (semente * 1103515245 + 12345) % 2147483648;
    return semente / 2147483648;
  };
  const lista = [];
  for (let y = 0; y < QR_N; y += 1) {
    for (let x = 0; x < QR_N; x += 1) {
      const m = marcador(x, y);
      if (m === 1 || (m === null && sorteio() < 0.5)) lista.push([x, y]);
    }
  }
  return lista;
})();

function QrEtiqueta() {
  return (
    <svg viewBox={`0 0 ${QR_N} ${QR_N}`} shapeRendering="crispEdges" aria-hidden="true">
      {QR_MODULOS.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)}
    </svg>
  );
}
const brl = (c) => `R$ ${(c / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const CONFETE = Array.from({ length: 22 }, (_, i) => ({
  x: ((i * 37) % 100) - 50,
  y: 50 + ((i * 53) % 70),
  r: (i * 71) % 360,
  d: (i % 6) * 40,
  cor: ['#0d89f1', '#2ebe6c', '#0b74cc', '#17b26a'][i % 4],
  larga: i % 3 === 0,
}));

function IlVendas({ ativo }) {
  const relogio = useRelogio(ativo, TV.fim);
  const t = relogio ?? TV.pago + TV.conta; // movimento reduzido: venda já paga, parada
  const pago = t >= TV.pago;
  const progresso = pago ? Math.min(1, (t - TV.pago) / TV.conta) : 0;
  // a contagem anda de real em real e termina exatamente no total
  const recebido = pago ? VENDA.sinal + Math.round(((VENDA.total - VENDA.sinal) / 100) * (1 - (1 - progresso) ** 3)) * 100 : VENDA.sinal;
  const pct = Math.round((recebido / VENDA.total) * 100);
  const cursor = relogio !== null && t >= TV.cursor && t < TV.pago + 250;
  const clicando = t >= TV.clique && t < TV.clique + 200;

  return (
    <div className={`rx-palco rx-palco--vd${relogio !== null && t >= TV.some ? ' rx-palco--some' : ''}`}>
      <div className="rx-fantasma-c rx-fantasma-c--e"><i /><i /><i /><i /></div>
      <div className="rx-fantasma-c rx-fantasma-c--d"><i /><i /><i /><i /></div>

      <div className="rx-venda">
        <div className="rx-venda__topo">
          <span className="rx-venda__ico"><ShoppingBag size={14} /></span>
          <span className="rx-venda__tit"><b>Venda nº 1042</b><small>Maria Souza · Pacote Laser</small></span>
          <span className={`rx-selo${pago ? ' rx-selo--pago' : ''}`}>{pago ? 'Pago' : 'A receber'}</span>
        </div>
        <div className="rx-venda__valor">
          <small>{pago ? 'Total recebido' : 'Restante a pagar'}</small>
          <b className={pago ? 'rx-verde' : ''}>{brl(pago ? recebido : VENDA.total - VENDA.sinal)}</b>
          <span className={`rx-festa${relogio !== null && pago ? ' rx-festa--on' : ''}`} aria-hidden="true">
            {CONFETE.map((c, i) => (
              <i key={i} style={{ '--x': `${c.x * 2.4}px`, '--y': `${c.y}px`, '--r': `${c.r}deg`, animationDelay: `${c.d}ms`, background: c.cor, width: c.larga ? 11 : 5, height: c.larga ? 4 : 10 }} />
            ))}
          </span>
        </div>
        <div className="rx-venda__barra"><i style={{ width: `${(recebido / VENDA.total) * 100}%` }} /></div>
        <div className="rx-venda__pct"><span>Sinal de {brl(VENDA.sinal)}</span><span>{pct}% pago</span></div>
        {pago ? (
          <span className="rx-venda__pix"><span className="rx-ok"><QrCode size={11} strokeWidth={2.5} /></span>Pix recebido agora</span>
        ) : (
          <span className={`rx-botao rx-botao--pri rx-botao--largo${clicando ? ' rx-botao--clique' : ''}`}>Receber pagamento</span>
        )}
        <span className={`rx-cursor rx-cursor--vd${cursor ? ' rx-cursor--vd-on' : ''}`}><MousePointer2 size={16} /><span>Recepção</span></span>
      </div>
    </div>
  );
}

// estoque: o leitor lê o QR da etiqueta, o item é encontrado e os lotes aparecem com a validade (dados das telas de Estoque do Figma)
const CODIGO = '1856471971';
const LOTES = [
  ['#LDA1421516', '10/06/2027', 'Dentro da validade', 'ok'],
  ['#LDA1421511', '30/07/2026', 'Vencimento próximo', 'perto'],
  ['#LDA1421498', '15/05/2026', 'Vencido', 'vencido'],
];
const TE = { leitura: 300, lido: 1700, lote: 2100, passo: 380, alerta: 3400, some: 7200, fim: 7700 };

function IlEstoque({ ativo }) {
  const relogio = useRelogio(ativo, TE.fim);
  const t = relogio ?? TE.some - 1; // movimento reduzido: tudo já lido, parado
  const lendo = relogio !== null && t >= TE.leitura && t < TE.lido;
  const lido = t >= TE.lido;

  return (
    <div className={`rx-palco rx-palco--es${relogio !== null && t >= TE.some ? ' rx-palco--some' : ''}`}>
      <div className={`rx-etiqueta${lido ? ' rx-etiqueta--lida' : ''}`}>
        <span className="rx-etiqueta__qr">
          <QrEtiqueta />
          {lendo && <i className="rx-etiqueta__leitura" />}
          <span className="rx-etiqueta__cantos" />
        </span>
        <span className="rx-etiqueta__txt">
          {lido ? (
            <>
              <b>Luva Nitrílica G</b>
              <small>{CODIGO} · 40 itens</small>
              <span className="rx-status rx-status--ok">Estoque normal</span>
            </>
          ) : (
            <>
              <b className="rx-etiqueta__lendo"><ScanBarcode size={14} />Lendo código...</b>
              <small>Aponte o leitor para a etiqueta</small>
            </>
          )}
        </span>
      </div>

      <div className={`rx-item${lido ? ' rx-item--on' : ''}`}>
        {LOTES.map(([lote, vence, status, tom], i) => (
          <div key={lote} className={`rx-lote${t >= TE.lote + i * TE.passo ? ' rx-lote--on' : ''}${tom === 'vencido' && t >= TE.alerta ? ' rx-lote--alerta' : ''}`}>
            <span className="rx-lote__id">{lote}</span>
            <span className="rx-lote__data">{vence}</span>
            <span className={`rx-status rx-status--${tom}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DESTAQUES = [
  { classe: 'agenda', titulo: 'Agenda de toda a clínica', texto: 'Várias agendas, salas e unidades na mesma tela, com encaixe e confirmação do paciente pelo WhatsApp.', Il: IlAgenda },
  { classe: 'transc', titulo: 'A consulta vira prontuário', texto: 'O Koryum AI transcreve a conversa e entrega a evolução pronta para revisar. A receita sai pela Memed.', Il: IlTranscricao },
  { classe: 'tarefas', titulo: 'Tarefas que se criam sozinhas', texto: 'Ao agendar, as tarefas nascem com responsável, prazo e subtarefas.', Il: IlTarefas },
  { classe: 'vendas', titulo: 'Venda com cobrança na hora', texto: 'Pacotes, sinal e descontos, com cobrança por QR Code ligada ao paciente.', Il: IlVendas },
  { classe: 'estoque', titulo: 'Estoque com lote e validade', texto: 'Bipe o código de barras e veja o que está vencendo ou acabando.', Il: IlEstoque },
];

export default function Recursos() {
  const ref = useRef(null);
  const [ativo, setAtivo] = useState(false);

  // cada ilustração tem uma largura mínima de desenho: acima dela o palco acompanha o card,
  // abaixo dela o palco inteiro encolhe na mesma proporção (nada se espreme nem é cortado)
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const MEDIDAS = { agenda: [560, 256], transc: [560, 256], tarefas: [350, 216], vendas: [350, 216], estoque: [350, 216] };
    const caixas = el.querySelectorAll('.rec__ilustra');
    const ro = new ResizeObserver((itens) => {
      for (const { target } of itens) {
        const classe = [...target.parentElement.classList].find((c) => c.startsWith('rec__cartao--'))?.slice(13);
        const [minimo, visivel] = MEDIDAS[classe] || [350, 216];
        const folga = window.innerWidth <= 720 ? 16 : 24;
        const util = target.clientWidth - folga * 2;
        const k = Math.min(1, util / minimo);
        target.style.setProperty('--k', k.toFixed(4));
        target.style.setProperty('--w', `${(util / k).toFixed(2)}px`);
        target.style.setProperty('--pad', `${folga}px`);
        target.style.setProperty('--hv', `${visivel}px`);
      }
    });
    caixas.forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, []);

  // as animações só rodam com a seção na tela
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setAtivo(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`rec${ativo ? ' rec--ativo' : ''}`} id="recursos" aria-labelledby="rec-titulo">
      <div className="rec__cab">
        <span className="faq__badge">Recursos</span>
        <h2 id="rec-titulo">A rotina inteira da clínica, num sistema só</h2>
        <p>Do primeiro horário na agenda ao relatório do fim do mês, cada parte conversa com a outra.</p>
      </div>

      <ul className="rec__bento">
        {DESTAQUES.map(({ classe, titulo, texto, Il }) => (
          <li key={classe} className={`rec__cartao rec__cartao--${classe}`}>
            <div className="rec__ilustra" aria-hidden="true"><Il ativo={ativo} /></div>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
