import { Bell } from "lucide-react";
import { alertasJuridicos } from "@/data/juridicalData";

export function AlertasJuridicos() {
  const alertasRecentes = alertasJuridicos.slice(0, 3);

  const getAlertColor = (relevancia: string) => {
    switch (relevancia) {
      case 'alta':
        return 'border-red-500 bg-red-50';
      case 'media':
        return 'border-orange-500 bg-orange-50';
      default:
        return 'border-blue-500 bg-blue-50';
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
    <div className="bg-card rounded-lg shadow-lg p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-orange-600" />
        Alertas Jurídicos
      </h3>
      
      <div className="space-y-3">
        {alertasRecentes.map((alerta) => (
          <div 
            key={alerta.id} 
            className={`p-3 border-l-4 rounded ${getAlertColor(alerta.relevancia)}`}
          >
            <p className="font-medium text-sm">{alerta.titulo}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatData(alerta.data)}</p>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full text-center text-primary hover:text-primary/80 text-sm font-medium">
        Ver todos os alertas →
      </button>
    </div>
  );
}
