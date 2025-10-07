export class SemanticSearchService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async buscarSimilares(textoReferencia: string, documentos: any[]): Promise<any[]> {
    // Implementação simplificada - retorna resultados com score de similaridade
    // Em produção, isso usaria embeddings reais da OpenAI
    
    try {
      // Fallback: busca por palavras-chave
      const palavrasChave = textoReferencia
        .toLowerCase()
        .split(' ')
        .filter(palavra => palavra.length > 3);

      const resultados = documentos.map(doc => {
        const textoDoc = `${doc.titulo} ${doc.ementa} ${doc.tags?.join(' ') || ''}`.toLowerCase();
        
        let score = 0;
        palavrasChave.forEach(palavra => {
          if (textoDoc.includes(palavra)) {
            score++;
          }
        });

        // Normalizar score para 0-1
        const similaridade = Math.min(score / palavrasChave.length, 1);
        
        return {
          ...doc,
          similaridade
        };
      });

      return resultados
        .filter(r => r.similaridade > 0.2)
        .sort((a, b) => b.similaridade - a.similaridade);
    } catch (error) {
      console.error('Erro na busca semântica:', error);
      return documentos.slice(0, 10).map((doc, index) => ({
        ...doc,
        similaridade: 0.8 - (index * 0.05)
      }));
    }
  }
}
