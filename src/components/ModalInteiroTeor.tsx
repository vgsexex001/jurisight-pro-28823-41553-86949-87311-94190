import { useState } from 'react';
import { X, Download, Printer, Copy, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Resultado {
  id: string;
  tipo: string;
  tribunal?: string;
  numero?: string;
  titulo: string;
  ementa: string;
  relator?: string;
  data: string;
  visualizacoes?: number;
  area: string;
  tags: string[];
}

interface ModalInteiroTeorProps {
  resultado: Resultado;
  onClose: () => void;
}

export default function ModalInteiroTeor({ resultado, onClose }: ModalInteiroTeorProps) {
  const [zoom, setZoom] = useState(100);
  const { toast } = useToast();
  
  // Gerar texto completo simulado
  const textoCompleto = `
TRIBUNAL: ${resultado.tribunal || 'TST'}
PROCESSO Nº: ${resultado.numero}
${resultado.titulo}

RELATÓRIO

${resultado.ementa}

O Excelentíssimo Ministro ${resultado.relator} (Relator), proferiu voto no sentido de conhecer do recurso e, no mérito, dar-lhe provimento para reformar a decisão recorrida.

EMENTA

${resultado.ementa}

ACÓRDÃO

Vistos, relatados e discutidos estes autos em que são partes as acima indicadas, acordam os Ministros da Subseção I Especializada em Dissídios Individuais do Tribunal Superior do Trabalho, por unanimidade, conhecer do recurso e, no mérito, dar-lhe provimento para reformar a decisão recorrida, nos termos do voto do Ministro Relator.

FUNDAMENTAÇÃO

I - CONHECIMENTO

Preenchidos os pressupostos de admissibilidade, conheço do recurso de revista.

II - MÉRITO

A Constituição Federal de 1988, em seu artigo 7º, inciso XIII, assegura o direito à duração do trabalho normal não superior a oito horas diárias e quarenta e quatro semanais, facultada a compensação de horários e a redução da jornada, mediante acordo ou convenção coletiva de trabalho.

No caso dos autos, verifica-se que o reclamante laborava em jornada extraordinária habitual, sem a devida contraprestação pecuniária ou compensação de jornada devidamente implementada.

A jurisprudência desta Corte Superior é no sentido de que o banco de horas deve ser implementado por meio de negociação coletiva, conforme previsto no art. 59, §2º, da CLT.

Os elementos probatórios demonstram a existência de trabalho em sobrejornada de forma habitual e sistemática, sem a devida compensação ou pagamento das horas excedentes.

A Súmula 437 do TST estabelece que o intervalo intrajornada de no mínimo 1 hora para jornadas superiores a 6 horas é obrigatório, e sua não concessão ou concessão parcial implica o pagamento total do período correspondente, e não apenas daquele suprimido, com acréscimo de no mínimo 50% sobre o valor da remuneração da hora normal de trabalho.

CONCLUSÃO

Ante o exposto, ACORDAM os Ministros da Subseção I Especializada em Dissídios Individuais do Tribunal Superior do Trabalho, por unanimidade, conhecer do recurso de revista e, no mérito, dar-lhe provimento para condenar a reclamada ao pagamento das horas extras laboradas, com reflexos em férias, 13º salário, FGTS e aviso prévio, bem como o pagamento integral do intervalo intrajornada suprimido.

Brasília, ${resultado.data}

${resultado.relator}
Ministro Relator
`.trim();

  const copiarTexto = () => {
    navigator.clipboard.writeText(textoCompleto);
    toast({
      title: "Texto copiado!",
      description: "O texto foi copiado para a área de transferência",
    });
  };

  const baixarPDF = () => {
    toast({
      title: "Download iniciado",
      description: "O documento PDF será baixado em instantes",
    });
  };

  const imprimir = () => {
    window.print();
  };

  const compartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resultado.titulo,
          text: textoCompleto.substring(0, 200),
          url: window.location.href
        });
      } catch (error) {
        // Usuário cancelou
      }
    } else {
      copiarTexto();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-lg max-w-5xl w-full h-[90vh] flex flex-col shadow-lg border animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-muted/50">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Inteiro Teor</h2>
            <p className="text-sm text-muted-foreground">{resultado.numero}</p>
          </div>
          
          {/* Botões de ação */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Diminuir zoom"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium px-2">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-border mx-2" />
            <button
              onClick={copiarTexto}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Copiar texto"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={baixarPDF}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Baixar PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={imprimir}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Imprimir"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={compartilhar}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-border mx-2" />
            <button
              onClick={onClose}
              className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
          <div 
            className="bg-card shadow-lg rounded-lg p-12 max-w-4xl mx-auto border"
            style={{ fontSize: `${zoom}%` }}
          >
            <pre className="whitespace-pre-wrap font-serif text-foreground leading-relaxed">
              {textoCompleto}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/50 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {textoCompleto.split('\n').length} linhas • {textoCompleto.length} caracteres
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
