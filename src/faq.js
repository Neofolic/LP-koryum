// Perguntas frequentes da seção "Pergunte ao Koryum".
// sugerida: aparece como atalho na tela inicial do chat.
// palavras: termos que, digitados na pergunta, levam a esta resposta (sem acento, minúsculas).
// especialista: mostra o botão para falar com um especialista junto da resposta.
export const PERGUNTAS = [
  {
    pergunta: 'Quanto custa o Koryum?',
    resposta:
      'O valor depende do plano e de quantos profissionais prescrevem na clínica. Agendas, unidades e o restante da equipe não mudam o preço. A implantação pode ser parcelada em até 24x, junto com a mensalidade. Um especialista monta a proposta certa para a sua clínica.',
    palavras: ['custa', 'preco', 'valor', 'plano', 'mensalidade', 'pagar', 'investimento', 'caro'],
    sugerida: true,
    especialista: true,
  },
  {
    pergunta: 'Como funciona o teste de 15 dias?',
    resposta:
      'Na conversa com o especialista, liberamos o acesso com todos os módulos para a sua equipe usar no dia a dia, durante 15 dias. Depois, você escolhe o plano.',
    palavras: ['teste', 'testar', '15 dias', 'gratis', 'gratuito', 'experimentar', 'trial'],
    sugerida: true,
  },
  {
    pergunta: 'Quem faz a implantação?',
    resposta:
      'O nosso time. Cadastramos agendas, procedimentos e profissionais junto com você e treinamos a recepção. A implantação pode ser parcelada em até 24x junto com a mensalidade, ou paga à vista com desconto.',
    palavras: ['implanta', 'treinamento', 'treinar', 'configurar', 'cadastr', 'comecar', 'migra', 'importar'],
    sugerida: true,
  },
  {
    pergunta: 'Funciona para clínica com mais de uma unidade?',
    resposta:
      'Sim. Pacientes e procedimentos ficam numa base única da rede, e cada unidade tem as próprias agendas, salas e preços.',
    palavras: ['unidade', 'filial', 'filiais', 'rede', 'franquia', 'mais de uma'],
    sugerida: true,
  },
  {
    pergunta: 'Como ficam a prescrição e a assinatura dos documentos?',
    resposta:
      'A prescrição é feita pela Memed, dentro do prontuário. Atestados, declarações e outros documentos são assinados com certificado digital ICP-Brasil em nuvem.',
    palavras: ['memed', 'receita', 'prescri', 'assinatura', 'assinar', 'atestado', 'certificado', 'icp'],
    sugerida: true,
  },
  {
    pergunta: 'Preciso instalar alguma coisa?',
    resposta: 'Não. O Koryum funciona no navegador, sem instalação.',
    palavras: ['instalar', 'instalacao', 'baixar', 'aplicativo', 'app', 'navegador', 'computador'],
    sugerida: true,
  },
  {
    pergunta: 'O Koryum atende convênio?',
    resposta:
      'Você cadastra os convênios que a clínica aceita e a carteirinha de cada paciente. O faturamento de guias de convênio (TISS) não faz parte do Koryum hoje.',
    palavras: ['convenio', 'plano de saude', 'tiss', 'carteirinha', 'guia', 'unimed'],
  },
  {
    pergunta: 'Quem da equipe vê o prontuário?',
    resposta:
      'Cada pessoa vê só o que o papel dela permite. O prontuário fica restrito aos profissionais de saúde.',
    palavras: ['prontuario', 'permiss', 'acesso', 'seguranca', 'seguro', 'lgpd', 'sigilo', 'privacidade'],
  },
];

export const RESPOSTA_PADRAO =
  'Essa é uma ótima pergunta para um especialista. Ele responde com base na rotina da sua clínica.';
