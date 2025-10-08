import { useState } from 'react';
import { Calculator, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { predictionService, PredictionData, PredictionResult } from '@/services/predictionService';

export default function PredictionCalculator() {
  const [dados, setDados] = useState<PredictionData>({
    tipoAcao: '',
    tribunal: '',
    valor: 0,
    descricao: ''
  });
  const [previsao, setPrevisao] = useState<PredictionResult | null>(null);
  const [calculando, setCalculando] = useState(false);

  const calcularPrevisao = async () => {
    if (!dados.tipoAcao || !dados.tribunal || !dados.descricao) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para calcular a previsão',
        variant: 'destructive'
      });
      return;
    }

    setCalculando(true);
    
    try {
      const resultado = await predictionService.calcularPrevisao(dados);
      setPrevisao(resultado);
      
      toast({
        title: 'Previsão calculada',
        description: resultado.avisoMock ? 'Usando análise simulada' : 'Análise preditiva concluída com sucesso',
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível calcular a previsão',
        variant: 'destructive'
      });
    } finally {
      setCalculando(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md border p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary" />
        Calculadora de Previsão com IA
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Ação *</label>
          <select
            value={dados.tipoAcao}
            onChange={(e) => setDados({...dados, tipoAcao: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg bg-background"
          >
            <option value="">Selecione</option>
            <option value="Trabalhista">Trabalhista</option>
            <option value="Cível">Cível</option>
            <option value="Criminal">Criminal</option>
            <option value="Tributário">Tributário</option>
            <option value="Previdenciário">Previdenciário</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tribunal *</label>
          <select
            value={dados.tribunal}
            onChange={(e) => setDados({...dados, tribunal: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg bg-background"
          >
            <option value="">Selecione</option>
            <option value="TJSP">TJSP - Tribunal de Justiça de SP</option>
            <option value="TRT 2ª">TRT 2ª Região</option>
            <option value="TRT 15ª">TRT 15ª Região</option>
            <option value="STJ">STJ - Superior Tribunal de Justiça</option>
            <option value="TST">TST - Tribunal Superior do Trabalho</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Valor da Causa (R$)</label>
          <input
            type="number"
            value={dados.valor || ''}
            onChange={(e) => setDados({...dados, valor: Number(e.target.value)})}
            className="w-full px-3 py-2 border rounded-lg bg-background"
            placeholder="0,00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição do Caso *</label>
          <textarea
            value={dados.descricao}
            onChange={(e) => setDados({...dados, descricao: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg bg-background h-32 resize-none"
            placeholder="Descreva brevemente o caso: partes envolvidas, pedidos, contexto..."
          />
        </div>

        <button
          onClick={calcularPrevisao}
          disabled={calculando}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          {calculando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Calculando com IA...
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              Calcular Previsão com IA (Gemini)
            </>
          )}
        </button>
      </div>

      {/* Resultado da Previsão */}
      {previsao && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {previsao.avisoMock && (
            <div className="mb-4 bg-yellow-500/10 border-l-4 border-yellow-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">{previsao.avisoMock}</p>
              </div>
            </div>
          )}
          <h4 className="font-semibold text-lg mb-4">Resultado da Previsão</h4>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Prob. de Sucesso</p>
              <p className="text-2xl font-bold text-green-600">{previsao.probabilidade}%</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Tempo Estimado</p>
              <p className="text-2xl font-bold text-blue-600">{previsao.tempo} dias</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Valor Provável</p>
              <p className="text-xl font-bold text-purple-600">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(previsao.valor)}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Recomendações Estratégicas:</p>
            <ul className="space-y-1.5">
              {previsao.recomendacoes.map((r, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {previsao.precedentes && previsao.precedentes.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Precedentes Similares:</p>
              <ul className="space-y-1.5">
                {previsao.precedentes.map((p, i) => (
                  <li key={i} className="text-xs text-muted-foreground bg-white rounded px-2 py-1.5">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
