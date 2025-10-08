import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { jurisprudenceService } from '../services/jurisprudenceService';
import { legislationService } from '../services/legislationService';
import type { SearchFilters, AIAnalysis, Source } from '../types/legal-search.types';
import toast from 'react-hot-toast';

export const useLegalSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    court: [],
    subject: []
  });
  const queryClient = useQueryClient();

  // Buscar jurisprudência
  const searchJurisprudence = useQuery({
    queryKey: ['jurisprudence', query, filters],
    queryFn: async () => {
      if (!query || query.length < 3) return [];
      return await jurisprudenceService.searchAll(query, filters);
    },
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar legislação
  const searchLegislation = useQuery({
    queryKey: ['legislation', query],
    queryFn: async () => {
      if (!query || query.length < 3) return [];
      return await legislationService.searchLegislation(query);
    },
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000,
  });

  // Gerar análise com Lovable AI
  const generateAnalysis = useMutation({
    mutationFn: async ({ 
      searchQuery, 
      context 
    }: { 
      searchQuery: string; 
      context?: string 
    }) => {
      const jurisprudence = searchJurisprudence.data || [];
      const legislation = searchLegislation.data || [];

      const sources: Source[] = [
        ...jurisprudence.slice(0, 5).map(j => ({
          type: 'jurisprudence' as const,
          title: j.title,
          reference: `${j.court} - ${j.caseNumber}`,
          excerpt: j.summary.slice(0, 200),
          url: j.url,
          relevance: j.relevanceScore
        })),
        ...legislation.slice(0, 3).map(l => ({
          type: 'legislation' as const,
          title: l.title,
          reference: l.number,
          excerpt: l.ementa.slice(0, 200),
          url: l.url,
          relevance: 90
        }))
      ];

      if (sources.length === 0) {
        throw new Error('Nenhuma fonte encontrada para análise. Faça uma busca primeiro.');
      }

      // Chamar edge function que usa Lovable AI
      const { data, error } = await supabase.functions.invoke('analyze-legal-query', {
        body: { 
          query: searchQuery,
          context: context || '',
          sources: sources.map(s => ({
            type: s.type,
            title: s.title,
            reference: s.reference,
            excerpt: s.excerpt
          }))
        }
      });

      if (error) throw error;

      const analysis: AIAnalysis = {
        id: `analysis-${Date.now()}`,
        query: searchQuery,
        analysis: data.analysis,
        sources,
        confidence: data.confidence || 85,
        generatedAt: new Date(),
        reasoning: 'Análise baseada em fontes oficiais verificadas',
        recommendations: data.recommendations || [],
        relatedTopics: data.relatedTopics || []
      };

      return analysis;
    },
    onSuccess: () => {
      toast.success('Análise gerada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['analysis-history'] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao gerar análise: ${error.message}`);
    }
  });

  return {
    query,
    setQuery,
    filters,
    setFilters,
    jurisprudence: searchJurisprudence.data || [],
    legislation: searchLegislation.data || [],
    isSearching: searchJurisprudence.isLoading || searchLegislation.isLoading,
    generateAnalysis: generateAnalysis.mutateAsync,
    isGenerating: generateAnalysis.isPending,
  };
};
