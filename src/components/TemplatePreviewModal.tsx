import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut, Download, FileText, Printer, Share2, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Template {
  id: number;
  nome: string;
  categoria: string;
  subcategoria: string;
  descricao: string;
  downloads: number;
  tags: string[];
  paginas: number;
  ultimaAtualizacao?: string;
  conteudo?: string;
}

interface TemplatePreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (templateId: number, format: 'txt' | 'docx' | 'pdf') => void;
}

// Conteúdo mock de petição
const CONTEUDO_PETICAO_MOCK = `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DO TRABALHO DA ___ VARA DO TRABALHO DE [CIDADE]/[UF]

[NOME DO RECLAMANTE], [nacionalidade], [estado civil], [profissão], portador(a) do RG nº [número] e inscrito(a) no CPF sob o nº [número], residente e domiciliado(a) na [endereço completo], por intermédio de seu advogado infra-assinado (procuração anexa, doc. 01), com escritório profissional situado na [endereço do advogado], onde recebe intimações, vem, respeitosamente, perante Vossa Excelência, com fundamento nos arts. 7º, I, da Constituição Federal e arts. 477 e seguintes da CLT, propor a presente

RECLAMAÇÃO TRABALHISTA

em face de [NOME DA EMPRESA RECLAMADA], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [número], com sede na [endereço completo], pelos fatos e fundamentos jurídicos a seguir aduzidos:

I - DOS FATOS

O(A) Reclamante foi admitido(a) nos quadros da empresa Reclamada em [data de admissão], exercendo a função de [cargo/função], mediante remuneração mensal de R$ [valor].

Durante todo o período contratual, o(a) Reclamante laborou em condições que violaram diversos direitos trabalhistas assegurados pela legislação vigente, conforme será demonstrado a seguir.

[Descrever aqui os fatos relevantes da relação de trabalho, incluindo jornada, condições de trabalho, eventuais irregularidades, etc.]

Em [data da dispensa/rescisão], o(a) Reclamante foi dispensado(a) sem justa causa, não tendo a empresa Reclamada quitado todas as verbas rescisórias devidas.

II - DO DIREITO

1. DO VÍNCULO EMPREGATÍCIO

Restou configurado o vínculo empregatício entre as partes, nos termos dos artigos 2º e 3º da CLT, estando presentes todos os requisitos caracterizadores da relação de emprego: pessoalidade, onerosidade, não eventualidade e subordinação jurídica.

2. DAS HORAS EXTRAS

[Fundamentação sobre horas extras, se aplicável]

A Constituição Federal, em seu art. 7º, XVI, assegura o direito à remuneração do serviço extraordinário superior, no mínimo, em cinquenta por cento à do normal.

3. DO ADICIONAL NOTURNO

[Fundamentação sobre adicional noturno, se aplicável]

Nos termos do art. 73 da CLT, o trabalho noturno urbano deve ser remunerado com adicional de, no mínimo, 20% sobre a hora diurna.

4. DAS VERBAS RESCISÓRIAS

[Fundamentação sobre verbas rescisórias]

Conforme dispõe o art. 477 da CLT, a homologação da rescisão do contrato de trabalho deve ser realizada perante o sindicato ou autoridade competente, sob pena de nulidade.

III - DOS PEDIDOS

Diante do exposto, requer:

a) A citação da Reclamada para, querendo, contestar a presente ação, sob pena de revelia e confissão quanto à matéria de fato;

b) A condenação da Reclamada ao pagamento das seguintes verbas:
   - Horas extras e reflexos: R$ [valor]
   - Adicional noturno e reflexos: R$ [valor]
   - Diferenças salariais: R$ [valor]
   - Verbas rescisórias: R$ [valor]
   - [Outras verbas]

c) A condenação da Reclamada ao pagamento de indenização por danos morais no valor de R$ [valor];

d) A condenação da Reclamada ao pagamento de honorários advocatícios de sucumbência;

e) A concessão dos benefícios da justiça gratuita, por ser o(a) Reclamante hipossuficiente econômico(a);

f) A produção de todos os meios de prova em direito admitidos, especialmente prova documental, testemunhal e pericial.

Dá-se à causa o valor de R$ [valor total].

Termos em que,
Pede deferimento.

[Cidade], [dia] de [mês] de [ano].

_________________________________
[Nome do Advogado]
OAB/[UF] nº [número]`;

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onDownload
}: TemplatePreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && template) {
      // Registrar view
      trackView(template.id);
    }
  }, [isOpen, template]);

  useEffect(() => {
    if (!isOpen) {
      setZoom(100);
      setCopied(false);
    }
  }, [isOpen]);

  const trackView = (templateId: number) => {
    // Incrementar visualizações no localStorage
    const views = JSON.parse(localStorage.getItem('template_views') || '{}');
    views[templateId] = (views[templateId] || 0) + 1;
    localStorage.setItem('template_views', JSON.stringify(views));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTEUDO_PETICAO_MOCK);
      setCopied(true);
      toast({
        title: 'Copiado!',
        description: 'Conteúdo copiado para a área de transferência',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o conteúdo',
        variant: 'destructive',
      });
    }
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: 'Imprimindo',
      description: 'Abrindo diálogo de impressão...',
    });
  };

  const handleShare = async () => {
    if (navigator.share && template) {
      try {
        await navigator.share({
          title: template.nome,
          text: template.descricao,
          url: window.location.href,
        });
      } catch (error) {
        // Usuário cancelou ou não suportado
      }
    } else {
      // Fallback: copiar link
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copiado!',
        description: 'Link do modelo copiado para compartilhar',
      });
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 flex flex-col">
        {/* Header Fixo */}
        <div className="flex items-start justify-between p-6 border-b bg-white sticky top-0 z-10">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold mb-1">{template.nome}</h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                  {template.categoria}
                </span>
                <span>•</span>
                <span>{template.subcategoria}</span>
              </span>
              <span>•</span>
              <span>{template.paginas} páginas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Controles de Zoom */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(z => Math.max(50, z - 10))}
                disabled={zoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-2 min-w-[3rem] text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(z => Math.min(200, z + 10))}
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Toolbar de Ações */}
        <div className="px-6 py-3 border-b bg-muted/30 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </Button>

          <div className="flex-1" />

          <span className="text-xs text-muted-foreground">
            {template.downloads.toLocaleString('pt-BR')} downloads
          </span>
        </div>

        {/* Área de Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
            <pre
              className="whitespace-pre-wrap font-serif leading-relaxed text-gray-900"
              style={{ fontSize: `${zoom}%` }}
            >
              {CONTEUDO_PETICAO_MOCK}
            </pre>
          </div>
        </div>

        {/* Footer Fixo com Botões de Download */}
        <div className="p-6 border-t bg-white sticky bottom-0">
          <div className="flex gap-3">
            <Button
              onClick={() => {
                onDownload(template.id, 'txt');
                onClose();
              }}
              variant="outline"
              className="flex-1 gap-2"
            >
              <FileText className="w-5 h-5" />
              <span>Baixar TXT</span>
            </Button>

            <Button
              onClick={() => {
                onDownload(template.id, 'docx');
                onClose();
              }}
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-5 h-5" />
              <span>Baixar DOCX</span>
            </Button>

            <Button
              onClick={() => {
                onDownload(template.id, 'pdf');
                onClose();
              }}
              variant="outline"
              className="flex-1 gap-2 border-red-600 text-red-600 hover:bg-red-50"
            >
              <FileText className="w-5 h-5" />
              <span>Baixar PDF</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Os modelos são fornecidos como base. Sempre revise e adapte ao seu caso concreto.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
