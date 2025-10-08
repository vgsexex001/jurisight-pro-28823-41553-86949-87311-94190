import type { JurisprudenceResult, SearchFilters } from '../types/legal-search.types';

// Serviço de busca em bases de jurisprudência
export class JurisprudenceService {
  // Dados mock para demonstração (em produção, conectar com APIs reais)
  private mockData: JurisprudenceResult[] = [
    {
      id: 'stf-1',
      title: 'Recurso Extraordinário 1.010.606/SC - Prescrição Quinquenal',
      court: 'STF',
      caseNumber: 'RE 1.010.606/SC',
      date: new Date('2023-03-15'),
      summary: 'O prazo prescricional para cobrança de contribuições previdenciárias é de 5 anos, contados do primeiro dia do mês seguinte ao do vencimento.',
      fullText: 'Ementa completa do acórdão...',
      relator: 'Min. Edson Fachin',
      decision: 'Provimento parcial',
      keywords: ['prescrição', 'quinquenal', 'contribuições previdenciárias'],
      relevanceScore: 95,
      url: 'https://portal.stf.jus.br/processos/detalhe.asp?incidente=5250582'
    },
    {
      id: 'stj-1',
      title: 'REsp 1.765.596/SP - Prazo Recursal em Matéria Trabalhista',
      court: 'STJ',
      caseNumber: 'REsp 1.765.596/SP',
      date: new Date('2023-06-20'),
      summary: 'O prazo para interposição de recurso ordinário em reclamação trabalhista é de 8 dias, conforme CLT.',
      fullText: 'Ementa completa...',
      relator: 'Min. Og Fernandes',
      decision: 'Não conhecido',
      keywords: ['prazo', 'recurso', 'trabalhista'],
      relevanceScore: 88,
      url: 'https://processo.stj.jus.br/processo/julgamento/eletronico/documento/mediado/?documento_tipo=91&documento_sequencial=123456'
    },
    {
      id: 'tst-1',
      title: 'RR-1234-56.2022.5.02.0000 - Execução Trabalhista',
      court: 'TST',
      caseNumber: 'RR-1234-56.2022.5.02.0000',
      date: new Date('2023-09-10'),
      summary: 'Em execução trabalhista, a penhora de salários observará os limites do art. 833 do CPC.',
      fullText: 'Ementa completa da decisão...',
      relator: 'Min. Maria Cristina Peduzzi',
      decision: 'Provido',
      keywords: ['execução', 'trabalhista', 'penhora'],
      relevanceScore: 82,
      url: 'https://jurisprudencia.tst.jus.br/#'
    }
  ];

  async searchAll(query: string, filters?: SearchFilters): Promise<JurisprudenceResult[]> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!query || query.length < 3) {
      return [];
    }

    const termos = query.toLowerCase().split(' ');
    
    return this.mockData
      .filter(item => {
        // Filtrar por termos de busca
        const matchesQuery = termos.some(termo =>
          item.title.toLowerCase().includes(termo) ||
          item.summary.toLowerCase().includes(termo) ||
          item.keywords.some(k => k.toLowerCase().includes(termo))
        );

        // Filtrar por tribunal se especificado
        const matchesCourt = !filters?.court?.length || 
          filters.court.some(c => c.toLowerCase() === item.court.toLowerCase());

        // Filtrar por data se especificado
        const matchesDate = !filters?.dateRange || (
          item.date >= filters.dateRange.start &&
          item.date <= filters.dateRange.end
        );

        return matchesQuery && matchesCourt && matchesDate;
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  async searchByNumber(caseNumber: string): Promise<JurisprudenceResult | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockData.find(
      item => item.caseNumber.toLowerCase().includes(caseNumber.toLowerCase())
    ) || null;
  }
}

export const jurisprudenceService = new JurisprudenceService();
