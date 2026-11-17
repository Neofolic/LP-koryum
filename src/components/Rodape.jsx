import { useEffect, useState } from 'react';
import { ArrowUp, ArrowUpRight, Instagram, Linkedin, Youtube } from 'lucide-react';
import { EMPRESA, LOGIN_URL, POLITICA_URL, REDES, TERMOS_URL } from '../config.js';
import Logo from './Logo.jsx';
import { rolarTopo } from '../rolagem.js';

const ICONES = [
  ['instagram', 'Instagram', Instagram],
  ['linkedin', 'LinkedIn', Linkedin],
  ['youtube', 'YouTube', Youtube],
];

const PALAVRAS = ['organizar', 'atender', 'vender', 'crescer'];

// "Feito para ___": a palavra troca a cada 2,2 s, subindo; a anterior e a próxima aparecem apagadas
function FrasePalavras() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % PALAVRAS.length), 2200);
    return () => clearInterval(t);
  }, []);
  const n = PALAVRAS.length;
  return (
    <p className="frase-rola" aria-label={`Feito para ${PALAVRAS.join(', ')}`}>
      <span aria-hidden="true">Feito para</span>
      <span className="frase-rola__janela" aria-hidden="true">
        {/* define a largura pela palavra mais longa, para a borda direita ficar sempre na linha guia */}
        <span className="frase-rola__medida">{PALAVRAS.reduce((a, b) => (b.length > a.length ? b : a))}</span>
        {PALAVRAS.map((p, k) => {
          const pos = ((k - i + n + 1) % n) - 1; // -1 acima, 0 no centro, 1 abaixo, o resto escondido
          return (
            <span key={p} className="frase-rola__palavra" data-pos={pos > 1 ? 'fora' : pos}>
              {p}
            </span>
          );
        })}
      </span>
    </p>
  );
}

export default function Rodape({ abrirForm, abrirVideo, testarGratis }) {
  const legais = [
    POLITICA_URL && ['Política de privacidade', POLITICA_URL],
    TERMOS_URL && ['Termos de uso', TERMOS_URL],
  ].filter(Boolean);
  const subir = () => rolarTopo();

  return (
    <footer className="rodape">
      <div className="rodape__dentro">
        <div className="rodape__topo">
          <div className="rodape__marca-bloco">
            <Logo height={30} />
            <p className="rodape__frase">A gestão da sua clínica, do agendamento ao retorno.</p>
            <p className="rodape__apoio">Para clínicas de estética, dermatologia, cirurgia plástica e harmonização.</p>
            <button type="button" className="rodape__contato" onClick={testarGratis}>
              Testar grátis por 15 dias
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="rodape__meio">
            <nav className="rodape__colunas" aria-label="Rodapé">
              <div>
                <p className="rodape__titulo">Koryum</p>
                <ul>
                  <li><a href="#recursos">Funcionalidades</a></li>
                  <li><a href="#koryum-ai">Koryum AI</a></li>
                  <li><a href="#precos">Preços</a></li>
                  <li><a href="#perguntas">Perguntas frequentes</a></li>
                </ul>
              </div>
              <div>
                <p className="rodape__titulo">Segmentos</p>
                <ul>
                  <li><span className="rodape__texto">Estética</span></li>
                  <li><span className="rodape__texto">Dermatologia</span></li>
                  <li><span className="rodape__texto">Cirurgia plástica</span></li>
                  <li><span className="rodape__texto">Harmonização</span></li>
                </ul>
              </div>
              <div>
                <p className="rodape__titulo">Comece agora</p>
                <ul>
                  <li><button type="button" onClick={testarGratis}>Testar grátis por 15 dias</button></li>
                  <li><button type="button" onClick={() => abrirForm()}>Falar com um especialista</button></li>
                  <li><button type="button" onClick={abrirVideo}>Ver como funciona</button></li>
                  <li><a href={LOGIN_URL || '#'}>Entrar no Koryum</a></li>
                  {legais.map(([nome, url]) => (
                    <li key={nome}><a href={url} target="_blank" rel="noopener noreferrer">{nome}</a></li>
                  ))}
                </ul>
              </div>
            </nav>
            <FrasePalavras />
          </div>
        </div>

        <div className="rodape__base">
          <p>
            © {new Date().getFullYear()} Koryum. Um produto Skoryn, do Neo Group.
            {EMPRESA.razaoSocial && EMPRESA.cnpj && (
              <span className="rodape__empresa"> {EMPRESA.razaoSocial} · CNPJ {EMPRESA.cnpj}</span>
            )}
          </p>
          <div className="rodape__direita">
            <ul className="rodape__redes" aria-label="Redes sociais">
              {ICONES.map(([chave, nome, Icone]) => (
                <li key={chave}>
                  <a href={REDES[chave] || '#'} target={REDES[chave] ? '_blank' : undefined} rel="noopener noreferrer" aria-label={`Koryum no ${nome}`}>
                    <Icone size={20} strokeWidth={1.9} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <button type="button" className="rodape__subir" onClick={subir} aria-label="Voltar ao topo">
              <ArrowUp size={20} strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </div>
      <div className="rodape__faixa" aria-hidden="true" />
    </footer>
  );
}
