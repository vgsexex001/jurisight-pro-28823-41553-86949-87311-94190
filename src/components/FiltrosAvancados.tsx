import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export interface Filtros {
  tribunal: string[];
  area: string[];
  tipoDocumento: string[];
  periodo: string;
  dataInicio?: string;
  dataFim?: string;
}

interface FiltrosAvancadosProps {
  filtros: Filtros;
  onFiltrosChange: (filtros: Filtros) => void;
  onLimpar: () => void;
}

export default function FiltrosAvancados({ filtros, onFiltrosChange, onLimpar }: FiltrosAvancadosProps) {
  const [showModal, setShowModal] = useState(false);

  const tribunais = [
    'STF - Supremo Tribunal Federal',
    'STJ - Superior Tribunal de Justiça',
    'TST - Tribunal Superior do Trabalho',
    'TSE - Tribunal Superior Eleitoral',
    'STM - Superior Tribunal Militar',
    'TJSP - TJ de São Paulo',
    'TJRJ - TJ do Rio de Janeiro',
    'TRT 2ª - TRT 2ª Região',
    'TRT 15ª - TRT 15ª Região'
  ];

  const areas = [
    'Trabalhista',
    'Cível',
    'Penal/Criminal',
    'Tributário',
    'Previdenciário',
    'Família e Sucessões',
    'Consumidor',
    'Administrativo',
    'Constitucional',
    'Empresarial'
  ];

  const tiposDocumento = [
    'Acórdão',
    'Sentença',
    'Decisão Monocrática',
    'Despacho',
    'Súmula',
    'Lei',
    'Decreto',
    'Medida Provisória',
    'Instrução Normativa'
  ];

  const toggleFiltro = (categoria: keyof Filtros, valor: string) => {
    const arrayAtual = filtros[categoria] as string[];
    const novoArray = arrayAtual.includes(valor)
      ? arrayAtual.filter(v => v !== valor)
      : [...arrayAtual, valor];
    
    onFiltrosChange({ ...filtros, [categoria]: novoArray });
  };

  const countFiltrosAtivos = () => {
    return (
      filtros.tribunal.length +
      filtros.area.length +
      filtros.tipoDocumento.length +
      (filtros.periodo !== 'todos' ? 1 : 0) +
      (filtros.dataInicio ? 1 : 0) +
      (filtros.dataFim ? 1 : 0)
    );
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Mais Filtros
        {countFiltrosAtivos() > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
            {countFiltrosAtivos()}
          </span>
        )}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filtros Avançados</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tribunais */}
            <div>
              <h3 className="font-semibold mb-3">Tribunais</h3>
              <div className="grid grid-cols-2 gap-2">
                {tribunais.map(tribunal => (
                  <div key={tribunal} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tribunal-${tribunal}`}
                      checked={filtros.tribunal.includes(tribunal)}
                      onCheckedChange={() => toggleFiltro('tribunal', tribunal)}
                    />
                    <label
                      htmlFor={`tribunal-${tribunal}`}
                      className="text-sm cursor-pointer"
                    >
                      {tribunal}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Áreas do Direito */}
            <div>
              <h3 className="font-semibold mb-3">Área do Direito</h3>
              <div className="grid grid-cols-2 gap-2">
                {areas.map(area => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={`area-${area}`}
                      checked={filtros.area.includes(area)}
                      onCheckedChange={() => toggleFiltro('area', area)}
                    />
                    <label
                      htmlFor={`area-${area}`}
                      className="text-sm cursor-pointer"
                    >
                      {area}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipo de Documento */}
            <div>
              <h3 className="font-semibold mb-3">Tipo de Documento</h3>
              <div className="grid grid-cols-3 gap-2">
                {tiposDocumento.map(tipo => (
                  <div key={tipo} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tipo-${tipo}`}
                      checked={filtros.tipoDocumento.includes(tipo)}
                      onCheckedChange={() => toggleFiltro('tipoDocumento', tipo)}
                    />
                    <label
                      htmlFor={`tipo-${tipo}`}
                      className="text-sm cursor-pointer"
                    >
                      {tipo}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Período Customizado */}
            <div>
              <h3 className="font-semibold mb-3">Período Customizado</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataInicio">Data Inicial</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={filtros.dataInicio || ''}
                    onChange={(e) => onFiltrosChange({ ...filtros, dataInicio: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dataFim">Data Final</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={filtros.dataFim || ''}
                    onChange={(e) => onFiltrosChange({ ...filtros, dataFim: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between">
            <Button onClick={onLimpar} variant="outline">
              Limpar Filtros
            </Button>
            <div className="flex gap-3">
              <Button onClick={() => setShowModal(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={() => setShowModal(false)}>
                Aplicar Filtros ({countFiltrosAtivos()})
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
