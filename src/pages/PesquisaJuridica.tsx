import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import VoiceSearch from '@/components/VoiceSearch';
import FiltrosAvancados, { Filtros } from '@/components/FiltrosAvancados';
import ResultadoBusca from '@/components/ResultadoBusca';
import { resultadosMock } from '@/data/resultadosMock';
import { useToast } from '@/hooks/use-toast';

export default function PesquisaJuridica() {
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState('tudo');
  const [resultados, setResultados] = useState(resultadosMock);
  const [resultadosFiltrados, setResultadosFiltrados] = useState(resultadosMock);
  const [buscando, setBuscando] = useState(false);
  const [usarBuscaSemantica, setUsarBuscaSemantica] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const { toast } = useToast();
  const resultadosPorPagina = 10;

  const [filtros, setFiltros] = useState<Filtros>({
    tribunal: [],
    area: [],
    tipoDocumento: [],
    periodo: 'todos',
    dataInicio: undefined,
    dataFim: undefined
  });

  const sugestoesPopulares = [
    'horas extras banco de horas',
    'dano moral trabalho remoto',
    'rescisão indireta covid-19',
    'súmula 443 STJ',
    'reforma trabalhista terceirização'
  ];

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setBuscando(true);
    
    try {
      let resultadosBusca = [...resultadosMock];

      if (searchQuery.trim()) {
        const termos = searchQuery.toLowerCase().split(' ');
        resultadosBusca = resultadosMock.filter(r =>
          termos.some(termo =>
            r.titulo.toLowerCase().includes(termo) ||
            r.ementa.toLowerCase().includes(termo) ||
            r.tags.some(tag => tag.toLowerCase().includes(termo))
          )
        );
      }

      setResultados(resultadosBusca);
      aplicarFiltros(resultadosBusca);
      
      toast({
        title: "Busca concluída",
        description: `${resultadosBusca.length} resultado(s) encontrado(s)`,
      });
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar documentos",
        variant: "destructive",
      });
    } finally {
      setBuscando(false);
    }
  };

  const aplicarFiltros = (resultadosBase = resultados) => {
    let filtrado = [...resultadosBase];

    if (categoria !== 'tudo') {
      filtrado = filtrado.filter(r => r.tipo === categoria);
    }

    if (filtros.tribunal.length > 0) {
      filtrado = filtrado.filter(r => r.tribunal && filtros.tribunal.includes(r.tribunal));
    }

    if (filtros.area.length > 0) {
      filtrado = filtrado.filter(r => filtros.area.includes(r.area));
    }

    if (filtros.tipoDocumento.length > 0) {
      filtrado = filtrado.filter(r => filtros.tipoDocumento.some(tipo => tipo.toLowerCase() === r.tipo));
    }

    setResultadosFiltrados(filtrado);
    setPaginaAtual(1);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, categoria]);

  const limparFiltros = () => {
    setFiltros({
      tribunal: [],
      area: [],
      tipoDocumento: [],
      periodo: 'todos',
      dataInicio: undefined,
      dataFim: undefined
    });
  };

  const handleAnalisarIA = (id: string) => {
    toast({
      title: "Análise com IA",
      description: `Iniciando análise do documento ${id}...`,
    });
  };

  const handleCasosSimilares = (id: string) => {
    toast({
      title: "Casos Similares",
      description: `Buscando casos similares a ${id}...`,
    });
  };

  const indiceUltimo = paginaAtual * resultadosPorPagina;
  const indicePrimeiro = indiceUltimo - resultadosPorPagina;
  const resultadosAtuais = resultadosFiltrados.slice(indicePrimeiro, indiceUltimo);
  const totalPaginas = Math.ceil(resultadosFiltrados.length / resultadosPorPagina);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Pesquisa Jurídica</h1>
      <p className="text-muted-foreground mb-6">Busca inteligente em milhões de documentos jurídicos</p>

      {/* Barra de busca */}
      <div className="bg-card rounded-lg shadow-lg p-6 mb-6 border border-border">
        <SearchBar onSearch={handleSearch} />

        <div className="flex gap-2 mt-4 mb-4 flex-wrap">
          <Button
            onClick={() => setUsarBuscaSemantica(!usarBuscaSemantica)}
            variant={usarBuscaSemantica ? "default" : "outline"}
            className={usarBuscaSemantica ? "" : "border-purple-600 text-purple-600 hover:bg-purple-50"}
          >
            <Brain className="w-4 h-4 mr-2" />
            Busca Semântica (IA)
          </Button>
          <VoiceSearch onResult={handleSearch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select className="px-3 py-2 border rounded-lg bg-background">
            <option>Tribunal</option>
            <option>STF</option>
            <option>STJ</option>
            <option>TST</option>
          </select>
          
          <select className="px-3 py-2 border rounded-lg bg-background">
            <option>Área do Direito</option>
            <option>Trabalhista</option>
            <option>Cível</option>
          </select>
          
          <select className="px-3 py-2 border rounded-lg bg-background">
            <option>Tipo de Documento</option>
            <option>Acórdão</option>
            <option>Súmula</option>
          </select>
          
          <select className="px-3 py-2 border rounded-lg bg-background">
            <option>Período</option>
            <option>Último mês</option>
            <option>Último ano</option>
          </select>
          
          <FiltrosAvancados
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onLimpar={limparFiltros}
          />
        </div>
      </div>

      {!query && (
        <div className="bg-accent/50 border border-border rounded-lg p-4 mb-6">
          <p className="text-sm font-medium mb-2">💡 Sugestões populares:</p>
          <div className="flex flex-wrap gap-2">
            {sugestoesPopulares.map(sugestao => (
              <button
                key={sugestao}
                onClick={() => handleSearch(sugestao)}
                className="px-3 py-1 bg-card hover:bg-accent border border-border rounded-full text-sm transition-colors"
              >
                {sugestao}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['tudo', 'jurisprudencia', 'legislacao', 'sumula', 'doutrina'].map(cat => (
          <Button
            key={cat}
            onClick={() => setCategoria(cat)}
            variant={categoria === cat ? 'default' : 'outline'}
            className="whitespace-nowrap"
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {query && (
        <div className="mb-4 text-muted-foreground">
          {buscando ? (
            'Buscando...'
          ) : (
            `${resultadosFiltrados.length} resultado(s) encontrado(s) para "${query}"`
          )}
        </div>
      )}

      <div className="space-y-4 mb-8">
        {buscando ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Buscando documentos...</p>
          </div>
        ) : resultadosAtuais.length > 0 ? (
          resultadosAtuais.map(resultado => (
            <ResultadoBusca
              key={resultado.id}
              resultado={resultado}
              onAnalisarIA={handleAnalisarIA}
              onCasosSimilares={handleCasosSimilares}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-lg shadow border border-border">
            <p className="text-lg">Nenhum resultado encontrado</p>
            <p className="text-muted-foreground mt-2">Tente ajustar os filtros ou termos de busca</p>
          </div>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
            disabled={paginaAtual === 1}
            variant="outline"
          >
            Anterior
          </Button>
          
          {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
            const pagina = i + 1;
            return (
              <Button
                key={pagina}
                onClick={() => setPaginaAtual(pagina)}
                variant={paginaAtual === pagina ? 'default' : 'outline'}
              >
                {pagina}
              </Button>
            );
          })}
          
          {totalPaginas > 5 && <span>...</span>}
          
          <Button
            onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
            disabled={paginaAtual === totalPaginas}
            variant="outline"
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
