// APIs Públicas de Tribunais Brasileiros
export const tribunalApis = {
  // API do CNJ - Conselho Nacional de Justiça
  cnj: {
    baseUrl: 'https://www.cnj.jus.br/corregedoriacnj/justica_aberta/',
    endpoints: {
      processos: '/consultar_processos',
      andamentos: '/consultar_movimentacao'
    }
  },
  
  // JusBrasil (requer API key)
  jusbrasil: {
    baseUrl: 'https://api.jusbrasil.com.br/v1',
    endpoints: {
      search: '/search',
      processo: '/processo',
      jurisprudencia: '/jurisprudence'
    }
  },
  
  // DataJud - Dados Abertos do Judiciário
  datajud: {
    baseUrl: 'https://www.cnj.jus.br/datajud/api',
    endpoints: {
      processos: '/processos',
      tribunais: '/tribunais',
      estatisticas: '/estatisticas'
    }
  }
};

export interface ProcessData {
  numeroProcesso: string;
  tribunal: string;
  vara?: string;
  assunto?: string;
  classe?: string;
  area?: string;
  juiz?: string;
  valor?: number;
  partes?: Array<{ tipo: string; nome: string }>;
  movimentacoes?: Array<{ data: string; descricao: string }>;
}

export class TribunalApiService {
  private apiKey: string;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }
  
  async consultarProcesso(numeroProcesso: string, tribunal: string): Promise<ProcessData> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consultar-processo`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ numeroProcesso, tribunal, apiKey: this.apiKey })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao consultar processo');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao consultar processo:', error);
      throw error;
    }
  }
  
  async buscarJurisprudencia(query: string, tribunal: string, limite: number = 50) {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/buscar-jurisprudencia`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ query, tribunal, limite })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar jurisprudência');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar jurisprudência:', error);
      throw error;
    }
  }
}
