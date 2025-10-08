// Tipos compartilhados para resultados de busca jurídica

export interface Resultado {
  id: string;
  tipo: 'jurisprudencia' | 'legislacao' | 'sumula' | 'doutrina';
  tribunal?: string;
  numero?: string;
  titulo: string;
  ementa: string;
  relator?: string;
  data: string;
  visualizacoes?: number;
  area: string;
  tags: string[];
  similaridade?: number;
  score?: number;
}

export interface Analise {
  resultado: string;
  valorCondenacao: string;
  resumoExecutivo?: string;
  fundamentos: string[];
  pontosRelevantes: string[];
  probabilidadeReforma: string;
  justificativaReforma?: string;
  tags: string[];
  recomendacoes: string[];
  precedentesRelacionados?: string[];
  pontuacao?: {
    solidezArgumentacao: number;
    probabilidadeSucesso: number;
    riscosIdentificados: number;
  };
  analiseDetalhada?: {
    contextoProcessual?: string;
    tesesDefesa?: string[];
    tesesAcusacao?: string[];
    jurisprudenciaAplicavel?: string;
    impactosPraticos?: string;
  };
  dataAnalise?: string;
  documentoAnalisado?: {
    id: string;
    numero?: string;
    titulo: string;
    tribunal?: string;
    area?: string;
  };
  avisoMock?: string;
}
