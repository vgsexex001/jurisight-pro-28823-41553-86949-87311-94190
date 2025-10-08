import { useState, useEffect } from 'react';
import { X, Brain, TrendingUp, AlertTriangle, CheckCircle, FileText, Zap, Download, Printer, Award, AlertCircle, Bookmark } from 'lucide-react';
import { getOpenAIService } from '@/services/openaiService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Resultado, Analise } from '@/types/resultado';

interface ModalAnaliseIAProps {
  resultado: Resultado;
  onClose: () => void;
}

export default function ModalAnaliseIA({ resultado, onClose }: ModalAnaliseIAProps) {
  const [analisando, setAnalisando] = useState(true);
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [progresso, setProgresso] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    realizarAnalise();
  }, []);

  const realizarAnalise = async () => {
    setAnalisando(true);
    setErro(null);
    setProgresso(0);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgresso(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const openaiService = getOpenAIService();
      
      // Realizar análise
      const resultadoAnalise = await openaiService.analisarDocumentoJuridico(resultado);
      
      clearInterval(progressInterval);
      setProgresso(100);
      
      // Aguardar animação completar
      setTimeout(() => {
        setAnalise(resultadoAnalise);
        setAnalisando(false);
      }, 500);

    } catch (error: any) {
      console.error('Erro na análise:', error);
      setErro(error.message || 'Erro ao realizar análise');
      setAnalisando(false);
    }
  };

  const salvarAnalise = () => {
    if (!analise) return;
    
    const analiseSalvas = JSON.parse(localStorage.getItem('analises') || '[]');
    analiseSalvas.push({
      ...analise,
      dataSalvamento: new Date().toISOString()
    });
    localStorage.setItem('analises', JSON.stringify(analiseSalvas));
    
    toast({
      title: "Análise salva com sucesso!",
      description: "A análise foi adicionada aos seus favoritos.",
    });
  };

  const exportarPDF = () => {
    toast({
      title: "Exportando para PDF",
      description: "Funcionalidade será implementada em breve!",
    });
  };

  const imprimir = () => {
    window.print();
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
      <div className="bg-card rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col shadow-lg border animate-in zoom-in-95 duration-200">
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
              <div className="relative mb-6">
                <div className="w-24 h-24 border-8 border-primary/20 rounded-full" />
                <div 
                  className="absolute top-0 left-0 w-24 h-24 border-8 border-primary rounded-full transition-all duration-300"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${progresso > 12.5 ? '100%' : '50%'} 0%, ${progresso > 37.5 ? '100%' : progresso > 12.5 ? '100%' : '50%'} ${progresso > 12.5 ? Math.min((progresso - 12.5) * 4, 100) : 0}%, ${progresso > 62.5 ? '0%' : progresso > 37.5 ? 100 - (progresso - 37.5) * 4 : '100%'}% ${progresso > 37.5 ? '100%' : progresso > 12.5 ? '100%' : '0%'}%, ${progresso > 87.5 ? '0%' : '0%'} ${progresso > 62.5 ? 100 - (progresso - 62.5) * 4 : progresso > 37.5 ? '100%' : '0%'}%, 0% ${progresso > 87.5 ? (progresso - 87.5) * 8 : '0%'}%)`,
                  }}
                />
                <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary animate-pulse" />
              </div>
              
              <div className="text-center max-w-md">
                <p className="text-foreground text-xl font-semibold mb-2">
                  Analisando documento com IA...
                </p>
                <p className="text-muted-foreground mb-4">
                  {progresso < 30 ? '🔍 Lendo e processando documento...' :
                   progresso < 60 ? '🤖 Aplicando análise jurídica avançada...' :
                   progresso < 90 ? '📊 Gerando insights estratégicos...' :
                   '✅ Finalizando análise completa...'}
                </p>
                
                <div className="w-full bg-secondary rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{progresso}% concluído</p>
              </div>
            </div>
          ) : erro ? (
            <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-semibold text-lg mb-2">Erro na análise</p>
              <p className="text-destructive/80 mb-4">{erro}</p>
              <Button onClick={realizarAnalise} variant="destructive">
                Tentar Novamente
              </Button>
            </div>
          ) : analise ? (
            <div className="space-y-6">
              {/* Aviso se for mock */}
              {analise.avisoMock && (
                <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-900 font-medium">Análise Simulada</p>
                      <p className="text-yellow-800 text-sm mt-1">{analise.avisoMock}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resumo Executivo */}
              {analise.resumoExecutivo && (
                <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Resumo Executivo
                  </h3>
                  <p className="text-foreground leading-relaxed">{analise.resumoExecutivo}</p>
                </div>
              )}

              {/* Cards principais */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-500/20 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Resultado da Análise
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg p-5 text-center border shadow-sm">
                    <p className="text-sm text-muted-foreground mb-2">Resultado</p>
                    <p className={`text-3xl font-bold ${getResultadoColor(analise.resultado)}`}>
                      {analise.resultado}
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-5 text-center border shadow-sm">
                    <p className="text-sm text-muted-foreground mb-2">Valor da Condenação</p>
                    <p className="text-xl font-bold text-primary break-words">
                      {analise.valorCondenacao || 'Não informado'}
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-5 text-center border shadow-sm">
                    <p className="text-sm text-muted-foreground mb-2">Risco de Reforma</p>
                    <p className={`text-3xl font-bold ${getRiscoColor(analise.probabilidadeReforma)}`}>
                      {analise.probabilidadeReforma}
                    </p>
                  </div>
                </div>

                {analise.justificativaReforma && (
                  <div className="mt-4 p-4 bg-card rounded-lg border shadow-sm">
                    <p className="text-sm text-foreground">
                      <strong className="font-semibold">Justificativa:</strong> {analise.justificativaReforma}
                    </p>
                  </div>
                )}
              </div>

              {/* Pontuação da Análise */}
              {analise.pontuacao && (
                <div className="bg-card border-2 border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Pontuação da Análise
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Solidez da Argumentação</span>
                        <span className="text-sm font-bold text-primary">
                          {analise.pontuacao.solidezArgumentacao.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${analise.pontuacao.solidezArgumentacao * 10}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Probabilidade de Sucesso</span>
                        <span className="text-sm font-bold text-green-600">
                          {analise.pontuacao.probabilidadeSucesso}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${analise.pontuacao.probabilidadeSucesso}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Riscos Identificados</span>
                        <span className="text-sm font-bold text-orange-600">
                          {analise.pontuacao.riscosIdentificados}/10
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${analise.pontuacao.riscosIdentificados * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fundamentos */}
              {analise.fundamentos && analise.fundamentos.length > 0 && (
                <div className="bg-card border-2 border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Fundamentos Principais
                  </h3>
                  <ul className="space-y-3">
                    {analise.fundamentos.map((fundamento: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                        <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-foreground flex-1 pt-1">{fundamento}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pontos Relevantes */}
              {analise.pontosRelevantes && analise.pontosRelevantes.length > 0 && (
                <div className="bg-card border-2 border-green-500/20 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Pontos Relevantes
                  </h3>
                  <ul className="space-y-2">
                    {analise.pontosRelevantes.map((ponto: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 p-3 hover:bg-green-500/5 rounded-lg transition-colors">
                        <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                        <p className="text-foreground">{ponto}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recomendações Estratégicas */}
              {analise.recomendacoes && analise.recomendacoes.length > 0 && (
                <div className="bg-yellow-500/10 border-2 border-yellow-500/20 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Recomendações Estratégicas
                  </h3>
                  <ul className="space-y-3">
                    {analise.recomendacoes.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg shadow-sm hover:shadow transition-shadow">
                        <span className="text-2xl flex-shrink-0">💡</span>
                        <p className="text-foreground flex-1">{rec}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Precedentes Relacionados */}
              {analise.precedentesRelacionados && analise.precedentesRelacionados.length > 0 && (
                <div className="bg-card border-2 border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Precedentes Relacionados</h3>
                  <ul className="space-y-2">
                    {analise.precedentesRelacionados.map((prec: string, index: number) => (
                      <li key={index} className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                        <p className="text-sm text-foreground font-mono">{prec}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Análise Detalhada */}
              {analise.analiseDetalhada && (
                <div className="bg-card border-2 border-purple-500/20 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Análise Detalhada
                  </h3>
                  
                  {analise.analiseDetalhada.contextoProcessual && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Contexto Processual:</h4>
                      <p className="text-muted-foreground leading-relaxed">{analise.analiseDetalhada.contextoProcessual}</p>
                    </div>
                  )}

                  {analise.analiseDetalhada.tesesDefesa && analise.analiseDetalhada.tesesDefesa.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Teses de Defesa:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {analise.analiseDetalhada.tesesDefesa.map((tese: string, i: number) => (
                          <li key={i}>{tese}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analise.analiseDetalhada.tesesAcusacao && analise.analiseDetalhada.tesesAcusacao.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Teses de Acusação:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {analise.analiseDetalhada.tesesAcusacao.map((tese: string, i: number) => (
                          <li key={i}>{tese}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analise.analiseDetalhada.jurisprudenciaAplicavel && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Jurisprudência Aplicável:</h4>
                      <p className="text-muted-foreground leading-relaxed">{analise.analiseDetalhada.jurisprudenciaAplicavel}</p>
                    </div>
                  )}

                  {analise.analiseDetalhada.impactosPraticos && (
                    <div>
                      <h4 className="font-medium mb-2">Impactos Práticos:</h4>
                      <p className="text-muted-foreground leading-relaxed">{analise.analiseDetalhada.impactosPraticos}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tags Identificadas */}
              {analise.tags && analise.tags.length > 0 && (
                <div className="bg-card border-2 border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Tags Identificadas pela IA</h3>
                  <div className="flex flex-wrap gap-2">
                    {analise.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-200 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-700 hover:shadow-md transition-shadow"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/30 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {analisando ? `Análise em andamento... ${progresso}%` : 
             erro ? 'Erro na análise' :
             `✅ Análise concluída em ${new Date().toLocaleTimeString('pt-BR')}`}
          </p>
          <div className="flex flex-wrap gap-2">
            {analise && !analisando && !erro && (
              <>
                <Button
                  onClick={salvarAnalise}
                  variant="outline"
                  size="sm"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  onClick={exportarPDF}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button
                  onClick={imprimir}
                  variant="outline"
                  size="sm"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </>
            )}
            <Button onClick={onClose} size="sm">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
