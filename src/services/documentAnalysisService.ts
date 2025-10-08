import OpenAI from 'openai';

export interface DocumentAnalysisResult {
  resultado: string;
  valor: number;
  probabilidadeReforma: string;
  fundamentos: string[];
  pontosRelevantes: string[];
  tags: string[];
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

export class DocumentAnalysisService {
  async analisarTexto(texto: string): Promise<DocumentAnalysisResult> {
    const openai = getOpenAIClient();
    
    if (!openai) {
      console.warn('⚠️ OpenAI não configurada - usando análise simulada');
      return this.gerarAnaliseMock(texto);
    }

    try {
      console.log('🤖 Analisando documento REAL com OpenAI...');
      
      const prompt = `Você é um especialista em análise jurídica brasileira. Analise este documento jurídico e forneça uma análise completa.

DOCUMENTO:
${texto.substring(0, 4000)}

Forneça a análise em JSON com esta estrutura:
{
  "resultado": "Procedente" | "Improcedente" | "Parcial",
  "valor": número em reais da condenação (0 se improcedente),
  "probabilidadeReforma": "Baixa" | "Média" | "Alta",
  "fundamentos": ["fundamento 1", "fundamento 2", "fundamento 3"],
  "pontosRelevantes": ["ponto 1", "ponto 2", "ponto 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em análise jurídica. Responda APENAS com JSON válido, sem texto adicional.' 
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 1500
      });

      const resultadoTexto = response.choices[0].message.content;
      if (!resultadoTexto) {
        throw new Error('Resposta vazia da OpenAI');
      }

      const resultado = JSON.parse(resultadoTexto);
      console.log('✅ Análise REAL concluída com sucesso');
      
      return {
        resultado: resultado.resultado || 'Parcial',
        valor: resultado.valor || 0,
        probabilidadeReforma: resultado.probabilidadeReforma || 'Média',
        fundamentos: resultado.fundamentos || [],
        pontosRelevantes: resultado.pontosRelevantes || [],
        tags: resultado.tags || []
      };

    } catch (error: any) {
      console.error('❌ Erro ao analisar documento real:', error);
      return this.gerarAnaliseMock(texto);
    }
  }

  private gerarAnaliseMock(texto: string): DocumentAnalysisResult {
    const textoLower = texto.toLowerCase();
    
    const ehTrabalhista = textoLower.includes('trabalh') || textoLower.includes('clt');
    const ehHorasExtras = textoLower.includes('hora') && textoLower.includes('extra');
    const ehDanoMoral = textoLower.includes('dano') && textoLower.includes('moral');

    let resultado: 'Procedente' | 'Improcedente' | 'Parcial' = 'Parcial';
    if (ehTrabalhista && (ehHorasExtras || ehDanoMoral)) {
      resultado = 'Procedente';
    } else if (textoLower.includes('improcedente') || textoLower.includes('negar')) {
      resultado = 'Improcedente';
    }

    const valor = resultado === 'Procedente' ? (ehHorasExtras ? 75000 : 50000) :
                  resultado === 'Parcial' ? 25000 : 0;

    return {
      resultado,
      valor,
      probabilidadeReforma: resultado === 'Procedente' ? 'Baixa' : 
                            resultado === 'Parcial' ? 'Média' : 'Alta',
      fundamentos: [
        'Análise dos fatos apresentados nos autos',
        'Aplicação da jurisprudência consolidada',
        'Princípios constitucionais aplicáveis',
        'Precedentes vinculantes do tribunal'
      ],
      pontosRelevantes: [
        'Precedente importante para casos similares',
        'Decisão alinhada com jurisprudência dominante',
        'Fundamentação técnica adequada',
        'Impacto significativo para orientação futura'
      ],
      tags: ehTrabalhista ? 
        ['direito do trabalho', 'CLT', 'jurisprudência', 'TST'] :
        ['análise jurídica', 'jurisprudência', 'precedente', 'decisão judicial'],
      avisoMock: '⚠️ Esta é uma análise simulada. Configure a OpenAI nas Integrações para análises reais com IA.'
    };
  }
}

export const documentAnalysisService = new DocumentAnalysisService();
