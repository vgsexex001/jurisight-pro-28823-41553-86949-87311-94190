export const resultadosMock = [
  // Jurisprudências
  {
    id: 'jurisp-001',
    tipo: 'jurisprudencia' as const,
    tribunal: 'TST',
    numero: 'RR-1000-40.2019.5.02.0461',
    titulo: 'Horas extras e banco de horas - Compensação de jornada',
    ementa: 'RECURSO DE REVISTA. HORAS EXTRAS. BANCO DE HORAS. ACORDO INDIVIDUAL. INVALIDADE. O Tribunal Regional consignou que, embora previsto em acordo individual, o banco de horas não foi implementado de forma regular, razão pela qual as horas excedentes à 8ª diária e à 44ª semanal são devidas como extras. Nesse contexto, não há como se reconhecer a validade do acordo de compensação de jornada, tendo em conta que a Constituição Federal, em seu art. 7º, XIII, exige a existência de acordo ou convenção coletiva de trabalho para a instituição de regime compensatório de jornada. Recurso de revista não conhecido.',
    relator: 'Ministro Augusto César Leite de Carvalho',
    data: '2024-03-15',
    visualizacoes: 15420,
    area: 'Trabalhista',
    tags: ['horas-extras', 'banco-de-horas', 'compensacao', 'jornada']
  },
  {
    id: 'jurisp-002',
    tipo: 'jurisprudencia' as const,
    tribunal: 'STJ',
    numero: 'REsp 1.845.982',
    titulo: 'Dano moral por abalo de crédito - Inscrição indevida em cadastro de inadimplentes',
    ementa: 'CIVIL E PROCESSUAL CIVIL. RECURSO ESPECIAL. AÇÃO DE INDENIZAÇÃO. DANOS MORAIS. INSCRIÇÃO INDEVIDA EM CADASTRO DE INADIMPLENTES. QUANTUM INDENIZATÓRIO. REVISÃO. IMPOSSIBILIDADE. SÚMULA 7/STJ. 1. O valor arbitrado a título de danos morais pode ser revisto nas hipóteses em que a condenação se revelar irrisória ou exorbitante, em manifesta ofensa aos princípios da razoabilidade e da proporcionalidade. 2. No caso, o montante fixado em R$ 10.000,00 não se mostra excessivo nem irrisório, encontrando-se em harmonia com os parâmetros adotados por esta Corte em casos análogos. Recurso especial não provido.',
    relator: 'Ministro Luis Felipe Salomão',
    data: '2024-02-20',
    visualizacoes: 22150,
    area: 'Cível',
    tags: ['dano-moral', 'abalo-credito', 'inscricao-indevida', 'indenizacao']
  },
  {
    id: 'jurisp-003',
    tipo: 'jurisprudencia' as const,
    tribunal: 'TST',
    numero: 'AIRR-10438-85.2020.5.03.0013',
    titulo: 'Trabalho remoto durante pandemia - Direito à desconexão',
    ementa: 'AGRAVO DE INSTRUMENTO EM RECURSO DE REVISTA. TRABALHO REMOTO. PANDEMIA. COVID-19. DIREITO À DESCONEXÃO. HORAS EXTRAS. SOBREJORNADA COMPROVADA. A implementação do trabalho remoto durante a pandemia não afasta o direito do empregado à desconexão e ao respeito aos intervalos legais. Comprovado que o empregador exigia disponibilidade integral do empregado, inclusive fora do horário de trabalho, mediante mensagens e ligações constantes, configura-se a sobrejornada, sendo devidas as respectivas horas extras. Precedentes desta Corte. Agravo de instrumento conhecido e não provido.',
    relator: 'Ministra Delaíde Miranda Arantes',
    data: '2024-01-10',
    visualizacoes: 31240,
    area: 'Trabalhista',
    tags: ['trabalho-remoto', 'desconexao', 'covid-19', 'horas-extras', 'pandemia']
  },
  {
    id: 'jurisp-004',
    tipo: 'jurisprudencia' as const,
    tribunal: 'STF',
    numero: 'RE 1.100.000',
    titulo: 'Reforma trabalhista - Terceirização de atividade-fim - Constitucionalidade',
    ementa: 'RECURSO EXTRAORDINÁRIO. DIREITO DO TRABALHO. TERCEIRIZAÇÃO. ATIVIDADE-FIM. LEI 13.429/2017 E LEI 13.467/2017 (REFORMA TRABALHISTA). CONSTITUCIONALIDADE. ADPF 324 E RE 958.252. TESE FIXADA. É lícita a terceirização ou qualquer outra forma de divisão do trabalho entre pessoas jurídicas distintas, independentemente do objeto social das empresas envolvidas, mantida a responsabilidade subsidiária da empresa contratante. Recurso extraordinário provido para declarar a constitucionalidade das disposições que permitem a terceirização da atividade-fim.',
    relator: 'Ministro Alexandre de Moraes',
    data: '2023-08-30',
    visualizacoes: 45820,
    area: 'Constitucional',
    tags: ['terceirizacao', 'atividade-fim', 'reforma-trabalhista', 'constitucionalidade']
  },
  {
    id: 'jurisp-005',
    tipo: 'jurisprudencia' as const,
    tribunal: 'TST',
    numero: 'ARR-765-43.2021.5.09.0003',
    titulo: 'Rescisão indireta por assédio moral - COVID-19',
    ementa: 'RECURSO DE REVISTA. RESCISÃO INDIRETA. ASSÉDIO MORAL. PANDEMIA. COVID-19. EXPOSIÇÃO A RISCO. Comprovado que o empregador deixou de fornecer equipamentos de proteção individual adequados durante a pandemia de COVID-19, expondo o trabalhador a risco de contaminação, e que houve prática reiterada de assédio moral, com cobrança excessiva de metas impossíveis de serem cumpridas no contexto pandêmico, resta caracterizada falta grave do empregador, nos termos do art. 483, alíneas "a" e "c", da CLT, autorizando a rescisão indireta do contrato de trabalho. Recurso de revista conhecido e provido.',
    relator: 'Ministro Márcio Eurico Vitral Amaro',
    data: '2023-11-25',
    visualizacoes: 18650,
    area: 'Trabalhista',
    tags: ['rescisao-indireta', 'assedio-moral', 'covid-19', 'epi']
  },

  // Súmulas
  {
    id: 'sumula-001',
    tipo: 'sumula' as const,
    tribunal: 'STJ',
    numero: '443',
    titulo: 'Prescrição das pretensões relativas a taxas de condomínio',
    ementa: 'As taxas condominiais cobradas dos condôminos pelo condomínio edilício, por terem natureza pessoal, prescrevem em três anos. Súmula aprovada em 13/06/2010, DJe 24/06/2010.',
    data: '2010-06-24',
    visualizacoes: 8420,
    area: 'Cível',
    tags: ['prescricao', 'condominio', 'taxa-condominial']
  },
  {
    id: 'sumula-002',
    tipo: 'sumula' as const,
    tribunal: 'TST',
    numero: '331',
    titulo: 'Contrato de prestação de serviços - Legalidade',
    ementa: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS. LEGALIDADE. I - A contratação de trabalhadores por empresa interposta é ilegal, formando-se o vínculo diretamente com o tomador dos serviços, salvo no caso de trabalho temporário (Lei nº 6.019, de 03.01.1974). II - A contratação irregular de trabalhador, mediante empresa interposta, não gera vínculo de emprego com os órgãos da Administração Pública direta, indireta ou fundacional (art. 37, II, da CF/1988). III - Não forma vínculo de emprego com o tomador a contratação de serviços de vigilância (Lei nº 7.102, de 20.06.1983) e de conservação e limpeza, bem como a de serviços especializados ligados à atividade-meio do tomador, desde que inexistente a pessoalidade e a subordinação direta. IV - O inadimplemento das obrigações trabalhistas, por parte do empregador, implica a responsabilidade subsidiária do tomador dos serviços quanto àquelas obrigações, desde que haja participado da relação processual e conste também do título executivo judicial.',
    data: '2011-05-27',
    visualizacoes: 52340,
    area: 'Trabalhista',
    tags: ['terceirizacao', 'prestacao-servicos', 'vinculo-emprego', 'responsabilidade-subsidiaria']
  },
  {
    id: 'sumula-003',
    tipo: 'sumula' as const,
    tribunal: 'TST',
    numero: '277',
    titulo: 'Sentença normativa - Vigência - Repercussão nos contratos de trabalho',
    ementa: 'As cláusulas normativas dos acordos coletivos ou convenções coletivas integram os contratos individuais de trabalho e somente poderão ser modificadas ou suprimidas mediante negociação coletiva de trabalho.',
    data: '2012-09-26',
    visualizacoes: 14520,
    area: 'Trabalhista',
    tags: ['acordo-coletivo', 'convencao-coletiva', 'negociacao-coletiva']
  },

  // Legislações
  {
    id: 'leg-001',
    tipo: 'legislacao' as const,
    numero: '13.467/2017',
    titulo: 'Reforma Trabalhista',
    ementa: 'Altera a Consolidação das Leis do Trabalho (CLT), aprovada pelo Decreto-Lei nº 5.452, de 1º de maio de 1943, e as Leis nº 6.019, de 3 de janeiro de 1974, nº 8.036, de 11 de maio de 1990, e nº 8.212, de 24 de julho de 1991, a fim de adequar a legislação às novas relações de trabalho.',
    data: '2017-07-13',
    visualizacoes: 98420,
    area: 'Trabalhista',
    tags: ['reforma-trabalhista', 'clt', 'modernizacao', 'trabalho']
  },
  {
    id: 'leg-002',
    tipo: 'legislacao' as const,
    numero: '8.078/1990',
    titulo: 'Código de Defesa do Consumidor',
    ementa: 'Dispõe sobre a proteção do consumidor e dá outras providências. Estabelece normas de proteção e defesa do consumidor, de ordem pública e interesse social.',
    data: '1990-09-11',
    visualizacoes: 125840,
    area: 'Consumidor',
    tags: ['cdc', 'consumidor', 'defesa', 'protecao']
  },
  {
    id: 'leg-003',
    tipo: 'legislacao' as const,
    numero: '13.709/2018',
    titulo: 'Lei Geral de Proteção de Dados Pessoais (LGPD)',
    ementa: 'Lei Geral de Proteção de Dados Pessoais (LGPD). Dispõe sobre o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou por pessoa jurídica de direito público ou privado, com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade e o livre desenvolvimento da personalidade da pessoa natural.',
    data: '2018-08-14',
    visualizacoes: 87320,
    area: 'Consumidor',
    tags: ['lgpd', 'dados-pessoais', 'privacidade', 'protecao']
  },

  // Doutrinas
  {
    id: 'dout-001',
    tipo: 'doutrina' as const,
    titulo: 'Direito à desconexão no trabalho remoto',
    ementa: 'A implementação massiva do trabalho remoto durante e após a pandemia de COVID-19 trouxe à tona a discussão sobre o direito à desconexão. Segundo Maurício Godinho Delgado, o direito à desconexão é parte integrante do direito fundamental ao lazer e ao descanso, protegido constitucionalmente. A constante conectividade imposta pelas ferramentas digitais pode configurar sobrejornada não remunerada e violação aos direitos fundamentais do trabalhador.',
    relator: 'Maurício Godinho Delgado',
    data: '2023-05-15',
    visualizacoes: 12450,
    area: 'Trabalhista',
    tags: ['desconexao', 'trabalho-remoto', 'direitos-fundamentais', 'jornada']
  },
  {
    id: 'dout-002',
    tipo: 'doutrina' as const,
    titulo: 'Terceirização após a reforma trabalhista',
    ementa: 'Com a Lei 13.467/2017, a terceirização foi amplamente liberalizada no Brasil, permitindo-se inclusive a terceirização da atividade-fim. Segundo Homero Batista Mateus da Silva, embora a reforma tenha trazido maior flexibilização, a jurisprudência ainda impõe limites e responsabilidades ao tomador de serviços, especialmente quanto às obrigações trabalhistas inadimplidas.',
    relator: 'Homero Batista Mateus da Silva',
    data: '2022-09-20',
    visualizacoes: 9840,
    area: 'Trabalhista',
    tags: ['terceirizacao', 'reforma-trabalhista', 'atividade-fim']
  }
];

