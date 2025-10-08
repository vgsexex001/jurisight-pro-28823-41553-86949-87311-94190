import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Share2, Download, Eye, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ModalInteiroTeor from './ModalInteiroTeor';
import ModalCasosSimilares from './ModalCasosSimilares';
import ModalAnaliseIA from './ModalAnaliseIA';

export interface Resultado {
  id: string;
  tipo: 'jurisprudencia' | 'legislacao' | 'sumula' | 'doutrina';
  tribunal?: string;
  numero?: string;
  titulo: string;
  ementa: string;
  relator?: string;
  data: string;
  visualizacoes: number;
  area: string;
  tags: string[];
}

interface ResultadoBuscaProps {
  resultado: Resultado;
  onAnalisarIA: (id: string) => void;
  onCasosSimilares: (id: string) => void;
}

export default function ResultadoBusca({ resultado, onAnalisarIA, onCasosSimilares }: ResultadoBuscaProps) {
  const [favoritado, setFavoritado] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const [modalInteiroTeor, setModalInteiroTeor] = useState(false);
  const [modalCasosSimilares, setModalCasosSimilares] = useState(false);
  const [modalAnaliseIA, setModalAnaliseIA] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setFavoritado(favoritos.includes(resultado.id));
  }, [resultado.id]);

  const toggleFavorito = () => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    if (favoritado) {
      const novosFavoritos = favoritos.filter((id: string) => id !== resultado.id);
      localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
      toast({
        title: "Removido dos favoritos",
        description: "Documento removido da sua lista",
      });
    } else {
      favoritos.push(resultado.id);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      toast({
        title: "Adicionado aos favoritos",
        description: "Documento salvo na sua lista",
      });
    }
    
    setFavoritado(!favoritado);
  };

  const compartilhar = async () => {
    const url = window.location.href + '/' + resultado.id;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: resultado.titulo,
          text: resultado.ementa.substring(0, 200) + '...',
          url: url
        });
        toast({
          title: "Compartilhado com sucesso",
        });
      } catch (error) {
        // Usuário cancelou
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência",
      });
    }
  };

  const download = () => {
    toast({
      title: "Download iniciado",
      description: "O documento será baixado em instantes",
    });
  };

  const variantPorTipo: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    jurisprudencia: "destructive",
    legislacao: "default",
    sumula: "secondary",
    doutrina: "outline"
  };

  const labelPorTipo = {
    jurisprudencia: resultado.tribunal || 'Jurisprudência',
    legislacao: 'Legislação',
    sumula: 'Súmula',
    doutrina: 'Doutrina'
  };

  return (
    <div className="bg-card rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={variantPorTipo[resultado.tipo]}>
              {labelPorTipo[resultado.tipo]}
            </Badge>
            <Badge variant="outline">
              {resultado.area}
            </Badge>
            <span className="text-sm text-muted-foreground">{resultado.data}</span>
          </div>
          
          <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer">
            {resultado.numero && `${resultado.numero} - `}{resultado.titulo}
          </h3>
          
          <p className={`text-muted-foreground mb-3 ${expandido ? '' : 'line-clamp-3'}`}>
            {resultado.ementa}
          </p>
          
          {resultado.ementa.length > 200 && (
            <button
              onClick={() => setExpandido(!expandido)}
              className="text-primary hover:text-primary/80 text-sm font-medium mb-3"
            >
              {expandido ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
            {resultado.relator && (
              <>
                <span>Relator: {resultado.relator}</span>
                <span>•</span>
              </>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {resultado.visualizacoes.toLocaleString('pt-BR')} visualizações
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {resultado.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Botões laterais */}
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={toggleFavorito}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {favoritado ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <Bookmark className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={compartilhar}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Compartilhar"
          >
            <Share2 className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={download}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Baixar documento"
          >
            <Download className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
      
      {/* Botões de ação */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setModalInteiroTeor(true)}>
          Ver Inteiro Teor
        </Button>
        <Button
          onClick={() => setModalCasosSimilares(true)}
          variant="outline"
        >
          Casos Similares
        </Button>
        <Button
          onClick={() => setModalAnaliseIA(true)}
          variant="outline"
          className="border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          <Brain className="w-4 h-4 mr-2" />
          Analisar com IA
        </Button>
      </div>

      {/* Modais */}
      {modalInteiroTeor && (
        <ModalInteiroTeor 
          resultado={resultado} 
          onClose={() => setModalInteiroTeor(false)} 
        />
      )}
      
      {modalCasosSimilares && (
        <ModalCasosSimilares
          resultado={resultado}
          onClose={() => setModalCasosSimilares(false)}
          onVerDetalhes={(novoResultado) => {
            setModalCasosSimilares(false);
            setModalInteiroTeor(true);
          }}
        />
      )}
      
      {modalAnaliseIA && (
        <ModalAnaliseIA 
          resultado={resultado} 
          onClose={() => setModalAnaliseIA(false)} 
        />
      )}
    </div>
  );
}
