// Planos da seção de preços: modelo final V2 (16/11/2026), implantação + mensalidade.
// Fonte: "Koryum · Modelo final de preços · V2". Valores em reais inteiros, sem centavos.
// A implantação é parcelada em 24x junto com a mensalidade; depois da 24ª parcela fica só a mensalidade.
// À vista, a implantação tem 10% de desconto (regra do contrato no mesmo documento).
// Agendas, unidades e equipe de apoio são ilimitadas em todos os planos; só quem prescreve conta.
export const PARCELAS_IMPLANTACAO = 24;
export const DESCONTO_A_VISTA = 10; // % sobre a implantação

// destaque: quadro do Koryum AI no meio do cartão (no lugar do quadro promocional da referência).
// transcricao: [quantidade, complemento], sempre em duas linhas curtas, iguais em todos os planos
export const PLANOS = [
  { nome: 'Essencial', para: 'Para o consultório com um único prescritor.', mensalidade: 397, implantacao: 10800, incluidos: 1, adicional: null, destaque: false, novo: false, transcricao: ['8 horas', 'de transcrição por mês'] },
  { nome: 'Profissional', para: 'Clínica que vende procedimento de ticket alto.', mensalidade: 1297, implantacao: 16800, incluidos: 2, adicional: 347, destaque: true, novo: false, transcricao: ['15 horas', 'de transcrição por mês'] },
  { nome: 'Completo', para: 'Financeiro inteiro, conciliação e integrações.', mensalidade: 2497, implantacao: 22800, incluidos: 4, adicional: 447, destaque: false, novo: false, transcricao: ['30 horas', 'de transcrição por mês'] },
  { nome: 'Rede', para: 'Médico ou grupo com várias clínicas.', mensalidade: 4997, implantacao: 30000, incluidos: 8, adicional: 497, destaque: false, novo: true, transcricao: ['Sem limite', 'de horas de transcrição'] },
];

// Lista igual em todos os cartões: o que o plano não tem aparece com traço, como na referência.
// planos: índices dos planos que têm o recurso (0 Essencial, 1 Profissional, 2 Completo, 3 Rede).
export const RECURSOS = [
  { texto: 'Agenda, prontuário e Memed', planos: [0, 1, 2, 3] },
  { texto: 'Venda e cobrança', planos: [0, 1, 2, 3] },
  { texto: 'Pós-venda automático e Assinko', planos: [1, 2, 3] },
  { texto: 'NPS, estoque e agenda cirúrgica', planos: [1, 2, 3] },
  { texto: 'Financeiro e conciliação', planos: [2, 3] },
  { texto: 'API de agenda', planos: [2, 3] },
  { texto: 'Gerente de conta dedicado', planos: [3] },
  { texto: 'Implantação presencial nas unidades', planos: [3] },
  { texto: 'Ajustes sob medida e suporte prioritário', planos: [3] },
];

// contas de cada plano, todas em reais inteiros (os valores do documento fecham sem centavos)
export const parcela = (p) => p.implantacao / PARCELAS_IMPLANTACAO;
export const primeiros24 = (p) => p.mensalidade + parcela(p);
export const implantacaoAVista = (p) => (p.implantacao * (100 - DESCONTO_A_VISTA)) / 100;
export const economiaAVista = (p) => p.implantacao - implantacaoAVista(p);
