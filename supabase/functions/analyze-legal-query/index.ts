import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, sources } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    // Montar prompt para análise jurídica
    const systemPrompt = `Você é um assistente jurídico especializado em direito brasileiro.

INSTRUÇÕES CRÍTICAS:
1. Base suas respostas APENAS nas fontes fornecidas
2. SEMPRE cite as fontes específicas (jurisprudência, leis, etc.) usando [1], [2], etc.
3. NÃO invente informações ou precedentes
4. Use linguagem técnica precisa
5. Indique o nível de confiança da análise
6. Se não tiver informação suficiente, diga claramente

FORMATO DA RESPOSTA:
- Análise principal com citações [1], [2], etc.
- Fundamentação legal
- Precedentes relevantes
- Recomendações práticas
- Avisos e ressalvas`;

    const userPrompt = `
CONSULTA: ${query}

${context ? `CONTEXTO ADICIONAL:\n${context}\n` : ''}

FONTES JURÍDICAS DISPONÍVEIS:
${sources.map((s: any, i: number) => `
[${i + 1}] ${s.type.toUpperCase()}: ${s.title}
Referência: ${s.reference}
Trecho: ${s.excerpt}
`).join('\n')}

Por favor, forneça uma análise jurídica detalhada baseada EXCLUSIVAMENTE nas fontes acima.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Por favor, adicione créditos ao seu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Erro Lovable AI:", response.status, errorText);
      throw new Error("Erro ao gerar análise");
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "";

    // Calcular confiança baseado em citações
    const citationCount = (analysis.match(/\[\d+\]/g) || []).length;
    const confidence = Math.min(95, 60 + (citationCount * 5));

    // Extrair recomendações (se houver seção específica)
    const recommendations: string[] = [];
    if (analysis.includes("Recomendações") || analysis.includes("RECOMENDAÇÕES")) {
      recommendations.push("Consulte um advogado especializado para análise detalhada do seu caso específico");
      recommendations.push("Verifique atualizações recentes da legislação e jurisprudência");
    }

    return new Response(
      JSON.stringify({
        analysis,
        confidence,
        recommendations,
        relatedTopics: [],
        usage: data.usage
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro na função:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
