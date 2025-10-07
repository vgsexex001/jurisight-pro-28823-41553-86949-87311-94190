// Dados Mock para Sistema de Pesquisa Jurídica

export const jurisprudencias = [
  {
    id: 1,
    tribunal: 'STF',
    numero: 'RE 1234567',
    titulo: 'Direito à desconexão do trabalho e trabalho remoto',
    ementa: 'RECURSO EXTRAORDINÁRIO. DIREITO DO TRABALHO. TELETRABALHO. DIREITO À DESCONEXÃO. O direito à desconexão se configura como corolário do direito ao descanso e deve ser assegurado mesmo em regime de teletrabalho. Recurso conhecido e provido.',
    relator: 'Min. Roberto Barroso',
    data: '2024-10-05',
    dje: '2024-10-10',
    area: 'Constitucional',
    visualizacoes: 1234,
    tags: ['teletrabalho', 'direito à desconexão', 'trabalho remoto']
  },
  {
    id: 2,
    tribunal: 'TST',
    numero: 'RR 98765-43.2023.5.02.0001',
    titulo: 'Horas extras em regime de banco de horas - Acordo individual',
    ementa: 'RECURSO DE REVISTA. BANCO DE HORAS. ACORDO INDIVIDUAL. IMPOSSIBILIDADE. A compensação de jornada em regime de banco de horas deve ser estabelecida por acordo coletivo de trabalho ou convenção coletiva de trabalho, conforme art. 59, §5º da CLT. Recurso conhecido e provido.',
    relator: 'Min. Maria Helena Mallmann',
    data: '2024-09-28',
    dje: '2024-10-02',
    area: 'Trabalhista',
    visualizacoes: 2156,
    tags: ['horas extras', 'banco de horas', 'acordo individual']
  },
  {
    id: 3,
    tribunal: 'STJ',
    numero: 'REsp 1.987.654',
    titulo: 'Dano moral por assédio moral no ambiente de trabalho',
    ementa: 'CIVIL E PROCESSUAL CIVIL. DANO MORAL. ASSÉDIO MORAL. AMBIENTE DE TRABALHO. RESPONSABILIDADE DO EMPREGADOR. Configurado o assédio moral no ambiente de trabalho, caracterizado por condutas abusivas reiteradas que atentam contra a dignidade do trabalhador, deve o empregador responder pelos danos morais causados.',
    relator: 'Min. Nancy Andrighi',
    data: '2024-09-15',
    dje: '2024-09-20',
    area: 'Cível',
    visualizacoes: 3421,
    tags: ['dano moral', 'assédio moral', 'responsabilidade civil']
  },
  {
    id: 4,
    tribunal: 'TRT 2ª',
    numero: 'RO 1000234-56.2024.5.02.0001',
    titulo: 'Rescisão indireta - Atraso reiterado de salários',
    ementa: 'RESCISÃO INDIRETA. FALTA GRAVE DO EMPREGADOR. ATRASO DE SALÁRIOS. O atraso reiterado no pagamento de salários configura falta grave do empregador, nos termos do art. 483, alínea "d", da CLT, autorizando a rescisão indireta do contrato de trabalho.',
    relator: 'Des. Paulo Silva',
    data: '2024-10-01',
    dje: '2024-10-08',
    area: 'Trabalhista',
    visualizacoes: 1876,
    tags: ['rescisão indireta', 'atraso salarial', 'falta grave']
  },
  {
    id: 5,
    tribunal: 'STF',
    numero: 'ADI 6789',
    titulo: 'Constitucionalidade da reforma trabalhista - Terceirização',
    ementa: 'AÇÃO DIRETA DE INCONSTITUCIONALIDADE. REFORMA TRABALHISTA. TERCEIRIZAÇÃO. LEI 13.467/2017. Não há inconstitucionalidade na permissão de terceirização de atividade-fim, desde que garantidos os direitos fundamentais dos trabalhadores.',
    relator: 'Min. Luiz Fux',
    data: '2024-08-20',
    dje: '2024-08-25',
    area: 'Constitucional',
    visualizacoes: 5234,
    tags: ['terceirização', 'reforma trabalhista', 'constitucionalidade']
  },
  // Adicionar mais 45 jurisprudências variadas
  {
    id: 6,
    tribunal: 'TST',
    numero: 'E-RR 12345-67.2023.5.15.0001',
    titulo: 'Equiparação salarial - Requisitos',
    ementa: 'EQUIPARAÇÃO SALARIAL. REQUISITOS. Para a caracterização da equiparação salarial, são necessários os seguintes requisitos: identidade de funções, trabalho de igual valor, mesma localidade, simultaneidade, mesmo empregador e inexistência de quadro de carreira.',
    relator: 'Min. Cláudio Brandão',
    data: '2024-09-10',
    dje: '2024-09-15',
    area: 'Trabalhista',
    visualizacoes: 987,
    tags: ['equiparação salarial', 'isonomia', 'requisitos']
  }
];

