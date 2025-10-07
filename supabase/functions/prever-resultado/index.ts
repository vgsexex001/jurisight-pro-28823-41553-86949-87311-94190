import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tipoAcao, tribunal, valor, descricao } = await req.json();

    if (!tipoAcao || !tribunal || !descricao) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos para previsão' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Chamar Lovable AI (Gemini) para análise preditiva
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurado');
    }

    const prompt = `Você é um especialista em análise preditiva jurídica. Com base nos dados abaixo, faça uma previsão do resultado do processo em formato JSON:

DADOS DO PROCESSO:
- Tipo de Ação: ${tipoAcao}
- Tribunal: ${tribunal}
- Valor da Causa: R$ ${valor.toLocaleString('pt-BR')}
- Descrição: ${descricao}

Forneça a previsão no seguinte formato JSON:

{
  "probabilidade": <número de 0 a 100 representando % de sucesso>,
  "tempo": <número de dias estimados de tramitação>,
  "valor": <valor estimado de condenação em reais>,
  "recomendacoes": [
    "recomendação estratégica 1",
    "recomendação estratégica 2",
    "recomendação estratégica 3"
  ],
  "precedentes": [
    "precedente similar 1",
    "precedente similar 2"
  ]
}

INSTRUÇÕES:
- probabilidade: baseie-se em estatísticas típicas desse tipo de ação nesse tribunal
- tempo: tempo médio de tramitação considerando o tribunal e complexidade
- valor: estimativa realista de condenação (pode ser menor que o valor da causa)
- recomendacoes: 3 sugestões estratégicas acionáveis
- precedentes: casos similares relevantes (se aplicável)

Seja realista e baseie-se em dados estatísticos do judiciário brasileiro.

Responda APENAS com o JSON válido, sem texto adicional.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Erro da API Lovable AI:', aiResponse.status, errorText);
      throw new Error(`Erro na API de IA: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Tentar extrair JSON da resposta
    let previsao;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      previsao = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      console.error('Erro ao parsear JSON:', e);
      console.error('Resposta recebida:', content);
      
      // Fallback com previsão básica
      previsao = {
        probabilidade: 65,
        tempo: 180,
        valor: valor * 0.7,
        recomendacoes: [
          'Reunir documentação completa',
          'Considerar acordo judicial',
          'Avaliar recursos disponíveis'
        ],
        precedentes: []
      };
    }

    console.log('Previsão concluída:', previsao);

    return new Response(
      JSON.stringify(previsao),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro no processamento:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
