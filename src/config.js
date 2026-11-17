// Número do WhatsApp do especialista: só dígitos, com 55 e DDD. Ex.: '5585999999999'.
// Vazio, o botão abre o WhatsApp para a pessoa escolher o contato.
export const WHATSAPP_NUMBER = '';
export const WHATSAPP_MESSAGE = 'Olá! Quero conhecer o Koryum para a minha clínica.';
export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Foto da abertura. Coloque a foto da Neofolic em public/hero.jpg e troque para '/hero.jpg'.
export const HERO_PHOTO = '';

// Endereço do login do Koryum. Enquanto estiver vazio, o botão Entrar não leva a lugar nenhum.
export const LOGIN_URL = 'https://app.koryum.com.br/';


// Faixa rolando no topo da página. "destaque" aparece em caixa alta e negrito entre os itens.
export const FAIXA_TOPO = {
  destaque: 'Koryum',
  itens: ['Koryum AI em todas as telas', 'Implantação feita pelo nosso time', '15 dias para testar com a sua equipe', 'Prescrição integrada à Memed'],
};

// Vídeo do "Veja como funciona". Aceita link do YouTube (ex.: 'https://youtu.be/ID') ou de um arquivo .mp4.
// Enquanto estiver vazio, o modal mostra o espaço do vídeo com o aviso "em breve".
export const VIDEO_URL = '';

// Formulário "Falar com um especialista".
// WEBHOOK_URL: endereço que recebe os dados (POST em JSON). Vazio = não envia nada e só segue para a confirmação (modo de teste).
export const WEBHOOK_URL = '';
// Página de confirmação depois do envio. No site publicado é /obrigado (a Cloudflare Pages entrega o mesmo app nesse endereço).
export const CONFIRMACAO_URL = '/obrigado';
// Link da Política de privacidade, exigido pela LGPD ao coletar dados. Precisa existir antes de publicar.
export const POLITICA_URL = '';

// Rodapé. Os itens só aparecem quando preenchidos.
export const TERMOS_URL = '';
// Razão social e CNPJ da empresa dona do Koryum (boa prática e exigência para quem coleta dados e vende online)
export const EMPRESA = { razaoSocial: '', cnpj: '' };

// Redes sociais do Koryum no rodapé. Preencha com os links reais dos perfis.
export const REDES = {
  instagram: '',
  linkedin: '',
  youtube: '',
};

// Depoimento (seção logo depois da abertura). PRECISA do aval por escrito de quem assina antes de publicar.
export const DEPOIMENTO = {
  nome: 'Dr. Hygor Guerreiro',
  papel: 'Dono',
  clinica: 'Clínica Neofolic',
  // o trecho entre == == aparece grifado
  texto: 'Com o Koryum, enxergo todas as unidades da Neofolic ==num só lugar==, sem pedir planilha para ninguém.',
};

// Faixa de logos abaixo do depoimento. ATENÇÃO: logos e nomes FICTÍCIOS (marcas de exemplo), só para o desenho.
// Troque pelas clínicas clientes reais, com autorização, antes de publicar.
export const LOGOS_FICTICIOS = true;
