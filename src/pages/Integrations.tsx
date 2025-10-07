import { useState, useEffect } from 'react';
import { Key, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ApiConfig {
  id: string;
  nome: string;
  status: 'ativo' | 'inativo';
  apiKey: string;
  description: string;
  required: boolean;
}

export default function Integrations() {
  const [apis, setApis] = useState<ApiConfig[]>([
    { 
      id: 'jusbrasil', 
      nome: 'JusBrasil', 
      status: 'inativo', 
      apiKey: '',
      description: 'Consulta de processos e jurisprudência',
      required: false
    },
    { 
      id: 'cnj', 
      nome: 'CNJ DataJud', 
      status: 'ativo', 
      apiKey: 'PUBLIC',
      description: 'Dados abertos do judiciário (público)',
      required: false
    },
    { 
      id: 'lovable_ai', 
      nome: 'Lovable AI (Gemini)', 
      status: 'ativo', 
      apiKey: 'AUTO',
      description: 'Análise inteligente com IA - GRATUITO até 13/10/2025',
      required: true
    }
  ]);

  const [autoCollect, setAutoCollect] = useState(false);
  const [selectedTribunals, setSelectedTribunals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const tribunals = ['TJSP', 'TRT02', 'TRT15', 'STJ', 'TST', 'CNJ'];

  const handleSaveApiKey = async (apiId: string, apiKey: string) => {
    setSaving(true);
    try {
      // Salvar no localStorage por enquanto
      localStorage.setItem(`api_key_${apiId}`, apiKey);
      
      setApis(apis.map(api => 
        api.id === apiId 
          ? { ...api, apiKey, status: apiKey ? 'ativo' : 'inativo' } 
          : api
      ));

      toast({
        title: 'Sucesso',
        description: 'API key salva com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a API key',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStartCollection = async () => {
    if (selectedTribunals.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Selecione ao menos um tribunal para monitorar',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Coleta iniciada',
      description: `Buscando atualizações em ${selectedTribunals.length} tribunais...`,
    });

    // Implementar lógica de coleta
  };

  const toggleTribunal = (tribunal: string) => {
    setSelectedTribunals(prev => 
      prev.includes(tribunal) 
        ? prev.filter(t => t !== tribunal)
        : [...prev, tribunal]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integrações</h1>
        <p className="text-muted-foreground">Configure APIs para coleta e análise automática de processos</p>
      </div>

      {/* Alerta sobre Lovable AI */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-purple-900 mb-1">Lovable AI Ativado</h3>
          <p className="text-sm text-purple-800">
            Análise com IA usando Google Gemini - <strong>GRATUITO</strong> até 13 de outubro de 2025. 
            Não requer API key externa!
          </p>
        </div>
      </div>

      {/* Cards de Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {apis.map(api => (
          <div key={api.id} className="bg-card rounded-lg shadow-md border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{api.nome}</h3>
              {api.status === 'ativo' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{api.description}</p>
            
            {api.id !== 'lovable_ai' && api.id !== 'cnj' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={api.apiKey}
                    onChange={(e) => {
                      const newApis = [...apis];
                      const index = newApis.findIndex(a => a.id === api.id);
                      newApis[index].apiKey = e.target.value;
                      setApis(newApis);
                    }}
                    placeholder="Cole sua chave de API"
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
                
                <button 
                  onClick={() => handleSaveApiKey(api.id, api.apiKey)}
                  disabled={saving || !api.apiKey}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Salvando...' : 'Salvar e Conectar'}
                </button>
              </>
            )}
            
            {(api.id === 'lovable_ai' || api.id === 'cnj') && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-green-800">✓ Configurado automaticamente</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Configuração de Coleta Automática */}
      <div className="bg-card rounded-lg shadow-md border p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Coleta Automática
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="auto-collect"
              checked={autoCollect}
              onChange={(e) => setAutoCollect(e.target.checked)}
              className="rounded" 
            />
            <label htmlFor="auto-collect" className="text-sm font-medium">
              Buscar atualizações diariamente
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">Tribunais para monitorar</label>
            <div className="flex flex-wrap gap-2">
              {tribunals.map(t => (
                <label 
                  key={t} 
                  className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${
                    selectedTribunals.includes(t)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-accent'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={selectedTribunals.includes(t)}
                    onChange={() => toggleTribunal(t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleStartCollection}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Iniciar Coleta Agora
          </button>
        </div>
      </div>
    </div>
  );
}
