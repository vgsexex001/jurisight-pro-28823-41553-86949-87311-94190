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
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const texto = formData.get('texto') as string;
    
    let textoParaAnalise = texto;
    
    // Se houver arquivo, extrair texto (simplificado - em produção usar biblioteca de PDF)
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      textoParaAnalise = decoder.decode(arrayBuffer);
    }

    if (!textoParaAnalise || textoParaAnalise.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Texto muito curto para análise' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Chamar Lovable AI (Gemini)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurado');
    }

    const prompt = `Você é um especialista em análise jurídica. Analise a sentença judicial abaixo e extraia as seguintes informações em formato JSON:

{
  "resultado": "Procedente | Improcedente | Parcialmente Procedente",
  "valor": <número em reais, 0 se não houver condenação>,
  "probabilidadeReforma": "Baixa | Média | Alta",
  "fundamentos": ["fundamento 1", "fundamento 2", "fundamento 3"],
  "pontosRelevantes": ["ponto 1", "ponto 2", "ponto 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

INSTRUÇÕES:
- resultado: analise se o pedido foi totalmente aceito, negado ou parcial
- valor: extraia o valor exato da condenação em reais
- probabilidadeReforma: avalie chances de reversão em recurso
- fundamentos: principais argumentos do juiz (máximo 3)
- pontosRelevantes: aspectos importantes da decisão (máximo 3)
- tags: 5 palavras-chave principais

SENTENÇA:
${textoParaAnalise.substring(0, 8000)}

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
        temperature: 0.3,
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
    let analise;
    try {
      // Remover markdown se houver
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analise = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      console.error('Erro ao parsear JSON:', e);
      console.error('Resposta recebida:', content);
      
      // Fallback com análise básica
      analise = {
        resultado: 'Não identificado',
        valor: 0,
        probabilidadeReforma: 'Média',
        fundamentos: ['Análise completa não disponível'],
        pontosRelevantes: ['Documento processado com sucesso'],
        tags: ['juridico', 'sentenca', 'analise']
      };
    }

    console.log('Análise concluída:', analise);

    return new Response(
      JSON.stringify(analise),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro no processamento:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        details: 'Verifique os logs para mais informações'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
