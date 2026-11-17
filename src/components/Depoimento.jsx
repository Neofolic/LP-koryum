import { useEffect, useRef, useState } from 'react';
import { DEPOIMENTO } from '../config.js';
import foto from '../assets/hygor.jpg';

// Carrossel de logos removido em 17/11/2026 (pedido): volta quando chegarem as logos reais.
// As imagens de exemplo continuam em src/assets/logos.

// "==trecho==" vira grifo
const comGrifo = (texto) =>
  texto.split(/==(.+?)==/).map((parte, i) => (i % 2 ? <mark key={i} className="dep__grifo">{parte}</mark> : parte));

export default function Depoimento() {
  const d = DEPOIMENTO;
  // o grifo é "passado" da esquerda para a direita quando o depoimento aparece na tela
  const frase = useRef(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = frase.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="dep" aria-label="Depoimento">
      <figure className="dep__figura">
        <figcaption className="dep__autor">
          <img src={foto} alt="" width="44" height="44" />
          <span>
            <strong>{d.nome}</strong>, {d.papel} · {d.clinica}
          </span>
        </figcaption>
        <blockquote ref={frase} className={`dep__texto${visto ? ' dep__texto--visto' : ''}`}>“{comGrifo(d.texto)}”</blockquote>
      </figure>
    </section>
  );
}
