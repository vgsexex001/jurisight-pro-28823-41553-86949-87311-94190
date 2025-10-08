import OpenAI from 'openai';
import { getOpenAIService } from './openaiService';

export interface PredictionData {
  tipoAcao: string;
  tribunal: string;
  valor: number;
  descricao: string;
}

export interface PredictionResult {
  probabilidade: number;
  tempo: number;
  valor: number;
  recomendacoes: string[];
  precedentes: string[];
  avisoMock?: string;
}

function getOpenAIClient(): OpenAI | null {
  try {
    const integracoes = localStorage.getItem('integracoes');
    if (integracoes) {
      const parsed = JSON.parse(integracoes);
      const openaiIntegracao = parsed.find((i: any) => i.id === 'openai');
      if (openaiIntegracao && openaiIntegracao.apiKey && openaiIntegracao.apiKey.startsWith('sk-')) {
        return new OpenAI({ 
          apiKey: openaiIntegracao.apiKey,
          dangerouslyAllowBrowser: true 
        });
      }
    }
  } catch (error) {
    console.error('Erro ao obter cliente OpenAI:', error);
  }
  
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (envKey && envKey.startsWith('sk-')) {
    return new OpenAI({ 
      apiKey: envKey,
      dangerouslyAllowBrowser: true 
    });
  }
  
  return null;
}

export class PredictionService {
  async calcularPrevisao(dados: PredictionData): Promise<PredictionResult> {
    const openai = getOpenAIClient();
    
    // Verificar se OpenAI está configurada
    if (!openai) {
      console.warn('⚠️ OpenAI não configurada - usando previsão simulada');
      return this.gerarPrevisaoMock(dados);
    }

    try {
      console.log('🤖 Calculando previsão REAL com OpenAI...');
      
      const prompt = `Você é um especialista em análise preditiva jurídica brasileira. Analise este caso e forneça uma previsão detalhada.

DADOS DO CASO:
- Tipo de Ação: ${dados.tipoAcao}
- Tribunal: ${dados.tribunal}
- Valor da Causa: ${dados.valor ? `R$ ${dados.valor.toLocaleString('pt-BR')}` : 'Não informado'}
- Descrição: ${dados.descricao}

Forneça a análise em JSON com esta estrutura:
{
  "probabilidade": número de 0 a 100 (chance de sucesso),
  "tempo": número de dias estimados até decisão final,
  "valor": valor provável da condenação em reais,
  "recomendacoes": ["recomendação 1", "recomendação 2", "recomendação 3"],
  "precedentes": ["precedente 1", "precedente 2", "precedente 3"]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em análise preditiva jurídica. Responda APENAS com JSON válido, sem texto adicional.' 
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 1000
      });

      const resultadoTexto = response.choices[0].message.content;
      if (!resultadoTexto) {
        throw new Error('Resposta vazia da OpenAI');
      }

      const resultado = JSON.parse(resultadoTexto);
      console.log('✅ Previsão REAL calculada com sucesso');
      
      return {
        probabilidade: resultado.probabilidade || 70,
        tempo: resultado.tempo || 365,
        valor: resultado.valor || dados.valor * 0.7,
        recomendacoes: resultado.recomendacoes || [],
        precedentes: resultado.precedentes || []
      };

    } catch (error: any) {
      console.error('❌ Erro ao calcular previsão real:', error);
      return this.gerarPrevisaoMock(dados);
    }
  }

  private gerarPrevisaoMock(dados: PredictionData): PredictionResult {
    // Previsão simulada baseada nos dados
    const probabilidadeBase = dados.tipoAcao === 'Trabalhista' ? 75 : 
                              dados.tipoAcao === 'Cível' ? 60 : 
                              dados.tipoAcao === 'Previdenciário' ? 70 : 65;
    
    const tempoBase = dados.tribunal.includes('TST') || dados.tribunal.includes('STJ') ? 730 : 365;
    
    const valorProvavel = dados.valor > 0 ? dados.valor * 0.7 : 50000;

    return {
      probabilidade: probabilidadeBase,
      tempo: tempoBase,
      valor: valorProvavel,
      recomendacoes: [
        'Documentar todas as provas e evidências disponíveis',
        'Analisar jurisprudência recente do tribunal',
        'Considerar acordo extrajudicial para reduzir custos',
        'Preparar argumentação sólida baseada em precedentes'
      ],
      precedentes: [
        `${dados.tribunal} - Decisão similar favorável em caso análogo`,
        'Súmula relevante do tribunal superior aplicável',
        'Precedente vinculante sobre a matéria específica'
      ],
      avisoMock: '⚠️ Esta é uma previsão simulada. Configure a OpenAI nas Integrações para previsões reais com IA.'
    };
  }
}

export const predictionService = new PredictionService();
