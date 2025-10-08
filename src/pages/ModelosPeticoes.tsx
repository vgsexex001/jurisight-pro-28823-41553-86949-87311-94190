import { FileText, Download, Search, Eye, Star } from 'lucide-react';
import { modelos } from '@/data/juridicalData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import TemplatePreviewModal from '@/components/TemplatePreviewModal';
import { templateDownloadService, type DownloadFormat } from '@/services/templateDownloadService';
import { toast } from '@/hooks/use-toast';

export default function ModelosPeticoes() {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof modelos[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const modelosFiltrados = useMemo(() => {
    return modelos.filter(modelo => {
      const matchBusca = !busca || 
        modelo.nome.toLowerCase().includes(busca.toLowerCase()) ||
        modelo.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        modelo.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()));
      
      const matchCategoria = !categoriaFiltro || modelo.categoria === categoriaFiltro;
      
      return matchBusca && matchCategoria;
    });
  }, [busca, categoriaFiltro]);

  const categorias = useMemo(() => [...new Set(modelos.map(m => m.categoria))], []);

  const handlePreview = (modelo: typeof modelos[0]) => {
    setSelectedTemplate(modelo);
    setIsPreviewOpen(true);
  };

  const handleDownload = (templateId: number, format: DownloadFormat) => {
    const template = modelos.find(m => m.id === templateId);
    if (template) {
      templateDownloadService.downloadTemplate(templateId, template.nome, format);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Modelos de Petições</h1>
      <p className="text-muted-foreground mb-6">Biblioteca com centenas de modelos prontos para uso</p>

      {/* Barra de busca e filtros */}
      <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar modelos..."
            className="pl-12"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={categoriaFiltro === '' ? 'default' : 'outline'}
            onClick={() => setCategoriaFiltro('')}
          >
            Todos
          </Button>
          {categorias.map(categoria => (
            <Button
              key={categoria}
              variant={categoriaFiltro === categoria ? 'default' : 'outline'}
              onClick={() => setCategoriaFiltro(categoria)}
            >
              {categoria}
            </Button>
          ))}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg shadow p-4">
          <p className="text-sm text-muted-foreground">Total de Modelos</p>
          <p className="text-2xl font-bold">{modelos.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow p-4">
          <p className="text-sm text-muted-foreground">Categorias</p>
          <p className="text-2xl font-bold">{categorias.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow p-4">
          <p className="text-sm text-muted-foreground">Downloads Este Mês</p>
          <p className="text-2xl font-bold">
            {modelos.reduce((acc, m) => acc + m.downloads, 0).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow p-4">
          <p className="text-sm text-muted-foreground">Novos Esta Semana</p>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      {/* Grid de modelos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modelosFiltrados.map(modelo => (
          <div key={modelo.id} className="bg-card rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="flex items-start justify-between mb-3">
              <FileText className="w-10 h-10 text-primary" />
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                {modelo.categoria}
              </span>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{modelo.nome}</h3>
            
            <span className="px-2 py-1 bg-muted text-xs rounded mb-2 inline-block">
              {modelo.subcategoria}
            </span>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {modelo.descricao}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {modelo.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 bg-muted text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {modelo.downloads} downloads
              </span>
              <span>{modelo.paginas} páginas</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => handlePreview(modelo)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleDownload(modelo.id, 'docx')}
                title="Download rápido DOCX"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {modelosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum modelo encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou a busca
          </p>
        </div>
      )}

      {/* Modal de Preview */}
      <TemplatePreviewModal
        template={selectedTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  );
}
