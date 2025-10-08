import { toast } from '@/hooks/use-toast';

export type DownloadFormat = 'txt' | 'docx' | 'pdf';

interface DownloadOptions {
  format: DownloadFormat;
  templateId: number;
  templateName: string;
  content: string;
}

// Conteúdo de exemplo para petição
const getTemplateContent = (templateId: number): string => {
  return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DO TRABALHO DA ___ VARA DO TRABALHO DE [CIDADE]/[UF]

[NOME DO RECLAMANTE], [nacionalidade], [estado civil], [profissão], portador(a) do RG nº [número] e inscrito(a) no CPF sob o nº [número], residente e domiciliado(a) na [endereço completo], por intermédio de seu advogado infra-assinado (procuração anexa, doc. 01), com escritório profissional situado na [endereço do advogado], onde recebe intimações, vem, respeitosamente, perante Vossa Excelência, com fundamento nos arts. 7º, I, da Constituição Federal e arts. 477 e seguintes da CLT, propor a presente

RECLAMAÇÃO TRABALHISTA

em face de [NOME DA EMPRESA RECLAMADA], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [número], com sede na [endereço completo], pelos fatos e fundamentos jurídicos a seguir aduzidos:

I - DOS FATOS

O(A) Reclamante foi admitido(a) nos quadros da empresa Reclamada em [data de admissão], exercendo a função de [cargo/função], mediante remuneração mensal de R$ [valor].

Durante todo o período contratual, o(a) Reclamante laborou em condições que violaram diversos direitos trabalhistas assegurados pela legislação vigente.

Em [data da dispensa/rescisão], o(a) Reclamante foi dispensado(a) sem justa causa.

II - DO DIREITO

1. DO VÍNCULO EMPREGATÍCIO
Restou configurado o vínculo empregatício entre as partes, nos termos dos artigos 2º e 3º da CLT.

2. DAS HORAS EXTRAS
A Constituição Federal, em seu art. 7º, XVI, assegura o direito à remuneração do serviço extraordinário superior.

3. DAS VERBAS RESCISÓRIAS
Conforme dispõe o art. 477 da CLT, todas as verbas devem ser quitadas.

III - DOS PEDIDOS

Diante do exposto, requer:

a) A citação da Reclamada para, querendo, contestar a presente ação;
b) A condenação da Reclamada ao pagamento das verbas trabalhistas;
c) A concessão dos benefícios da justiça gratuita;
d) A produção de todos os meios de prova em direito admitidos.

Termos em que, Pede deferimento.

[Cidade], [dia] de [mês] de [ano].

