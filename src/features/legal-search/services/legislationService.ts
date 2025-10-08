import type { LegislationResult } from '../types/legal-search.types';

// Serviço de busca em legislação
export class LegislationService {
  // Dados mock das principais legislações (em produção, usar API do Planalto/LexML)
  private mockData: LegislationResult[] = [
    {
      id: 'cf-1988',
      title: 'Constituição Federal de 1988',
      type: 'lei',
      number: 'CF/1988',
      date: new Date('1988-10-05'),
      ementa: 'Constituição da República Federativa do Brasil de 1988',
      fullText: 'Nós, representantes do povo brasileiro...',
      status: 'vigente',
      url: 'http://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm'
    },
    {
      id: 'clt',
      title: 'Consolidação das Leis do Trabalho - CLT',
      type: 'decreto',
      number: 'Decreto-Lei nº 5.452/1943',
      date: new Date('1943-05-01'),
      ementa: 'Aprova a Consolidação das Leis do Trabalho',
      fullText: 'Art. 1º Esta Consolidação...',
      status: 'vigente',
      amendments: ['Lei 13.467/2017 (Reforma Trabalhista)'],
      url: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm'
    },
    {
      id: 'cc-2002',
      title: 'Código Civil',
      type: 'lei',
      number: 'Lei nº 10.406/2002',
      date: new Date('2002-01-10'),
      ementa: 'Institui o Código Civil',
      fullText: 'Art. 1º Toda pessoa é capaz...',
      status: 'vigente',
      url: 'http://www.planalto.gov.br/ccivil_03/leis/2002/l10406.htm'
    },
    {
      id: 'cpc-2015',
      title: 'Código de Processo Civil',
      type: 'lei',
      number: 'Lei nº 13.105/2015',
      date: new Date('2015-03-16'),
      ementa: 'Código de Processo Civil',
      fullText: 'Art. 1º O processo civil será ordenado...',
      status: 'vigente',
      url: 'http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm'
    },
    {
      id: 'lgpd',
      title: 'Lei Geral de Proteção de Dados - LGPD',
      type: 'lei',
      number: 'Lei nº 13.709/2018',
      date: new Date('2018-08-14'),
      ementa: 'Lei Geral de Proteção de Dados Pessoais (LGPD)',
      fullText: 'Art. 1º Esta Lei dispõe sobre o tratamento de dados pessoais...',
      status: 'vigente',
      url: 'http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm'
    }
  ];

  async searchLegislation(query: string): Promise<LegislationResult[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!query || query.length < 3) {
      return [];
    }

    const termos = query.toLowerCase().split(' ');
    
    return this.mockData.filter(item =>
      termos.some(termo =>
        item.title.toLowerCase().includes(termo) ||
        item.ementa.toLowerCase().includes(termo) ||
        item.number.toLowerCase().includes(termo)
      )
    );
  }

  async getLawByNumber(number: string): Promise<LegislationResult | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return this.mockData.find(
      item => item.number.toLowerCase().includes(number.toLowerCase())
    ) || null;
  }
}

export const legislationService = new LegislationService();
