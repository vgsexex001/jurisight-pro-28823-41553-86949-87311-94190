import { Bell, BookOpen, Scale, FileText, Check, Archive } from 'lucide-react';
import { alertasJuridicos } from '@/data/juridicalData';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Alertas() {
  const [filtro, setFiltro] = useState('todos');
  
  const alertasFiltrados = filtro === 'todos' 
    ? alertasJuridicos 
    : alertasJuridicos.filter(a => a.tipo === filtro);

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'nova_sumula':
        return FileText;
      case 'precedente':
        return Scale;
      case 'legislacao':
        return BookOpen;
      case 'jurisprudencia':
        return Scale;
      default:
        return Bell;
    }
  };

  const getAlertColor = (relevancia: string) => {
    switch (relevancia) {
      case 'alta':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'media':
        return 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
    }
  };

  const formatData = (dataISO: string) => {
    const agora = new Date();
    const data = new Date(dataISO);
    const diffMs = agora.getTime() - data.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);

    if (diffHoras < 24) {
      return `Hoje, ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDias === 1) {
      return 'Ontem, ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return `Há ${diffDias} dias`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Alertas Jurídicos</h1>
      <p className="text-muted-foreground mb-6">Acompanhe as últimas atualizações do mundo jurídico</p>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={filtro === 'todos' ? 'default' : 'outline'}
          onClick={() => setFiltro('todos')}
        >
          <Bell className="w-4 h-4 mr-2" />
          Todos
        </Button>
        <Button
          variant={filtro === 'nova_sumula' ? 'default' : 'outline'}
          onClick={() => setFiltro('nova_sumula')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Súmulas
        </Button>
        <Button
          variant={filtro === 'precedente' ? 'default' : 'outline'}
          onClick={() => setFiltro('precedente')}
        >
          <Scale className="w-4 h-4 mr-2" />
          Precedentes
        </Button>
        <Button
          variant={filtro === 'legislacao' ? 'default' : 'outline'}
          onClick={() => setFiltro('legislacao')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Legislação
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg shadow p-4">
          <p className="text-sm text-muted-foreground">Total de Alertas</p>
          <p className="text-2xl font-bold">{alertasJuridicos.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow p-4">
          <p className="text-sm text-muted-foreground">Não Lidos</p>
          <p className="text-2xl font-bold text-red-600">
            {alertasJuridicos.filter(a => !a.lido).length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow p-4">
          <p className="text-sm text-muted-foreground">Alta Relevância</p>
          <p className="text-2xl font-bold text-orange-600">
            {alertasJuridicos.filter(a => a.relevancia === 'alta').length}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow p-4">
          <p className="text-sm text-muted-foreground">Esta Semana</p>
          <p className="text-2xl font-bold text-blue-600">
            {alertasJuridicos.filter(a => {
              const diff = Date.now() - new Date(a.data).getTime();
              return diff < 7 * 24 * 60 * 60 * 1000;
            }).length}
          </p>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-4">
        {alertasFiltrados.map((alerta) => {
          const Icon = getAlertIcon(alerta.tipo);
          
          return (
            <div 
              key={alerta.id} 
              className={`rounded-lg border-2 p-6 ${getAlertColor(alerta.relevancia)} ${!alerta.lido ? 'shadow-lg' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg">{alerta.titulo}</h3>
                    {!alerta.lido && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        Novo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{alerta.descricao}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium">{formatData(alerta.data)}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-primary/10 rounded text-primary">
                      {alerta.categoria}
                    </span>
                    <span>•</span>
                    <span className={`font-medium ${
                      alerta.relevancia === 'alta' ? 'text-red-600' :
                      alerta.relevancia === 'media' ? 'text-orange-600' :
                      'text-blue-600'
                    }`}>
                      Relevância {alerta.relevancia}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Check className="w-4 h-4 mr-2" />
                    Marcar como Lido
                  </Button>
                  <Button size="sm" variant="outline">
                    <Archive className="w-4 h-4 mr-2" />
                    Arquivar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {alertasFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum alerta encontrado</h3>
          <p className="text-muted-foreground">
            Não há alertas para este filtro
          </p>
        </div>
      )}
    </div>
  );
}
