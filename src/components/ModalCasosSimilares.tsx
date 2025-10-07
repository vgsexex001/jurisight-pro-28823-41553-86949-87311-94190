import { useState, useEffect } from 'react';
import { X, Search, TrendingUp, FileText, Brain } from 'lucide-react';
import { SemanticSearchService } from '@/services/semanticSearch';
import { resultadosMock } from '@/data/resultadosMock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ModalCasosSimilaresProps {
  resultado: any;
  onClose: () => void;
  onVerDetalhes: (resultado: any) => void;
}

export default function ModalCasosSimilares({ resultado, onClose, onVerDetalhes }: ModalCasosSimilaresProps) {
  const [casosSimilares, setCasosSimilares] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(true);
  const [criterio, setCriterio] = useState<'ia' | 'tags' | 'area'>('ia');

  useEffect(() => {
    buscarCasosSimilares();
  }, [criterio]);

  const buscarCasosSimilares = async () => {
    setBuscando(true);
    
    try {
      let similares: any[] = [];

      if (criterio === 'ia') {
        // Busca com IA usando embeddings simulados
        const semanticService = new SemanticSearchService('mock-key');
        const textoReferencia = `${resultado.titulo} ${resultado.ementa}`;
        similares = await semanticService.buscarSimilares(textoReferencia, resultadosMock);
        similares = similares.filter(s => s.id !== resultado.id).slice(0, 10);
      } else if (criterio === 'tags') {
        similares = buscarPorTags();
      } else {
        similares = buscarPorArea();
      }

      setCasosSimilares(similares);
    } catch (error) {
      console.error('Erro ao buscar casos similares:', error);
      setCasosSimilares(buscarPorTags());
    } finally {
      setBuscando(false);
    }
  };

  const buscarPorTags = () => {
    return resultadosMock
      .filter(r => r.id !== resultado.id)
      .map(r => ({
        ...r,
        score: calcularSimilaridadeTags(resultado.tags, r.tags)
      }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const buscarPorArea = () => {
    return resultadosMock
      .filter(r => r.id !== resultado.id && r.area === resultado.area)
      .slice(0, 10);
  };

  const calcularSimilaridadeTags = (tags1: string[], tags2: string[]): number => {
    const tagsComuns = tags1.filter(tag => tags2.includes(tag));
    return tagsComuns.length;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Muito Similar';
    if (score >= 0.6) return 'Similar';
    if (score >= 0.4) return 'Parcialmente Similar';
    return 'Pouco Similar';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col shadow-lg border animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Casos Similares</h2>
            <p className="text-muted-foreground text-sm">Referência: {resultado.numero}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filtros de busca */}
        <div className="p-6 border-b bg-muted/30">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Critério de busca:</span>
            <div className="flex gap-2">
              <Button
                onClick={() => setCriterio('ia')}
                variant={criterio === 'ia' ? 'default' : 'outline'}
                size="sm"
              >
                <Brain className="w-4 h-4 mr-2" />
                Busca com IA
              </Button>
              <Button
                onClick={() => setCriterio('tags')}
                variant={criterio === 'tags' ? 'default' : 'outline'}
                size="sm"
              >
                Por Tags
              </Button>
              <Button
                onClick={() => setCriterio('area')}
                variant={criterio === 'area' ? 'default' : 'outline'}
                size="sm"
              >
                Mesma Área
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de casos */}
        <div className="flex-1 overflow-y-auto p-6">
          {buscando ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
              <p className="text-muted-foreground">Analisando casos similares...</p>
            </div>
          ) : casosSimilares.length > 0 ? (
            <div className="space-y-4">
              {casosSimilares.map((caso, index) => (
                <div
                  key={caso.id}
                  className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        {caso.similaridade !== undefined && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`w-4 h-4 ${getScoreColor(caso.similaridade)}`} />
                            <span className={`text-sm font-medium ${getScoreColor(caso.similaridade)}`}>
                              {(caso.similaridade * 100).toFixed(0)}% - {getScoreLabel(caso.similaridade)}
                            </span>
                          </div>
                        )}
                        {caso.score !== undefined && criterio === 'tags' && (
                          <span className="text-sm font-medium text-muted-foreground">
                            {caso.score} tag(s) em comum
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg mb-2">
                        {caso.numero} - {caso.titulo}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {caso.ementa}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="destructive">{caso.tribunal}</Badge>
                        <Badge variant="outline">{caso.area}</Badge>
                        <span className="text-sm text-muted-foreground">{caso.data}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => onVerDetalhes(caso)} size="sm">
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      Comparar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum caso similar encontrado</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/30 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {casosSimilares.length} caso(s) similar(es) encontrado(s)
          </p>
          <Button onClick={onClose} variant="secondary">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
