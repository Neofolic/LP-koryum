import { useEffect, useRef } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { HERO_PHOTO, LOGIN_URL } from '../config.js';
import AgendaScreen from './AgendaScreen.jsx';
import Logo from './Logo.jsx';
import MenuRecursos from './MenuRecursos.jsx';

export default function Hero({ abrirForm, abrirVideo, testarGratis }) {
  // No topo o menu fica só com a borda. Conforme a página desce, um fundo escuro
  // aparece aos poucos (de 0 a 160 px de rolagem), para o texto branco continuar legível.
  const menu = useRef(null);
  useEffect(() => {
    let quadro = 0;
    const aplicar = () => {
      quadro = 0;
      const p = Math.min(Math.max(window.scrollY / 160, 0), 1);
      menu.current?.style.setProperty('--p', p.toFixed(3));
      // o menu começa logo abaixo da faixa do topo e sobe junto com ela até encostar no topo da tela
      const faixa = document.querySelector('.faixa')?.offsetHeight ?? 0;
      menu.current?.style.setProperty('--faixa', `${Math.max(faixa - window.scrollY, 0)}px`);

      // Descobre o que está por baixo do centro do menu: bloco escuro da abertura ou área clara
      // (seções brancas ou a própria tela do sistema). Na área clara, o menu fica branco com texto escuro.
      const barra = menu.current?.querySelector('.nav__bar');
      if (barra) {
        const r = barra.getBoundingClientRect();
        const embaixo = document
          .elementsFromPoint(window.innerWidth / 2, r.top + r.height / 2)
          .find((el) => !menu.current.contains(el));
        const escuro = !!embaixo?.closest('.hero__stage, .rodape, .ai') && !embaixo.closest('.screen');
        menu.current.classList.toggle('nav--claro', !escuro);
      }
    };
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(aplicar);
    };
    aplicar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero__stage" style={HERO_PHOTO ? { '--photo': `url(${HERO_PHOTO})` } : undefined}>
        <header className="nav" ref={menu}>
          <div className="nav__bar">
            <a href="#" className="nav__logo" aria-label="Koryum, início">
              <Logo height={28} />
            </a>
            <nav className="nav__links" aria-label="Principal">
              <MenuRecursos />
              <a href="#koryum-ai">Koryum AI</a>
              <a href="#precos">Preços</a>
            </nav>
            <div className="nav__actions">
              <a className="nav__login" href={LOGIN_URL || '#'}>
                Entrar
              </a>
              <button type="button" className="nav__cta" onClick={() => abrirForm()} aria-haspopup="dialog">
                Falar com especialista
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <div className="hero__copy">
          <p className="hero__badge rise" style={{ '--d': '0ms' }}>
            <span className="hero__badge-new">
              <Sparkles size={12} strokeWidth={2.25} aria-hidden="true" />
              Novo
            </span>
            Koryum AI em todas as telas
          </p>

          <h1 className="rise" style={{ '--d': '60ms' }}>
            A <strong className="hero__grifo">gestão da sua clínica</strong>, do agendamento ao retorno, num só lugar
          </h1>

          <p className="hero__lead rise" style={{ '--d': '120ms' }}>
            Agenda, prontuário, vendas e estoque no mesmo sistema. A implantação é feita pelo nosso time e você
            tem 15 dias para testar com a sua equipe.
          </p>

          <div className="hero__actions rise" style={{ '--d': '220ms' }}>
            <button type="button" className="cta" onClick={testarGratis}>
              <span className="cta__border" aria-hidden="true" />
              <svg className="cta__icon" width="14" height="20" viewBox="10 7.25 12 17.5" fill="#fff" aria-hidden="true">
                <path d="M13.0349 7.5H17.7791L15.0116 17.3837H10.2674L13.0349 7.5Z" />
                <path d="M18.1744 8.29071H21.7326L16.1977 16.1977H13.8256L18.1744 8.29071Z" />
                <path d="M15.0116 16.9883H17.7791L21.7326 24.5H18.5698L15.0116 16.9883Z" />
              </svg>
              <span className="cta__text">Testar grátis por 15 dias</span>
            </button>
            <button type="button" className="link-white" onClick={abrirVideo} aria-haspopup="dialog">
              Veja como funciona
              <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

        </div>

      </div>

      {/* A tela começa dentro do bloco escuro e continua por cima da seção seguinte */}
      <div className="hero__product rise-product">
        <span className="layer layer--back" aria-hidden="true" />
        <span className="layer layer--mid" aria-hidden="true" />
        <AgendaScreen />
      </div>

    </section>
  );
}
