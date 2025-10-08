export interface AlertaJuridico {
  id: string;
  tipo: 'sumula' | 'precedente' | 'legislacao' | 'doutrina' | 'modelo';
  titulo: string;
  descricao: string;
  area: 'Trabalhista' | 'Cível' | 'Criminal' | 'Tributário' | 'Constitucional' | 'Previdenciário' | 'Consumidor';
  relevancia: 'alta' | 'media' | 'baixa';
  tribunal?: string;
  dataPublicacao: string;
  lido: boolean;
  arquivado: boolean;
  novo: boolean;
  numeroReferencia?: string;
  link?: string;
}

// Função helper para formatar timestamp
export function formatarTimestamp(dataPublicacao: string): string {
  const agora = new Date();
  const data = new Date(dataPublicacao);
  const diferencaMs = agora.getTime() - data.getTime();
  const diferencaMinutos = Math.floor(diferencaMs / 60000);
  const diferencaHoras = Math.floor(diferencaMs / 3600000);
  const diferencaDias = Math.floor(diferencaMs / 86400000);

  if (diferencaMinutos < 60) {
    return `Há ${diferencaMinutos} minuto${diferencaMinutos !== 1 ? 's' : ''}`;
  } else if (diferencaHoras < 24) {
    return `Há ${diferencaHoras} hora${diferencaHoras !== 1 ? 's' : ''}`;
  } else if (diferencaDias === 0) {
    return 'Hoje, ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } else if (diferencaDias === 1) {
    return 'Ontem, ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } else if (diferencaDias < 7) {
    return `Há ${diferencaDias} dia${diferencaDias !== 1 ? 's' : ''}`;
  } else if (diferencaDias < 30) {
    const semanas = Math.floor(diferencaDias / 7);
    return `Há ${semanas} semana${semanas !== 1 ? 's' : ''}`;
  } else {
    return data.toLocaleDateString('pt-BR');
  }
}

