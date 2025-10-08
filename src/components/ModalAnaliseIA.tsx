import { useState, useEffect } from 'react';
import { X, Brain, TrendingUp, AlertTriangle, CheckCircle, FileText, Zap } from 'lucide-react';
import { OpenAIAnalysisService } from '@/services/openaiService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Resultado {
  id: string;
  tipo: string;
  tribunal?: string;
  numero?: string;
  titulo: string;
  ementa: string;
  relator?: string;
  data: string;
  visualizacoes?: number;
  area: string;
  tags: string[];
}

interface Analise {
  resultado: string;
  valorCondenacao: string;
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
}

interface ModalAnaliseIAProps {
  resultado: Resultado;
  onClose: () => void;
}

export default function ModalAnaliseIA({ resultado, onClose }: ModalAnaliseIAProps) {
  const [analisando, setAnalisando] = useState(true);
  const [analise, setAnalise] = useState<Analise | null>(null);

  useEffect(() => {
    realizarAnalise();
  }, []);

  const realizarAnalise = async () => {
    setAnalisando(true);

    try {
      const openaiService = new OpenAIAnalysisService('mock-key');
      
      const textoAnalise = `
Título: ${resultado.titulo}
Número: ${resultado.numero}
Tribunal: ${resultado.tribunal}
Área: ${resultado.area}
Data: ${resultado.data}

Ementa:
${resultado.ementa}

Relator: ${resultado.relator}
      `.trim();

      const resultadoAnalise = await openaiService.analisarSentenca(textoAnalise);
      setAnalise(resultadoAnalise);
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setAnalisando(false);
    }
  };

  const getResultadoColor = (resultado: string) => {
    if (resultado === 'Procedente') return 'text-green-600';
    if (resultado === 'Improcedente') return 'text-red-600';
    return 'text-yellow-600';
  };

  const getRiscoColor = (risco: string) => {
    if (risco === 'Baixa') return 'text-green-600';
    if (risco === 'Alta') return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col shadow-lg border animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Análise Inteligente com IA</h2>
              <p className="text-sm text-muted-foreground">{resultado.numero}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          {analisando ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4" />
                <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-medium mb-2">Analisando documento com IA...</p>
              <p className="text-muted-foreground text-sm">Isso pode levar alguns segundos</p>
            </div>
          ) : analise ? (
            <div className="space-y-6">
              {/* Resumo Executivo */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Resumo Executivo
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg p-4 text-center border">
                    <p className="text-sm text-muted-foreground mb-1">Resultado</p>
                    <p className={`text-2xl font-bold ${getResultadoColor(analise.resultado)}`}>
                      {analise.resultado}
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 text-center border">
                    <p className="text-sm text-muted-foreground mb-1">Valor</p>
                    <p className="text-2xl font-bold text-primary">
                      {analise.valorCondenacao || 'Não informado'}
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 text-center border">
                    <p className="text-sm text-muted-foreground mb-1">Risco de Reforma</p>
                    <p className={`text-2xl font-bold ${getRiscoColor(analise.probabilidadeReforma)}`}>
                      {analise.probabilidadeReforma}
                    </p>
                  </div>
                </div>

                {analise.justificativaReforma && (
                  <div className="mt-4 p-4 bg-card rounded-lg border">
                    <p className="text-sm">
                      <strong>Justificativa:</strong> {analise.justificativaReforma}
                    </p>
                  </div>
                )}
              </div>

              {/* Pontuação da Análise */}
              {analise.pontuacao && (
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Pontuação da Análise</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Solidez da Argumentação</span>
                        <span className="text-sm font-bold text-primary">
                          {analise.pontuacao.solidezArgumentacao.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${analise.pontuacao.solidezArgumentacao * 10}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Probabilidade de Sucesso</span>
                        <span className="text-sm font-bold text-green-600">
                          {analise.pontuacao.probabilidadeSucesso}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${analise.pontuacao.probabilidadeSucesso}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Riscos Identificados</span>
                        <span className="text-sm font-bold text-destructive">
                          {analise.pontuacao.riscosIdentificados}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fundamentos */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Fundamentos Principais
                </h3>
                <ul className="space-y-3">
                  {analise.fundamentos.map((fundamento: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="flex-1 pt-1">{fundamento}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pontos Relevantes */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Pontos Relevantes
                </h3>
                <ul className="space-y-2">
                  {analise.pontosRelevantes.map((ponto: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <p>{ponto}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recomendações Estratégicas */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  Recomendações Estratégicas
                </h3>
                <ul className="space-y-2">
                  {analise.recomendacoes.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">💡</span>
                      <p>{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Precedentes Relacionados */}
              {analise.precedentesRelacionados && (
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Precedentes Relacionados</h3>
                  <ul className="space-y-2">
                    {analise.precedentesRelacionados.map((prec: string, index: number) => (
                      <li key={index} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{prec}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags Identificadas */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Tags Identificadas pela IA</h3>
                <div className="flex flex-wrap gap-2">
                  {analise.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/30 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {analisando ? 'Análise em andamento...' : 'Análise concluída'}
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => window.print()}
              variant="outline"
            >
              Imprimir Análise
            </Button>
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
