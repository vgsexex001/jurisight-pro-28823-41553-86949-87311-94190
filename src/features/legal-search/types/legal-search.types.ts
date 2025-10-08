// Tipos para pesquisa jurídica

export interface SearchQuery {
  text: string;
  filters: SearchFilters;
  context?: string;
}

export interface SearchFilters {
  type: 'all' | 'jurisprudence' | 'legislation' | 'doctrine';
  court?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  subject?: string[];
  keywords?: string[];
}

export interface JurisprudenceResult {
  id: string;
  title: string;
  court: string;
  caseNumber: string;
  date: Date;
  summary: string;
  fullText: string;
  relator: string;
  decision: string;
  keywords: string[];
  relevanceScore: number;
  url: string;
}

export interface LegislationResult {
  id: string;
  title: string;
  type: 'lei' | 'decreto' | 'portaria' | 'resolucao';
  number: string;
  date: Date;
  ementa: string;
  fullText: string;
  status: 'vigente' | 'revogada' | 'suspensa';
  amendments?: string[];
  url: string;
}

export interface AIAnalysis {
  id: string;
  query: string;
  analysis: string;
  sources: Source[];
  confidence: number;
  generatedAt: Date;
  reasoning: string;
  recommendations: string[];
  relatedTopics: string[];
}

export interface Source {
  type: 'jurisprudence' | 'legislation' | 'doctrine';
  title: string;
  reference: string;
  excerpt: string;
  url: string;
  relevance: number;
}