// Adicionar mais 90+ resultados realistas
for (let i = 1; i <= 90; i++) {
  const tipos = ['jurisprudencia', 'legislacao', 'sumula', 'doutrina'] as const;
  const tribunais = ['STF', 'STJ', 'TST', 'TJSP', 'TRT 2ª'];
  const areas = ['Trabalhista', 'Cível', 'Consumidor', 'Tributário', 'Previdenciário'];
  
  const tipo = tipos[i % tipos.length];
  const area = areas[i % areas.length];
  
  const resultado: any = {
    id: `result-${String(i).padStart(3, '0')}`,
    tipo,
    numero: tipo === 'legislacao' ? `Lei ${10000 + i}/202${i % 5}` : `Proc-${i * 100}-202${i % 5}`,
    titulo: `Caso ${i} - ${area} - Análise de precedentes e jurisprudência consolidada`,
    ementa: `Este é um resultado de busca jurídica completo e detalhado sobre o tema ${area.toLowerCase()}. A ementa apresenta considerações relevantes sobre a matéria, precedentes aplicáveis e a fundamentação jurídica pertinente. Inclui análise de dispositivos legais, princípios constitucionais e interpretação doutrinária. O caso aborda questões controversas e inovadoras no campo do direito ${area.toLowerCase()}, com aplicação prática de suma importância para operadores do direito.`,
    data: `202${Math.floor(i / 20)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    visualizacoes: Math.floor(Math.random() * 50000) + 1000,
    area,
    tags: [`tag-${i}`, 'precedente', area.toLowerCase(), 'jurisprudencia']
  };
  
  if (tipo === 'jurisprudencia') {
    resultado.tribunal = tribunais[i % tribunais.length];
    resultado.relator = `Ministro(a) João Silva ${i}`;
  }
  
  resultadosMock.push(resultado);
}
