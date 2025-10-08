import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';
import { Scale, FileText, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function IntegrationSettings() {
  const { data: settings } = useSettings();
  const updateMutation = useUpdateSettings();
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Integrações</h2>
        <p className="text-sm text-muted-foreground">Conecte o JuriMetrics com outros serviços</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
            <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold">OpenAI API</h3>
              {settings?.integrations.openai.enabled && settings?.integrations.openai.apiKey && (
                <span className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />Conectado
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Conecte sua chave da OpenAI para análises avançadas</p>
          </div>
        </div>
        <div>
          <Label htmlFor="openai-key">API Key</Label>
          <div className="flex space-x-2 mt-2">
            <div className="relative flex-1">
              <Input id="openai-key" type={showApiKey ? 'text' : 'password'} value={settings?.integrations.openai.apiKey || ''} onChange={(e) => updateMutation.mutate({ section: 'integrations', data: { ...settings?.integrations, openai: { ...settings?.integrations.openai, apiKey: e.target.value }}})} placeholder="sk-..." className="pr-10" />
              <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button disabled={!settings?.integrations.openai.apiKey}>Salvar</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-card border-2 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-lg"><Scale className="w-6 h-6 text-primary" /></div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">PJe - Processo Judicial Eletrônico</h3>
              <p className="text-sm text-muted-foreground mt-1">Conecte com o sistema PJe</p>
            </div>
            <Button variant="default">Conectar</Button>
          </div>
        </div>
        <div className="bg-card border-2 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-lg"><FileText className="w-6 h-6 text-primary" /></div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">ESAJ</h3>
              <p className="text-sm text-muted-foreground mt-1">Sincronize processos do ESAJ</p>
            </div>
            <Button variant="default">Conectar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
