import { useState } from 'react';
import { Brain, Zap, TrendingUp, Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AnalysisResult {
  resultado: string;
  valor: number;
  probabilidadeReforma: string;
  fundamentos: string[];
  pontosRelevantes: string[];
  tags: string[];
}

export default function AIAnalysis() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [analisando, setAnalisando] = useState(false);
  const [resultado, setResultado] = useState<AnalysisResult | null>(null);
  const [textoManual, setTextoManual] = useState('');
  const [modoTexto, setModoTexto] = useState(false);

  const analisarDocumento = async () => {
    if (!arquivo && !textoManual.trim()) {
      toast({
        title: 'Atenção',
        description: 'Faça upload de um documento ou cole o texto para análise',
        variant: 'destructive'
      });
      return;
    }
    
    setAnalisando(true);
    
    try {
      const formData = new FormData();
      if (arquivo) {
        formData.append('file', arquivo);
      } else {
        formData.append('texto', textoManual);
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analisar-documento`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Erro ao analisar documento');
      }
      
      const data = await response.json();
      setResultado(data);
      
      toast({
        title: 'Análise concluída',
        description: 'Documento analisado com sucesso pela IA',
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível analisar o documento',
        variant: 'destructive'
      });
    } finally {
      setAnalisando(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 10MB',
          variant: 'destructive'
        });
        return;
      }
      setArquivo(file);
      setModoTexto(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Análise com IA</h1>
          <p className="text-muted-foreground">Análise inteligente de documentos jurídicos usando Gemini</p>
        </div>
      </div>

      {/* Toggle Modo */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setModoTexto(false)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !modoTexto ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload de Arquivo
        </button>
        <button
          onClick={() => setModoTexto(true)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            modoTexto ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Colar Texto
        </button>
      </div>

      {/* Upload de Documento */}
      <div className="bg-card rounded-lg shadow-md border p-6 mb-6">
        <h3 className="font-semibold mb-4">
          {modoTexto ? 'Cole o Texto da Sentença' : 'Upload de Documento'}
        </h3>
        
        {!modoTexto ? (
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Arraste um documento ou clique para selecionar</p>
            <p className="text-sm text-muted-foreground mb-4">PDF, DOCX, TXT (máx. 10MB)</p>
            
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Selecionar Arquivo
            </label>
            
            {arquivo && (
              <div className="mt-4 p-3 bg-muted rounded-lg inline-block">
                <p className="text-sm font-medium">📄 {arquivo.name}</p>
                <p className="text-xs text-muted-foreground">{(arquivo.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
          </div>
        ) : (
          <textarea
            value={textoManual}
            onChange={(e) => setTextoManual(e.target.value)}
            placeholder="Cole aqui o texto da sentença, acórdão ou documento jurídico para análise..."
            className="w-full h-64 px-4 py-3 border rounded-lg bg-background resize-none"
          />
        )}

        {(arquivo || textoManual.trim()) && (
          <button
            onClick={analisarDocumento}
            disabled={analisando}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            {analisando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analisando com IA Gemini...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Analisar com IA (Gemini 2.5 Flash)
              </>
            )}
          </button>
        )}
      </div>

      {/* Resultados da Análise */}
      {resultado && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Card de Resultado Principal */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Resultado da Análise
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-muted-foreground mb-1">Resultado</p>
                <p className="text-2xl font-bold text-green-600">{resultado.resultado}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-muted-foreground mb-1">Valor da Condenação</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.valor)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-muted-foreground mb-1">Prob. de Reforma</p>
                <p className="text-2xl font-bold text-orange-600">{resultado.probabilidadeReforma}</p>
              </div>
            </div>
          </div>

          {/* Fundamentos */}
          <div className="bg-card rounded-lg shadow-md border p-6">
            <h3 className="font-semibold text-lg mb-4">Fundamentos da Decisão</h3>
            <ul className="space-y-3">
              {resultado.fundamentos.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pontos Relevantes */}
          <div className="bg-card rounded-lg shadow-md border p-6">
            <h3 className="font-semibold text-lg mb-4">Pontos Relevantes</h3>
            <div className="space-y-3">
              {resultado.pontosRelevantes.map((p, i) => (
                <div key={i} className="p-3 bg-muted rounded-lg">
                  <p className="text-foreground">{p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card rounded-lg shadow-md border p-6">
            <h3 className="font-semibold text-lg mb-4">Tags Identificadas</h3>
            <div className="flex flex-wrap gap-2">
              {resultado.tags.map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Botão de Salvar */}
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-colors">
            Salvar Análise no Banco de Dados
          </button>
        </div>
      )}
    </div>
  );
}
