import { useState } from 'react';
import { Search, Filter, Sparkles, BookOpen, Scale, FileText, Loader2 } from 'lucide-react';
import { useLegalSearch } from '@/features/legal-search/hooks/useLegalSearch';
import { JurisprudenceCard } from '@/features/legal-search/components/JurisprudenceCard';
import { LegislationCard } from '@/features/legal-search/components/LegislationCard';
import { AIAnalysisPanel } from '@/features/legal-search/components/AIAnalysisPanel';
import type { AIAnalysis } from '@/features/legal-search/types/legal-search.types';
import toast from 'react-hot-toast';

export default function PesquisaJuridica() {
  const {
    query,
    setQuery,
    filters,
    setFilters,
    jurisprudence,
    legislation,
    isSearching,
    generateAnalysis,
    isGenerating
  } = useLegalSearch();

  const [activeTab, setActiveTab] = useState<'all' | 'jurisprudence' | 'legislation'>('all');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [aiAnalysis, setAIAnalysis] = useState<AIAnalysis | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca é automática via React Query quando query muda
  };

  const handleGenerateAnalysis = async () => {
    if (!query) {
      toast.error('Digite uma consulta primeiro');
      return;
    }

    if (jurisprudence.length === 0 && legislation.length === 0) {
      toast.error('Faça uma busca primeiro para ter fontes para a análise');
      return;
    }

    try {
      const result = await generateAnalysis({ searchQuery: query });
      setAIAnalysis(result);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
    }
  };

  const popularSearches = [
    'prescrição quinquenal',
    'prazo recursal',
    'dano moral',
    'execução trabalhista',
    'reforma trabalhista'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/10">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <Search className="w-8 h-8 text-primary-600" />
                Pesquisa Jurídica
              </h1>
              <p className="text-neutral-600 mt-1">
                Busca inteligente em jurisprudência e legislação
              </p>
            </div>

            <button
              onClick={handleGenerateAnalysis}
              disabled={isGenerating || !query || (jurisprudence.length === 0 && legislation.length === 0)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Análise com IA
                </>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: prescrição quinquenal, prazo recursal, execução trabalhista..."
              className="w-full h-14 pl-12 pr-32 rounded-xl border-2 border-neutral-200 bg-white text-base font-medium text-neutral-900 placeholder:text-neutral-500 transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Filtros</span>
              </button>
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
              </button>
            </div>
          </form>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'all', label: 'Todos', icon: BookOpen },
              { id: 'jurisprudence', label: 'Jurisprudência', icon: Scale },
              { id: 'legislation', label: 'Legislação', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const count = tab.id === 'jurisprudence' ? jurisprudence.length : 
                           tab.id === 'legislation' ? legislation.length : 
                           jurisprudence.length + legislation.length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {query && count > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-4">
            {isSearching ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200 animate-pulse">
                    <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
                    <div className="h-4 bg-neutral-200 rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : query && (jurisprudence.length > 0 || legislation.length > 0) ? (
              <>
                {(activeTab === 'all' || activeTab === 'jurisprudence') && 
                  jurisprudence.map((item) => (
                    <JurisprudenceCard key={item.id} data={item} />
                  ))
                }

                {(activeTab === 'all' || activeTab === 'legislation') && 
                  legislation.map((item) => (
                    <LegislationCard key={item.id} data={item} />
                  ))
                }
              </>
            ) : query ? (
              <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center">
                <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-neutral-600">
                  Tente refinar sua busca ou usar outros termos
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-12 border border-primary-200 text-center">
                <Sparkles className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Comece sua pesquisa
                </h3>
                <p className="text-neutral-600 mb-6">
                  Digite um tema jurídico para buscar em bases oficiais
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {aiAnalysis && showAnalysis && (
              <AIAnalysisPanel analysis={aiAnalysis} />
            )}

            {query && (jurisprudence.length > 0 || legislation.length > 0) && (
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">
                  Estatísticas
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      {jurisprudence.length + legislation.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">Jurisprudência</span>
                    <span className="text-lg font-bold text-primary-600">
                      {jurisprudence.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">Legislação</span>
                    <span className="text-lg font-bold text-primary-600">
                      {legislation.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
