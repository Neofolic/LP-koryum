import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { whatsappUrl } from '../config.js';
import Logo from './Logo.jsx';

// Página de confirmação depois do formulário. Também é o ponto para os pixels de conversão (Meta, Google).
export default function Obrigado() {
  const voltar = () => {
    if (window.location.hash === '#obrigado') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.assign('/');
    }
  };

  return (
    <main className="obrigado">
      <div className="obrigado__palco">
        <header className="obrigado__topo">
          <button type="button" className="obrigado__logo" onClick={voltar} aria-label="Koryum, voltar para o site">
            <Logo height={28} />
          </button>
        </header>

        <div className="obrigado__conteudo">
          <span className="obrigado__icone" aria-hidden="true">
            <CheckCircle2 size={30} strokeWidth={1.75} />
          </span>
          <h1>Recebemos seus dados</h1>
          <p className="obrigado__texto">
            Em breve um especialista do Koryum chama você no WhatsApp. Se preferir, adiante a conversa agora.
          </p>

          <div className="obrigado__acoes">
            <a className="cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <span className="cta__border" aria-hidden="true" />
              <svg className="cta__icon" width="14" height="20" viewBox="10 7.25 12 17.5" fill="#fff" aria-hidden="true">
                <path d="M13.0349 7.5H17.7791L15.0116 17.3837H10.2674L13.0349 7.5Z" />
                <path d="M18.1744 8.29071H21.7326L16.1977 16.1977H13.8256L18.1744 8.29071Z" />
                <path d="M15.0116 16.9883H17.7791L21.7326 24.5H18.5698L15.0116 16.9883Z" />
              </svg>
              <span className="cta__text">Falar agora no WhatsApp</span>
            </a>
            <button type="button" className="link-white" onClick={voltar}>
              <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
              Voltar para o site
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