_________________________________
[Nome do Advogado]
OAB/[UF] nº [número]`;
};

class TemplateDownloadService {
  /**
   * Rastreia o download no localStorage
   */
  private trackDownload(templateId: number, format: DownloadFormat): void {
    try {
      const downloads = JSON.parse(localStorage.getItem('template_downloads') || '{}');
      const key = `${templateId}`;
      
      if (!downloads[key]) {
        downloads[key] = { count: 0, formats: {}, lastDownload: null };
      }
      
      downloads[key].count++;
      downloads[key].formats[format] = (downloads[key].formats[format] || 0) + 1;
      downloads[key].lastDownload = new Date().toISOString();
      
      localStorage.setItem('template_downloads', JSON.stringify(downloads));
    } catch (error) {
      console.error('Erro ao rastrear download:', error);
    }
  }

  /**
   * Incrementa contador de downloads do modelo
   */
  private incrementDownloadCount(templateId: number): void {
    try {
      const counters = JSON.parse(localStorage.getItem('template_counters') || '{}');
      counters[templateId] = (counters[templateId] || 0) + 1;
      localStorage.setItem('template_counters', JSON.stringify(counters));
    } catch (error) {
      console.error('Erro ao incrementar contador:', error);
    }
  }

  /**
   * Gera arquivo TXT
   */
  private generateTxt(content: string): Blob {
    return new Blob([content], { type: 'text/plain;charset=utf-8' });
  }

  /**
   * Gera arquivo DOCX (simulado - em produção usar biblioteca docx)
   */
  private generateDocx(content: string): Blob {
    // Em produção, usar biblioteca 'docx' para gerar arquivo real
    // Por ora, gerando um HTML que o Word pode abrir
    const html = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset='utf-8'>
        <title>Petição</title>
      </head>
      <body>
        <pre style="font-family: 'Times New Roman', serif; font-size: 12pt; white-space: pre-wrap;">
${content}
        </pre>
      </body>
      </html>
    `;
    
    return new Blob([html], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
  }

  /**
   * Gera arquivo PDF (simulado - em produção usar jsPDF)
   */
  private generatePdf(content: string): Blob {
    // Em produção, usar jsPDF para gerar PDF real
    // Por ora, retornando HTML que pode ser convertido
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='utf-8'>
        <title>Petição</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            font-size: 12pt; 
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        </style>
      </head>
      <body>
        <pre>${content}</pre>
      </body>
      </html>
    `;
    
    return new Blob([html], { type: 'application/pdf' });
  }

  /**
   * Trigger download no navegador
   */
  private triggerBrowserDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Sanitiza nome do arquivo
   */
  private sanitizeFilename(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Método principal de download
   */
  async downloadTemplate(
    templateId: number,
    templateName: string,
    format: DownloadFormat
  ): Promise<void> {
    try {
      // 1. Obter conteúdo
      const content = getTemplateContent(templateId);

      // 2. Gerar arquivo no formato solicitado
      let blob: Blob;
      let extension: string;

      switch (format) {
        case 'txt':
          blob = this.generateTxt(content);
          extension = 'txt';
          break;
        case 'docx':
          blob = this.generateDocx(content);
          extension = 'docx';
          break;
        case 'pdf':
          blob = this.generatePdf(content);
          extension = 'pdf';
          break;
        default:
          throw new Error('Formato não suportado');
      }

      // 3. Criar nome do arquivo
      const sanitizedName = this.sanitizeFilename(templateName);
      const filename = `${sanitizedName}.${extension}`;

      // 4. Trigger download
      this.triggerBrowserDownload(blob, filename);

      // 5. Rastrear analytics
      this.trackDownload(templateId, format);
      this.incrementDownloadCount(templateId);

      // 6. Notificar sucesso
      toast({
        title: 'Download iniciado!',
        description: `Modelo baixado em formato ${format.toUpperCase()}`,
      });

    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast({
        title: 'Erro no download',
        description: 'Não foi possível baixar o modelo. Tente novamente.',
        variant: 'destructive',
      });
    }
  }

  /**
   * Obter estatísticas de downloads de um modelo
   */
  getDownloadStats(templateId: number): {
    totalDownloads: number;
    byFormat: Record<DownloadFormat, number>;
    lastDownload: string | null;
  } {
    try {
      const downloads = JSON.parse(localStorage.getItem('template_downloads') || '{}');
      const stats = downloads[templateId] || { count: 0, formats: {}, lastDownload: null };
      
      return {
        totalDownloads: stats.count,
        byFormat: stats.formats,
        lastDownload: stats.lastDownload,
      };
    } catch (error) {
      return {
        totalDownloads: 0,
        byFormat: { txt: 0, docx: 0, pdf: 0 },
        lastDownload: null,
      };
    }
  }

  /**
   * Obter histórico de downloads do usuário
   */
  getUserDownloadHistory(): Array<{
    templateId: number;
    totalDownloads: number;
    lastDownload: string;
  }> {
    try {
      const downloads = JSON.parse(localStorage.getItem('template_downloads') || '{}');
      
      return Object.entries(downloads)
        .map(([id, data]: [string, any]) => ({
          templateId: parseInt(id),
          totalDownloads: data.count,
          lastDownload: data.lastDownload,
        }))
        .sort((a, b) => {
          const dateA = new Date(a.lastDownload).getTime();
          const dateB = new Date(b.lastDownload).getTime();
          return dateB - dateA;
        });
    } catch (error) {
      return [];
    }
  }
}

export const templateDownloadService = new TemplateDownloadService();