// Função helper para calcular se é "novo"
export function calcularSeNovo(dataPublicacao: string): boolean {
  const agora = new Date();
  const data = new Date(dataPublicacao);
  const diferencaDias = Math.floor((agora.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
  return diferencaDias <= 7;
}

// Gerar 60 alertas realistas
export const alertasMock: AlertaJuridico[] = [
  {
    id: '1',
    tipo: 'sumula',
    titulo: 'Nova Súmula 500 do TST sobre Acordo Coletivo',
    descricao: 'TST aprova súmula que define limites de validade de cláusulas negociadas coletivamente, estabelecendo critérios para prevalência sobre normas legais.',
    area: 'Trabalhista',
    relevancia: 'alta',
    tribunal: 'TST',
    dataPublicacao: new Date().toISOString(),
    lido: false,
    arquivado: false,
    novo: true,
    numeroReferencia: 'Súmula 500'
  },
  {
    id: '2',
    tipo: 'precedente',
    titulo: 'STF decide sobre LGPD em Relações Trabalhistas',
    descricao: 'Supremo define limites de aplicação da Lei Geral de Proteção de Dados nas relações de trabalho, estabelecendo parâmetros para tratamento de dados pessoais de empregados.',
    area: 'Constitucional',
    relevancia: 'alta',
    tribunal: 'STF',
    dataPublicacao: new Date(Date.now() - 86400000).toISOString(),
    lido: false,
    arquivado: false,
    novo: true,
    numeroReferencia: 'RE 1.234.567'
  },
  {
    id: '3',
    tipo: 'legislacao',
    titulo: 'PL 1234/2024 aprovado - Altera CLT Art. 62',
    descricao: 'Projeto de lei que modifica regras sobre cargos de confiança e teletrabalho foi aprovado pela Câmara dos Deputados e segue para o Senado.',
    area: 'Trabalhista',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 172800000).toISOString(),
    lido: true,
    arquivado: false,
    novo: true,
    numeroReferencia: 'PL 1234/2024'
  },
  {
    id: '4',
    tipo: 'precedente',
    titulo: 'TST uniformiza jurisprudência sobre Home Office',
    descricao: 'Tribunal Superior do Trabalho define critérios para controle de jornada em trabalho remoto, estabelecendo quando há direito a horas extras.',
    area: 'Trabalhista',
    relevancia: 'alta',
    tribunal: 'TST',
    dataPublicacao: new Date(Date.now() - 259200000).toISOString(),
    lido: true,
    arquivado: false,
    novo: true
  },
  {
    id: '5',
    tipo: 'sumula',
    titulo: 'STJ edita Súmula 678 sobre Danos Morais',
    descricao: 'Superior Tribunal de Justiça aprova nova súmula estabelecendo parâmetros para arbitramento de danos morais em relações de consumo.',
    area: 'Consumidor',
    relevancia: 'alta',
    tribunal: 'STJ',
    dataPublicacao: new Date(Date.now() - 345600000).toISOString(),
    lido: false,
    arquivado: false,
    novo: true,
    numeroReferencia: 'Súmula 678'
  },
  {
    id: '6',
    tipo: 'legislacao',
    titulo: 'Nova Lei de Compliance Trabalhista publicada',
    descricao: 'Lei 14.789/2024 estabelece regras de compliance e governança em relações trabalhistas, com impactos para empresas de todos os portes.',
    area: 'Trabalhista',
    relevancia: 'alta',
    dataPublicacao: new Date(Date.now() - 432000000).toISOString(),
    lido: false,
    arquivado: false,
    novo: true,
    numeroReferencia: 'Lei 14.789/2024'
  },
  {
    id: '7',
    tipo: 'precedente',
    titulo: 'STF reconhece direito à desconexão digital',
    descricao: 'Supremo Tribunal Federal reconhece direito à desconexão após expediente, mesmo em regime de teletrabalho, vedando cobrança de disponibilidade permanente.',
    area: 'Constitucional',
    relevancia: 'alta',
    tribunal: 'STF',
    dataPublicacao: new Date(Date.now() - 518400000).toISOString(),
    lido: true,
    arquivado: false,
    novo: true,
    numeroReferencia: 'Tema 1.222'
  },
  {
    id: '8',
    tipo: 'doutrina',
    titulo: 'Artigo sobre Reforma Tributária e suas implicações',
    descricao: 'Renomado tributarista publica análise aprofundada sobre os impactos da Reforma Tributária aprovada na EC 132/2023 para empresas e consumidores.',
    area: 'Tributário',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 604800000).toISOString(),
    lido: true,
    arquivado: false,
    novo: true
  },
  {
    id: '9',
    tipo: 'modelo',
    titulo: 'Novo modelo de Petição Inicial de Ação Trabalhista',
    descricao: 'Modelo atualizado de petição inicial para reclamações trabalhistas, incorporando as últimas mudanças jurisprudenciais e legislativas.',
    area: 'Trabalhista',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 691200000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false
  },
  {
    id: '10',
    tipo: 'precedente',
    titulo: 'TRT-2 define critérios para caracterização de vínculo com plataformas',
    descricao: 'Tribunal Regional do Trabalho da 2ª Região estabelece 5 critérios objetivos para reconhecimento de vínculo empregatício com aplicativos de entrega.',
    area: 'Trabalhista',
    relevancia: 'alta',
    tribunal: 'TRT-2',
    dataPublicacao: new Date(Date.now() - 864000000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false
  },
  {
    id: '11',
    tipo: 'sumula',
    titulo: 'TST revisa Súmula 331 sobre Terceirização',
    descricao: 'Tribunal Superior do Trabalho atualiza súmula sobre terceirização, adequando-a às mudanças trazidas pela Lei 13.467/2017.',
    area: 'Trabalhista',
    relevancia: 'alta',
    tribunal: 'TST',
    dataPublicacao: new Date(Date.now() - 950400000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Súmula 331'
  },
  {
    id: '12',
    tipo: 'legislacao',
    titulo: 'Decreto regulamenta regras de Segurança da Informação',
    descricao: 'Novo decreto federal estabelece diretrizes obrigatórias de segurança cibernética para empresas que processam dados pessoais.',
    area: 'Constitucional',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 1036800000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Decreto 11.456/2024'
  },
  {
    id: '13',
    tipo: 'precedente',
    titulo: 'STJ define responsabilidade solidária em fraudes bancárias',
    descricao: 'Superior Tribunal de Justiça estabelece que instituições financeiras respondem solidariamente por fraudes mesmo com culpa exclusiva de terceiros.',
    area: 'Consumidor',
    relevancia: 'alta',
    tribunal: 'STJ',
    dataPublicacao: new Date(Date.now() - 1123200000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false
  },
  {
    id: '14',
    tipo: 'doutrina',
    titulo: 'Tese sobre Inteligência Artificial e Direito do Trabalho',
    descricao: 'Pesquisador publica estudo sobre impactos jurídicos da automação e IA nas relações de emprego, propondo nova interpretação normativa.',
    area: 'Trabalhista',
    relevancia: 'baixa',
    dataPublicacao: new Date(Date.now() - 1209600000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '15',
    tipo: 'sumula',
    titulo: 'TJSP edita Súmula 145 sobre Contratos de Aluguel',
    descricao: 'Tribunal de Justiça de São Paulo aprova súmula sobre prorrogação automática de contratos de locação residencial.',
    area: 'Cível',
    relevancia: 'media',
    tribunal: 'TJSP',
    dataPublicacao: new Date(Date.now() - 1296000000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Súmula 145'
  },
  {
    id: '16',
    tipo: 'legislacao',
    titulo: 'MP 1.200/2024 altera regras de tributação de investimentos',
    descricao: 'Medida Provisória modifica alíquotas e fato gerador de IR sobre rendimentos de aplicações financeiras.',
    area: 'Tributário',
    relevancia: 'alta',
    dataPublicacao: new Date(Date.now() - 1382400000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false,
    numeroReferencia: 'MP 1.200/2024'
  },
  {
    id: '17',
    tipo: 'precedente',
    titulo: 'TRF-3 decide sobre impenhorabilidade de criptomoedas',
    descricao: 'Tribunal Regional Federal da 3ª Região define critérios para penhora de ativos digitais em execuções fiscais.',
    area: 'Tributário',
    relevancia: 'media',
    tribunal: 'TRF-3',
    dataPublicacao: new Date(Date.now() - 1468800000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false
  },
  {
    id: '18',
    tipo: 'modelo',
    titulo: 'Modelo de Petição de Habeas Corpus atualizado',
    descricao: 'Template completo de habeas corpus preventivo e liberatório, com fundamentação atualizada conforme entendimento do STF.',
    area: 'Criminal',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 1555200000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '19',
    tipo: 'sumula',
    titulo: 'STF edita Súmula Vinculante 60',
    descricao: 'Supremo aprova súmula vinculante sobre aplicação do princípio da insignificância em crimes tributários.',
    area: 'Criminal',
    relevancia: 'alta',
    tribunal: 'STF',
    dataPublicacao: new Date(Date.now() - 1641600000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'SV 60'
  },
  {
    id: '20',
    tipo: 'doutrina',
    titulo: 'Artigo sobre ESG e Responsabilidade Civil',
    descricao: 'Análise sobre impactos das práticas ESG na responsabilização civil de empresas por danos ambientais e sociais.',
    area: 'Cível',
    relevancia: 'baixa',
    dataPublicacao: new Date(Date.now() - 1728000000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '21',
    tipo: 'precedente',
    titulo: 'STJ uniformiza tese sobre abandono de lar',
    descricao: 'Superior Tribunal de Justiça decide que abandono de lar, por si só, não gera automaticamente direito à indenização.',
    area: 'Cível',
    relevancia: 'media',
    tribunal: 'STJ',
    dataPublicacao: new Date(Date.now() - 1814400000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false
  },
  {
    id: '22',
    tipo: 'legislacao',
    titulo: 'Nova IN da Receita Federal sobre Declaração de Bens',
    descricao: 'Instrução Normativa 2.150/2024 estabelece novos procedimentos para declaração de bens e direitos no exterior.',
    area: 'Tributário',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 1900800000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false,
    numeroReferencia: 'IN 2.150/2024'
  },
  {
    id: '23',
    tipo: 'sumula',
    titulo: 'TST aprova Súmula 501 sobre Dano Moral Coletivo',
    descricao: 'Nova súmula do TST estabelece parâmetros para caracterização e quantificação de dano moral coletivo trabalhista.',
    area: 'Trabalhista',
    relevancia: 'alta',
    tribunal: 'TST',
    dataPublicacao: new Date(Date.now() - 1987200000).toISOString(),
    lido: false,
    arquivado: true,
    novo: false,
    numeroReferencia: 'Súmula 501'
  },
  {
    id: '24',
    tipo: 'precedente',
    titulo: 'TJ-RJ decide sobre Responsabilidade de Condomínios',
    descricao: 'Tribunal de Justiça do Rio define que condomínios respondem objetivamente por danos em áreas comuns.',
    area: 'Cível',
    relevancia: 'media',
    tribunal: 'TJ-RJ',
    dataPublicacao: new Date(Date.now() - 2073600000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '25',
    tipo: 'modelo',
    titulo: 'Template de Contestação em Ação de Despejo',
    descricao: 'Modelo completo de contestação em ação de despejo por falta de pagamento, com teses defensivas atualizadas.',
    area: 'Cível',
    relevancia: 'baixa',
    dataPublicacao: new Date(Date.now() - 2160000000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false
  },
  {
    id: '26',
    tipo: 'doutrina',
    titulo: 'Estudo sobre Direito Digital e Crimes Cibernéticos',
    descricao: 'Pesquisa abrangente sobre tipificação e punição de crimes praticados em ambiente digital conforme Lei Carolina Dieckmann.',
    area: 'Criminal',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 2246400000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '27',
    tipo: 'legislacao',
    titulo: 'Lei Complementar 201/2024 sobre ICMS',
    descricao: 'Nova lei complementar uniformiza critérios de cobrança de ICMS em operações interestaduais de e-commerce.',
    area: 'Tributário',
    relevancia: 'alta',
    dataPublicacao: new Date(Date.now() - 2332800000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'LC 201/2024'
  },
  {
    id: '28',
    tipo: 'precedente',
    titulo: 'STF declara inconstitucional cobrança de taxa de lixo',
    descricao: 'Supremo Tribunal Federal declara inconstitucional cobrança de taxa de coleta de lixo com base em área construída.',
    area: 'Constitucional',
    relevancia: 'alta',
    tribunal: 'STF',
    dataPublicacao: new Date(Date.now() - 2419200000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false,
    numeroReferencia: 'ADI 7.890'
  },
  {
    id: '29',
    tipo: 'sumula',
    titulo: 'INSS edita Súmula 89 sobre Aposentadoria Especial',
    descricao: 'Instituto Nacional do Seguro Social aprova súmula administrativa sobre comprovação de tempo especial para aposentadoria.',
    area: 'Previdenciário',
    relevancia: 'alta',
    tribunal: 'INSS',
    dataPublicacao: new Date(Date.now() - 2505600000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Súmula 89'
  },
  {
    id: '30',
    tipo: 'precedente',
    titulo: 'TRF-4 decide sobre BPC-LOAS e Renda per Capita',
    descricao: 'Tribunal Regional Federal da 4ª Região flexibiliza critério de renda per capita para concessão de benefício assistencial.',
    area: 'Previdenciário',
    relevancia: 'media',
    tribunal: 'TRF-4',
    dataPublicacao: new Date(Date.now() - 2592000000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '31',
    tipo: 'modelo',
    titulo: 'Modelo de Ação de Revisão de Benefício Previdenciário',
    descricao: 'Template atualizado de inicial para revisão de aposentadoria com inclusão de novos períodos contributivos.',
    area: 'Previdenciário',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 2678400000).toISOString(),
    lido: false,
    arquivado: true,
    novo: false
  },
  {
    id: '32',
    tipo: 'doutrina',
    titulo: 'Tese sobre Direito Penal Econômico',
    descricao: 'Análise crítica sobre aplicação da teoria do domínio do fato em crimes contra o sistema financeiro.',
    area: 'Criminal',
    relevancia: 'baixa',
    dataPublicacao: new Date(Date.now() - 2764800000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '33',
    tipo: 'legislacao',
    titulo: 'Resolução CNJ 500/2024 sobre Audiências Virtuais',
    descricao: 'Conselho Nacional de Justiça regulamenta realização de audiências por videoconferência em processos cíveis.',
    area: 'Cível',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 2851200000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Resolução 500/2024'
  },
  {
    id: '34',
    tipo: 'precedente',
    titulo: 'STJ decide sobre Danos Morais por Negativação Indevida',
    descricao: 'Superior Tribunal de Justiça fixa tese sobre quantificação de danos morais em casos de inscrição indevida em cadastros de proteção ao crédito.',
    area: 'Consumidor',
    relevancia: 'alta',
    tribunal: 'STJ',
    dataPublicacao: new Date(Date.now() - 2937600000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '35',
    tipo: 'sumula',
    titulo: 'TRT-15 aprova Súmula 67 sobre Horas In Itinere',
    descricao: 'Tribunal Regional do Trabalho da 15ª Região edita súmula sobre cômputo de tempo de deslocamento em jornada de trabalho.',
    area: 'Trabalhista',
    relevancia: 'media',
    tribunal: 'TRT-15',
    dataPublicacao: new Date(Date.now() - 3024000000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Súmula 67'
  },
  {
    id: '36',
    tipo: 'precedente',
    titulo: 'TJSP decide sobre Usucapião Extrajudicial',
    descricao: 'Tribunal de Justiça de São Paulo estabelece requisitos documentais para processamento de usucapião pela via extrajudicial.',
    area: 'Cível',
    relevancia: 'media',
    tribunal: 'TJSP',
    dataPublicacao: new Date(Date.now() - 3110400000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '37',
    tipo: 'modelo',
    titulo: 'Template de Embargos à Execução Fiscal',
    descricao: 'Modelo completo de embargos à execução fiscal com teses sobre prescrição intercorrente e nulidade da CDA.',
    area: 'Tributário',
    relevancia: 'baixa',
    dataPublicacao: new Date(Date.now() - 3196800000).toISOString(),
    lido: false,
    arquivado: true,
    novo: false
  },
  {
    id: '38',
    tipo: 'doutrina',
    titulo: 'Artigo sobre Direito à Privacidade na Era Digital',
    descricao: 'Estudo sobre colisão entre direito à privacidade e liberdade de expressão em redes sociais à luz da LGPD.',
    area: 'Constitucional',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 3283200000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '39',
    tipo: 'legislacao',
    titulo: 'Lei 14.900/2024 sobre Proteção de Dados de Crianças',
    descricao: 'Nova lei estabelece regras específicas para tratamento de dados pessoais de crianças e adolescentes na internet.',
    area: 'Constitucional',
    relevancia: 'alta',
    dataPublicacao: new Date(Date.now() - 3369600000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Lei 14.900/2024'
  },
  {
    id: '40',
    tipo: 'precedente',
    titulo: 'TST decide sobre Intervalo Intrajornada em Turnos Ininterruptos',
    descricao: 'Tribunal Superior do Trabalho estabelece que supressão de intervalo em turnos ininterruptos gera direito a hora extra com adicional de 50%.',
    area: 'Trabalhista',
    relevancia: 'alta',
    tribunal: 'TST',
    dataPublicacao: new Date(Date.now() - 3456000000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '41',
    tipo: 'sumula',
    titulo: 'CARF aprova Súmula 123 sobre Multa Isolada',
    descricao: 'Conselho Administrativo de Recursos Fiscais edita súmula sobre aplicação de multa isolada por descumprimento de obrigação acessória.',
    area: 'Tributário',
    relevancia: 'media',
    tribunal: 'CARF',
    dataPublicacao: new Date(Date.now() - 3542400000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Súmula 123'
  },
  {
    id: '42',
    tipo: 'precedente',
    titulo: 'STF define competência para julgar crimes cibernéticos',
    descricao: 'Supremo Tribunal Federal estabelece que competência para julgar crimes praticados pela internet é do local onde ocorreu o resultado.',
    area: 'Criminal',
    relevancia: 'alta',
    tribunal: 'STF',
    dataPublicacao: new Date(Date.now() - 3628800000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false,
    numeroReferencia: 'HC 456.789'
  },
  {
    id: '43',
    tipo: 'modelo',
    titulo: 'Modelo de Ação de Divórcio Consensual',
    descricao: 'Template completo de ação de divórcio consensual com partilha de bens e regulamentação de guarda compartilhada.',
    area: 'Cível',
    relevancia: 'baixa',
    dataPublicacao: new Date(Date.now() - 3715200000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false
  },
  {
    id: '44',
    tipo: 'doutrina',
    titulo: 'Tese sobre Novos Direitos Fundamentais Digitais',
    descricao: 'Pesquisa sobre reconhecimento de direitos fundamentais específicos do ambiente digital, como direito ao esquecimento.',
    area: 'Constitucional',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 3801600000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '45',
    tipo: 'legislacao',
    titulo: 'Portaria MTP 1.500/2024 sobre Registro de Ponto Eletrônico',
    descricao: 'Ministério do Trabalho e Previdência atualiza normas sobre sistemas de controle de ponto eletrônico.',
    area: 'Trabalhista',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 3888000000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Portaria 1.500/2024'
  },
  {
    id: '46',
    tipo: 'precedente',
    titulo: 'STJ uniformiza entendimento sobre Vícios Redibitórios',
    descricao: 'Superior Tribunal de Justiça define prazo decadencial para reclamação de vícios ocultos em veículos usados.',
    area: 'Consumidor',
    relevancia: 'media',
    tribunal: 'STJ',
    dataPublicacao: new Date(Date.now() - 3974400000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '47',
    tipo: 'sumula',
    titulo: 'TNU aprova Súmula 98 sobre Auxílio-Doença',
    descricao: 'Turma Nacional de Uniformização edita súmula sobre concessão de auxílio-doença em casos de incapacidade parcial permanente.',
    area: 'Previdenciário',
    relevancia: 'alta',
    tribunal: 'TNU',
    dataPublicacao: new Date(Date.now() - 4060800000).toISOString(),
    lido: false,
    arquivado: true,
    novo: false,
    numeroReferencia: 'Súmula 98'
  },
  {
    id: '48',
    tipo: 'precedente',
    titulo: 'TRT-9 decide sobre Adicional de Periculosidade para Motociclistas',
    descricao: 'Tribunal Regional do Trabalho da 9ª Região reconhece direito a adicional de periculosidade para motoboys que transportam valores.',
    area: 'Trabalhista',
    relevancia: 'media',
    tribunal: 'TRT-9',
    dataPublicacao: new Date(Date.now() - 4147200000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '49',
    tipo: 'modelo',
    titulo: 'Template de Recurso Especial ao STJ',
    descricao: 'Modelo completo de recurso especial com demonstração de violação à lei federal e divergência jurisprudencial.',
    area: 'Cível',
    relevancia: 'baixa',
    dataPublicacao: new Date(Date.now() - 4233600000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false
  },
  {
    id: '50',
    tipo: 'doutrina',
    titulo: 'Artigo sobre Responsabilidade Civil por Abandono Afetivo',
    descricao: 'Análise crítica sobre evolução jurisprudencial do reconhecimento de danos morais por abandono afetivo parental.',
    area: 'Cível',
    relevancia: 'baixa',
    dataPublicacao: new Date(Date.now() - 4320000000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '51',
    tipo: 'legislacao',
    titulo: 'Resolução ANPD 12/2024 sobre Transferência Internacional de Dados',
    descricao: 'Autoridade Nacional de Proteção de Dados estabelece novos requisitos para transferência internacional de dados pessoais.',
    area: 'Constitucional',
    relevancia: 'alta',
    dataPublicacao: new Date(Date.now() - 4406400000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Resolução 12/2024'
  },
  {
    id: '52',
    tipo: 'precedente',
    titulo: 'TJSP decide sobre Ação Renovatória de Locação Comercial',
    descricao: 'Tribunal de Justiça de São Paulo define requisitos para concessão de renovação compulsória de contrato de locação não residencial.',
    area: 'Cível',
    relevancia: 'media',
    tribunal: 'TJSP',
    dataPublicacao: new Date(Date.now() - 4492800000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '53',
    tipo: 'sumula',
    titulo: 'STF edita Súmula Vinculante 61 sobre Juros de Mora',
    descricao: 'Supremo aprova súmula vinculante sobre taxa de juros moratórios aplicável em condenações da Fazenda Pública.',
    area: 'Tributário',
    relevancia: 'alta',
    tribunal: 'STF',
    dataPublicacao: new Date(Date.now() - 4579200000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'SV 61'
  },
  {
    id: '54',
    tipo: 'precedente',
    titulo: 'TST decide sobre Equiparação Salarial em Home Office',
    descricao: 'Tribunal Superior do Trabalho estabelece que modalidade de trabalho (presencial ou remoto) não impede equiparação salarial.',
    area: 'Trabalhista',
    relevancia: 'alta',
    tribunal: 'TST',
    dataPublicacao: new Date(Date.now() - 4665600000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '55',
    tipo: 'modelo',
    titulo: 'Template de Agravo de Instrumento',
    descricao: 'Modelo atualizado de agravo de instrumento contra decisões interlocutórias em processos cíveis.',
    area: 'Cível',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 4752000000).toISOString(),
    lido: false,
    arquivado: true,
    novo: false
  },
  {
    id: '56',
    tipo: 'doutrina',
    titulo: 'Estudo sobre Direito Ambiental e Responsabilidade Empresarial',
    descricao: 'Pesquisa sobre responsabilidade objetiva de empresas por danos ambientais e aplicação do princípio do poluidor-pagador.',
    area: 'Cível',
    relevancia: 'baixa',
    dataPublicacao: new Date(Date.now() - 4838400000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '57',
    tipo: 'legislacao',
    titulo: 'Lei 14.950/2024 sobre Mediação e Conciliação',
    descricao: 'Nova lei incentiva uso de métodos alternativos de solução de conflitos, estabelecendo benefícios fiscais para acordos.',
    area: 'Cível',
    relevancia: 'media',
    dataPublicacao: new Date(Date.now() - 4924800000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Lei 14.950/2024'
  },
  {
    id: '58',
    tipo: 'precedente',
    titulo: 'STJ decide sobre Dano Moral em Relações de Consumo Coletivas',
    descricao: 'Superior Tribunal de Justiça estabelece parâmetros para reconhecimento de dano moral coletivo em ações civis públicas.',
    area: 'Consumidor',
    relevancia: 'alta',
    tribunal: 'STJ',
    dataPublicacao: new Date(Date.now() - 5011200000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false
  },
  {
    id: '59',
    tipo: 'sumula',
    titulo: 'TST revisa Súmula 277 sobre Convenção Coletiva',
    descricao: 'Tribunal Superior do Trabalho atualiza súmula sobre condições para ultratividade de normas coletivas.',
    area: 'Trabalhista',
    relevancia: 'alta',
    tribunal: 'TST',
    dataPublicacao: new Date(Date.now() - 5097600000).toISOString(),
    lido: false,
    arquivado: false,
    novo: false,
    numeroReferencia: 'Súmula 277'
  },
  {
    id: '60',
    tipo: 'precedente',
    titulo: 'STF reconhece imunidade tributária de templos religiosos',
    descricao: 'Supremo Tribunal Federal define alcance da imunidade tributária de templos de qualquer culto, incluindo patrimônio, renda e serviços.',
    area: 'Constitucional',
    relevancia: 'alta',
    tribunal: 'STF',
    dataPublicacao: new Date(Date.now() - 5184000000).toISOString(),
    lido: true,
    arquivado: false,
    novo: false,
    numeroReferencia: 'RE 567.890'
  }
];
