import { FAIXA_TOPO } from '../config.js';

// Faixa no topo com mensagens rolando sem parar (pausa ao passar o mouse).
export default function Faixa() {
  const { destaque, itens } = FAIXA_TOPO;
  const sequencia = itens.flatMap((item) => [
    { tipo: 'destaque', texto: destaque },
    { tipo: 'item', texto: item },
  ]);

  const Grupo = ({ oculto }) => (
    <ul className="faixa__grupo" aria-hidden={oculto || undefined}>
      {sequencia.map((parte, i) => (
        <li key={i} className={parte.tipo === 'destaque' ? 'faixa__destaque' : undefined}>
          {parte.texto}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="faixa" role="region" aria-label="Novidades do Koryum">
      <div className="faixa__trilho">
        <Grupo />
        <Grupo oculto />
      </div>
    </div>
  );
}
