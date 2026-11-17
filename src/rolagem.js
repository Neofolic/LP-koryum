import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Rolagem suave da página inteira (roda do mouse e trackpad) e dos links de âncora (#precos etc.).
// Quem configurou o aparelho para reduzir movimento fica com a rolagem normal do navegador.
let lenis = null;

export function iniciarRolagem() {
  if (lenis || typeof window === 'undefined') return lenis;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    anchors: { duration: 1.2 },
    // áreas que rolam por dentro continuam com a rolagem delas: chat, lista de países, carrosséis e modais
    prevent: (no) => !!no.closest?.('dialog, .chat__corpo, .ddi__lista, [data-lenis-prevent]'),
  });
  return lenis;
}

// Rola até um seletor com o mesmo efeito dos links (ou normal, se a rolagem suave estiver desligada)
export function rolarPara(seletor) {
  const alvo = document.querySelector(seletor);
  if (!alvo) return;
  if (lenis) lenis.scrollTo(alvo, { duration: 1.2 });
  else alvo.scrollIntoView({ block: 'start' });
}

// Pausa a rolagem da página enquanto um modal está aberto
export function pausarRolagem(pausar) {
  if (!lenis) return;
  if (pausar) lenis.stop();
  else lenis.start();
}

// Volta ao topo da página com o mesmo efeito
export function rolarTopo() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0 });
}