export const sumulas = [
  {
    id: 1,
    numero: 443,
    tribunal: 'TST',
    titulo: 'Dispensa discriminatória - Portador de doença grave',
    texto: 'Presume-se discriminatória a despedida de empregado portador do vírus HIV ou de outra doença grave que suscite estigma ou preconceito. Inválido o ato, o empregado tem direito à reintegração no emprego.',
    aprovacao: '2012',
    vinculante: true,
    area: 'Trabalhista',
    tags: ['dispensa discriminatória', 'doença grave', 'reintegração']
  },
  {
    id: 2,
    numero: 331,
    tribunal: 'TST',
    titulo: 'Contrato de prestação de serviços - Legalidade',
    texto: 'A contratação de trabalhadores por empresa interposta é ilegal, formando-se o vínculo diretamente com o tomador dos serviços, salvo no caso de trabalho temporário (Lei nº 6.019/1974).',
    aprovacao: '1993',
    vinculante: true,
    area: 'Trabalhista',
    tags: ['terceirização', 'vínculo empregatício', 'empresa interposta']
  },
  {
    id: 3,
    numero: 126,
    tribunal: 'TST',
    titulo: 'Sobreaviso - Aplicação analógica',
    texto: 'O empregado que permanece em sua residência, aguardando a qualquer momento o chamado para o serviço durante o período de descanso, tem direito às horas de sobreaviso.',
    aprovacao: '1981',
    vinculante: false,
    area: 'Trabalhista',
    tags: ['sobreaviso', 'horas extras', 'descanso']
  },
  {
    id: 4,
    numero: 90,
    tribunal: 'TST',
    titulo: 'Horas extras habituais - Reflexos',
    texto: 'As horas extras habituais integram o cálculo de aviso prévio, adicional noturno, horas extras, repouso semanal remunerado e reflexos em outras verbas trabalhistas.',
    aprovacao: '1978',
    vinculante: false,
    area: 'Trabalhista',
    tags: ['horas extras', 'reflexos', 'verbas trabalhistas']
  }
];

export const legislacoes = [
  {
    id: 1,
    tipo: 'Lei',
    numero: '13.467/2017',
    titulo: 'Reforma Trabalhista',
    descricao: 'Altera a Consolidação das Leis do Trabalho (CLT), aprovada pelo Decreto-Lei nº 5.452, de 1º de maio de 1943, e as Leis nº 6.019, de 3 de janeiro de 1974, 8.036, de 11 de maio de 1990, e 8.212, de 24 de julho de 1991, a fim de adequar a legislação às novas relações de trabalho.',
    publicacao: '2017-07-14',
    vigencia: '2017-11-11',
    area: 'Trabalhista',
    status: 'Vigente',
    tags: ['reforma trabalhista', 'CLT', 'relações de trabalho']
  },
  {
    id: 2,
    tipo: 'Lei',
    numero: '13.709/2018',
    titulo: 'Lei Geral de Proteção de Dados (LGPD)',
    descricao: 'Dispõe sobre o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou por pessoa jurídica de direito público ou privado, com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade.',
    publicacao: '2018-08-14',
    vigencia: '2020-09-18',
    area: 'Direito Digital',
    status: 'Vigente',
    tags: ['LGPD', 'proteção de dados', 'privacidade']
  },
  {
    id: 3,
    tipo: 'Decreto-Lei',
    numero: '5.452/1943',
    titulo: 'Consolidação das Leis do Trabalho (CLT)',
    descricao: 'Aprova a Consolidação das Leis do Trabalho.',
    publicacao: '1943-05-01',
    vigencia: '1943-11-10',
    area: 'Trabalhista',
    status: 'Vigente (com alterações)',
    tags: ['CLT', 'direito do trabalho', 'legislação trabalhista']
  },
  {
    id: 4,
    tipo: 'Lei',
    numero: '8.078/1990',
    titulo: 'Código de Defesa do Consumidor',
    descricao: 'Dispõe sobre a proteção do consumidor e dá outras providências.',
    publicacao: '1990-09-11',
    vigencia: '1991-03-11',
    area: 'Consumidor',
    status: 'Vigente',
    tags: ['CDC', 'consumidor', 'proteção']
  }
];

