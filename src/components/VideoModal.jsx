import { useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import { VIDEO_URL } from '../config.js';
import Logo from './Logo.jsx';

function idDoYoutube(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

function Player() {
  if (!VIDEO_URL) {
    return (
      <div className="vmodal__vazio">
        <span className="vmodal__play" aria-hidden="true">
          <Play size={28} strokeWidth={0} fill="currentColor" />
        </span>
        <p>Vídeo de demonstração em breve</p>
      </div>
    );
  }
  const yt = idDoYoutube(VIDEO_URL);
  if (yt) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1`}
        title="Vídeo: como o Koryum funciona"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }
  return <video src={VIDEO_URL} controls autoPlay playsInline />;
}

// Modal com o vídeo e o botão para falar com o especialista. Usa o <dialog> nativo:
// Esc fecha, o foco fica dentro do modal e volta para o botão que abriu.
export default function VideoModal({ aberto, aoFechar, aoTestar }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
    if (!aberto && d.open) d.close();
    if (!aberto) document.documentElement.style.overflow = '';
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className="vmodal"
      aria-labelledby="vmodal-titulo"
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
    >
      <button type="button" className="vmodal__fechar" onClick={aoFechar} aria-label="Fechar vídeo">
        <X size={28} strokeWidth={1.75} />
      </button>

      <div className="vmodal__painel">

        <div className="vmodal__topo">
          <span className="modal__logo"><Logo height={28} /></span>
          <p id="vmodal-titulo" className="vmodal__titulo">Veja como o Koryum funciona</p>
          <p className="vmodal__apoio">Da agenda ao retorno do paciente, no sistema que a sua equipe vai usar.</p>
        </div>

        <div className="vmodal__video">{aberto && <Player />}</div>

        <div className="vmodal__rodape">
          <button type="button" className="cta" onClick={aoTestar}>
            <span className="cta__border" aria-hidden="true" />
            <svg className="cta__icon" width="14" height="20" viewBox="10 7.25 12 17.5" fill="#fff" aria-hidden="true">
              <path d="M13.0349 7.5H17.7791L15.0116 17.3837H10.2674L13.0349 7.5Z" />
              <path d="M18.1744 8.29071H21.7326L16.1977 16.1977H13.8256L18.1744 8.29071Z" />
              <path d="M15.0116 16.9883H17.7791L21.7326 24.5H18.5698L15.0116 16.9883Z" />
            </svg>
            <span className="cta__text">Testar grátis por 15 dias</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
