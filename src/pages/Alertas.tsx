import { useState, useEffect, useMemo } from 'react';
import { Bell, FileText, Scale, BookOpen, File, Search, Check, Archive, Eye, EyeOff } from 'lucide-react';
import { alertasMock, AlertaJuridico, formatarTimestamp } from '@/data/alertasData';

type TipoAlerta = 'todos' | 'sumula' | 'precedente' | 'legislacao' | 'doutrina' | 'modelo';

export default function Alertas() {
  const [alertas, setAlertas] = useState<AlertaJuridico[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoAlerta>('todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroRelevancia, setFiltroRelevancia] = useState<string>('todas');
  const [filtroArea, setFiltroArea] = useState<string>('todas');
  const [mostrarArquivados, setMostrarArquivados] = useState(false);

  useEffect(() => {
    const salvo = localStorage.getItem('alertas');
    if (salvo) {
      try {
        setAlertas(JSON.parse(salvo));
      } catch (error) {
        console.error('Erro ao carregar alertas:', error);
        setAlertas(alertasMock);
      }
    } else {
      setAlertas(alertasMock);
    }
  }, []);

  useEffect(() => {
    if (alertas.length > 0) {
      localStorage.setItem('alertas', JSON.stringify(alertas));
    }
  }, [alertas]);

  const marcarComoLido = (id: string) => {
    setAlertas(prev => prev.map(alerta =>
      alerta.id === id ? { ...alerta, lido: true } : alerta
    ));
  };

  const marcarComoNaoLido = (id: string) => {
    setAlertas(prev => prev.map(alerta =>
      alerta.id === id ? { ...alerta, lido: false } : alerta
    ));
  };

  const arquivar = (id: string) => {
    setAlertas(prev => prev.map(alerta =>
      alerta.id === id ? { ...alerta, arquivado: true } : alerta
    ));
  };

  const desarquivar = (id: string) => {
    setAlertas(prev => prev.map(alerta =>
      alerta.id === id ? { ...alerta, arquivado: false } : alerta
    ));
  };

  const marcarTodosComoLidos = () => {
    const confirmar = window.confirm('Marcar todos os alertas como lidos?');
    if (confirmar) {
      setAlertas(prev => prev.map(alerta => ({ ...alerta, lido: true })));
    }
  };

  const alertasFiltrados = useMemo(() => {
    return alertas.filter(alerta => {
      if (!mostrarArquivados && alerta.arquivado) return false;
      if (mostrarArquivados && !alerta.arquivado) return false;
      if (tipoSelecionado !== 'todos' && alerta.tipo !== tipoSelecionado) return false;
      if (termoBusca) {
        const busca = termoBusca.toLowerCase();
        const match = 
          alerta.titulo.toLowerCase().includes(busca) ||
          alerta.descricao.toLowerCase().includes(busca) ||
          alerta.area.toLowerCase().includes(busca) ||
          (alerta.numeroReferencia?.toLowerCase().includes(busca));
        if (!match) return false;
      }
      if (filtroRelevancia !== 'todas' && alerta.relevancia !== filtroRelevancia) return false;
      if (filtroArea !== 'todas' && alerta.area !== filtroArea) return false;
      return true;
    });
  }, [alertas, tipoSelecionado, termoBusca, filtroRelevancia, filtroArea, mostrarArquivados]);

  const stats = useMemo(() => {
    const agora = new Date();
    const umaSemanaAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      total: alertas.filter(a => !a.arquivado).length,
      naoLidos: alertas.filter(a => !a.lido && !a.arquivado).length,
      altaRelevancia: alertas.filter(a => a.relevancia === 'alta' && !a.arquivado).length,
      estaSemana: alertas.filter(a => {
        const data = new Date(a.dataPublicacao);
        return data >= umaSemanaAtras && !a.arquivado;
      }).length
    };
  }, [alertas]);

  const tabs = [
    { id: 'todos', label: 'Todos', icon: Bell },
    { id: 'sumula', label: 'Súmulas', icon: FileText },
    { id: 'precedente', label: 'Precedentes', icon: Scale },
    { id: 'legislacao', label: 'Legislação', icon: BookOpen },
    { id: 'doutrina', label: 'Doutrinas', icon: BookOpen },
    { id: 'modelo', label: 'Modelos', icon: File }
  ];

  const getCorRelevancia = (relevancia: string) => {
    switch (relevancia) {
      case 'alta': return 'text-red-600 bg-red-100 border-red-200';
      case 'media': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'baixa': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCorTipo = (tipo: string) => {
    switch (tipo) {
      case 'sumula': return 'bg-purple-100 text-purple-800';
      case 'precedente': return 'bg-blue-100 text-blue-800';
      case 'legislacao': return 'bg-green-100 text-green-800';
      case 'doutrina': return 'bg-yellow-100 text-yellow-800';
      case 'modelo': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabelTipo = (tipo: string) => {
    switch (tipo) {
      case 'sumula': return 'Súmula';
      case 'precedente': return 'Precedente';
      case 'legislacao': return 'Legislação';
      case 'doutrina': return 'Doutrina';
      case 'modelo': return 'Modelo';
      default: return tipo;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Alertas Jurídicos</h1>
        <p className="text-muted-foreground">Acompanhe as últimas atualizações do mundo jurídico</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const count = tab.id === 'todos' 
            ? stats.total 
            : alertas.filter(a => a.tipo === tab.id && !a.arquivado).length;

          return (
            <button
              key={tab.id}
              onClick={() => setTipoSelecionado(tab.id as TipoAlerta)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                tipoSelecionado === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:bg-accent text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {count > 0 && (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  tipoSelecionado === tab.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-sm text-muted-foreground mb-1">Total de Alertas</p>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-sm text-muted-foreground mb-1">Não Lidos</p>
          <p className="text-4xl font-bold text-red-600">{stats.naoLidos}</p>
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-sm text-muted-foreground mb-1">Alta Relevância</p>
          <p className="text-4xl font-bold text-orange-600">{stats.altaRelevancia}</p>
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-sm text-muted-foreground mb-1">Esta Semana</p>
          <p className="text-4xl font-bold text-blue-600">{stats.estaSemana}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar alertas..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <select
            value={filtroRelevancia}
            onChange={(e) => setFiltroRelevancia(e.target.value)}
            className="px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring"
          >
            <option value="todas">Todas Relevâncias</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <select
            value={filtroArea}
            onChange={(e) => setFiltroArea(e.target.value)}
            className="px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring"
          >
            <option value="todas">Todas Áreas</option>
            <option value="Trabalhista">Trabalhista</option>
            <option value="Cível">Cível</option>
            <option value="Criminal">Criminal</option>
            <option value="Tributário">Tributário</option>
            <option value="Constitucional">Constitucional</option>
            <option value="Previdenciário">Previdenciário</option>
            <option value="Consumidor">Consumidor</option>
          </select>

          <button
            onClick={() => setMostrarArquivados(!mostrarArquivados)}
            className={`px-4 py-2 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
              mostrarArquivados
                ? 'bg-secondary text-secondary-foreground border-secondary'
                : 'border-input hover:bg-accent'
            }`}
          >
            <Archive className="w-4 h-4" />
            {mostrarArquivados ? 'Ver Ativos' : 'Ver Arquivados'}
          </button>
        </div>

        {stats.naoLidos > 0 && !mostrarArquivados && (
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={marcarTodosComoLidos}
              className="px-4 py-2 text-primary hover:bg-accent rounded-lg flex items-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              Marcar todos como lidos ({stats.naoLidos})
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {alertasFiltrados.length > 0 ? (
          alertasFiltrados.map(alerta => (
            <div
              key={alerta.id}
              className={`rounded-lg shadow transition-all ${
                alerta.lido 
                  ? 'bg-card border-2 border-border opacity-75' 
                  : 'bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 dark:from-orange-950/20 dark:to-pink-950/20'
              } hover:shadow-md`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCorTipo(alerta.tipo)}`}>
                        {getLabelTipo(alerta.tipo).toUpperCase()}
                      </span>
                      {alerta.novo && (
                        <span className="px-2 py-1 text-xs font-bold rounded bg-red-500 text-white">
                          Novo
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatarTimestamp(alerta.dataPublicacao)}
                      </span>
                    </div>

                    <h3 className={`text-lg font-semibold mb-2 ${
                      alerta.lido ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {alerta.titulo}
                    </h3>

                    <p className={`text-sm mb-3 ${
                      alerta.lido ? 'text-muted-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {alerta.descricao}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 text-xs font-medium rounded">
                        {alerta.area}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getCorRelevancia(alerta.relevancia)}`}>
                        Relevância {alerta.relevancia}
                      </span>
                      {alerta.tribunal && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded">
                          {alerta.tribunal}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {alerta.lido ? (
                      <button
                        onClick={() => marcarComoNaoLido(alerta.id)}
                        className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                        title="Marcar como não lido"
                      >
                        <EyeOff className="w-4 h-4" />
                        <span className="text-sm">Marcar como Não Lido</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => marcarComoLido(alerta.id)}
                        className="p-2 text-primary hover:bg-accent rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                        title="Marcar como lido"
                      >
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Marcar como Lido</span>
                      </button>
                    )}

                    {alerta.arquivado ? (
                      <button
                        onClick={() => desarquivar(alerta.id)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                        title="Desarquivar"
                      >
                        <Archive className="w-4 h-4" />
                        <span className="text-sm">Desarquivar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => arquivar(alerta.id)}
                        className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                        title="Arquivar"
                      >
                        <Archive className="w-4 h-4" />
                        <span className="text-sm">Arquivar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card rounded-lg shadow p-12 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {mostrarArquivados ? 'Nenhum alerta arquivado' : 'Nenhum alerta encontrado'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {mostrarArquivados 
                ? 'Você ainda não arquivou nenhum alerta.'
                : 'Tente ajustar os filtros ou termos de busca.'}
            </p>
            {termoBusca || filtroRelevancia !== 'todas' || filtroArea !== 'todas' ? (
              <button
                onClick={() => {
                  setTermoBusca('');
                  setFiltroRelevancia('todas');
                  setFiltroArea('todas');
                  setTipoSelecionado('todos');
                }}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                Limpar Filtros
              </button>
            ) : null}
          </div>
        )}
      </div>

      {alertasFiltrados.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Mostrando {alertasFiltrados.length} de {mostrarArquivados 
            ? alertas.filter(a => a.arquivado).length 
            : alertas.filter(a => !a.arquivado).length} alertas
        </div>
      )}
    </div>
  );
}
