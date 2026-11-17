import { useEffect, useState } from 'react';
import { iniciarRolagem, pausarRolagem } from './rolagem.js';
import Faixa from './components/Faixa.jsx';
import Depoimento from './components/Depoimento.jsx';
import Ecossistema from './components/Ecossistema.jsx';
import Faq from './components/Faq.jsx';
import KoryumAI from './components/KoryumAI.jsx';
import Recursos from './components/Recursos.jsx';
import Hero from './components/Hero.jsx';
import LeadModal from './components/LeadModal.jsx';
import Obrigado from './components/Obrigado.jsx';
import Precos from './components/Precos.jsx';
import Rodape from './components/Rodape.jsx';
import VideoModal from './components/VideoModal.jsx';

const naConfirmacao = () =>
  window.location.pathname.replace(/\/$/, '').endsWith('/obrigado') || window.location.hash === '#obrigado';

export default function App() {
  const [confirmacao, setConfirmacao] = useState(naConfirmacao);
  const [videoAberto, setVideoAberto] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [plano, setPlano] = useState('');
  // Um modal por vez: se o vídeo estiver aberto, ele fecha antes de o formulário abrir
  // plano: nome do plano quando o formulário é aberto por um cartão de preço
  const abrirForm = (p) => {
    setPlano(typeof p === 'string' ? p : '');
    setVideoAberto(false);
    setFormAberto(true);
  };
  const abrirVideo = () => setVideoAberto(true);
    // "Testar grátis por 15 dias" abre o mesmo modal do Falar com especialista (o abrirForm já fecha o vídeo)
  const testarGratis = () => abrirForm();

  // rolagem suave da página (liga uma vez) e pausa enquanto houver modal aberto
  useEffect(() => {
    iniciarRolagem();
  }, []);
  useEffect(() => {
    pausarRolagem(videoAberto || formAberto);
  }, [videoAberto, formAberto]);

  useEffect(() => {
    const atualizar = () => setConfirmacao(naConfirmacao());
    window.addEventListener('hashchange', atualizar);
    window.addEventListener('popstate', atualizar);
    return () => {
      window.removeEventListener('hashchange', atualizar);
      window.removeEventListener('popstate', atualizar);
    };
  }, []);

  if (confirmacao) return <Obrigado />;

  return (
    <>
      <Faixa />
      <main>
        <Hero abrirForm={abrirForm} abrirVideo={abrirVideo} testarGratis={testarGratis} />
        <Depoimento />
        <Recursos />
        <KoryumAI testarGratis={testarGratis} />
        <Precos abrirForm={abrirForm} />
        <Faq abrirForm={abrirForm} />
        <Ecossistema testarGratis={testarGratis} />
      </main>
      <Rodape abrirForm={abrirForm} abrirVideo={abrirVideo} testarGratis={testarGratis} />
      <VideoModal aberto={videoAberto} aoFechar={() => setVideoAberto(false)} aoTestar={testarGratis} />
      <LeadModal aberto={formAberto} plano={plano} aoFechar={() => setFormAberto(false)} />
    </>
  );
}