export const modelos = [
  {
    id: 1,
    nome: 'Petição Inicial - Ação Trabalhista',
    categoria: 'Trabalhista',
    subcategoria: 'Inicial',
    descricao: 'Modelo completo de petição inicial para reclamação trabalhista com todos os requisitos legais',
    downloads: 1234,
    tags: ['petição inicial', 'reclamação trabalhista', 'CLT'],
    paginas: 8,
    ultimaAtualizacao: '2024-10-01'
  },
  {
    id: 2,
    nome: 'Recurso Ordinário - TST',
    categoria: 'Trabalhista',
    subcategoria: 'Recursal',
    descricao: 'Modelo de recurso ordinário para TST com fundamentação completa e jurisprudência atualizada',
    downloads: 856,
    tags: ['recurso ordinário', 'TST', 'recursal'],
    paginas: 12,
    ultimaAtualizacao: '2024-09-28'
  },
  {
    id: 3,
    nome: 'Contestação - Ação Trabalhista',
    categoria: 'Trabalhista',
    subcategoria: 'Defesa',
    descricao: 'Modelo de contestação em reclamação trabalhista com preliminares e mérito',
    downloads: 923,
    tags: ['contestação', 'defesa', 'reclamação trabalhista'],
    paginas: 10,
    ultimaAtualizacao: '2024-09-15'
  },
  {
    id: 4,
    nome: 'Agravo de Instrumento',
    categoria: 'Trabalhista',
    subcategoria: 'Recursal',
    descricao: 'Modelo de agravo de instrumento contra decisões interlocutórias',
    downloads: 654,
    tags: ['agravo', 'agravo de instrumento', 'decisão interlocutória'],
    paginas: 6,
    ultimaAtualizacao: '2024-09-20'
  },
  {
    id: 5,
    nome: 'Reclamação Rescisória',
    categoria: 'Trabalhista',
    subcategoria: 'Ação Autônoma',
    descricao: 'Modelo de reclamação rescisória com todas as hipóteses de cabimento',
    downloads: 432,
    tags: ['rescisória', 'ação rescisória', 'coisa julgada'],
    paginas: 15,
    ultimaAtualizacao: '2024-08-30'
  },
  {
    id: 6,
    nome: 'Mandado de Segurança',
    categoria: 'Constitucional',
    subcategoria: 'Ação Constitucional',
    descricao: 'Modelo de mandado de segurança contra ato de autoridade',
    downloads: 789,
    tags: ['mandado de segurança', 'direito líquido e certo', 'autoridade'],
    paginas: 8,
    ultimaAtualizacao: '2024-09-10'
  },
  {
    id: 7,
    nome: 'Ação de Consignação em Pagamento',
    categoria: 'Trabalhista',
    subcategoria: 'Ação Especial',
    descricao: 'Modelo para ação de consignação em pagamento de verbas trabalhistas',
    downloads: 321,
    tags: ['consignação', 'pagamento', 'verbas trabalhistas'],
    paginas: 7,
    ultimaAtualizacao: '2024-08-25'
  },
  {
    id: 8,
    nome: 'Embargos de Declaração',
    categoria: 'Trabalhista',
    subcategoria: 'Recursal',
    descricao: 'Modelo de embargos de declaração para suprir omissão, obscuridade ou contradição',
    downloads: 567,
    tags: ['embargos de declaração', 'omissão', 'contradição'],
    paginas: 4,
    ultimaAtualizacao: '2024-09-05'
  }
];

export const alertasJuridicos = [
  {
    id: 1,
    tipo: 'nova_sumula',
    titulo: 'Nova Súmula 500 do TST publicada',
    descricao: 'TST aprova nova súmula sobre interpretação de acordo coletivo',
    data: new Date().toISOString(),
    relevancia: 'alta',
    categoria: 'Trabalhista',
    lido: false
  },
  {
    id: 2,
    tipo: 'precedente',
    titulo: 'STF decide sobre LGPD - Tema de repercussão geral',
    descricao: 'Supremo define limites de aplicação da LGPD em relações trabalhistas',
    data: new Date(Date.now() - 86400000).toISOString(),
    relevancia: 'alta',
    categoria: 'Constitucional',
    lido: false
  },
  {
    id: 3,
    tipo: 'legislacao',
    titulo: 'PL 1234/2024 aprovado - Altera CLT Art. 62',
    descricao: 'Projeto de lei que modifica regras sobre cargos de confiança foi aprovado',
    data: new Date(Date.now() - 172800000).toISOString(),
    relevancia: 'media',
    categoria: 'Trabalhista',
    lido: true
  },
  {
    id: 4,
    tipo: 'jurisprudencia',
    titulo: 'STJ uniformiza entendimento sobre dano moral',
    descricao: 'Segunda Seção decide sobre quantificação de danos morais',
    data: new Date(Date.now() - 259200000).toISOString(),
    relevancia: 'alta',
    categoria: 'Cível',
    lido: true
  }
];
