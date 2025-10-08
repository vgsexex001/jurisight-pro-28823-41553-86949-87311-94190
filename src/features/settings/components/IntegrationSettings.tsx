import { useSettings } from '../hooks/useSettings';
import { Scale, FileText, Calendar, Cloud, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function IntegrationSettings() {
  const { settings, updateSettings } = useSettings();
  const [showApiKey, setShowApiKey] = useState(false);

  const integrations = [
    {
      id: 'openai',
      name: 'OpenAI API',
      description: 'Conecte sua chave da OpenAI para análises jurídicas avançadas com IA',
      icon: Brain,
      color: 'purple',
      enabled: settings.integrations.openai.enabled,
      hasConfig: true
    },
    {
      id: 'pje',
      name: 'PJe - Processo Judicial Eletrônico',
      description: 'Conecte com o sistema PJe para importar processos automaticamente',
      icon: Scale,
      color: 'blue',
      enabled: settings.integrations.pje.enabled,
      status: 'disconnected'
    },
    {
      id: 'esaj',
      name: 'ESAJ - Sistema de Automação da Justiça',
      description: 'Sincronize processos do ESAJ de forma automática',
      icon: FileText,
      color: 'green',
      enabled: settings.integrations.esaj.enabled,
      status: 'disconnected'
    }
  ];

  const handleToggleOpenAI = () => {
    updateSettings({
      integrations: {
        ...settings.integrations,
        openai: {
          ...settings.integrations.openai,
          enabled: !settings.integrations.openai.enabled
        }
      }
    });
  };

  const handleSaveApiKey = (apiKey: string) => {
    updateSettings({
      integrations: {
        ...settings.integrations,
        openai: {
          enabled: true,
          apiKey
        }
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Integrações</h2>
        <p className="text-sm text-muted-foreground">
          Conecte o JuriMetrics com outros serviços
        </p>
      </div>

      {/* OpenAI Integration - Special Card */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
            <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold">
                OpenAI API
              </h3>
              {settings.integrations.openai.enabled && settings.integrations.openai.apiKey && (
                <span className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Conectado
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Conecte sua chave da OpenAI para análises jurídicas avançadas com IA
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="openai-key">API Key</Label>
            <div className="flex space-x-2 mt-2">
              <div className="relative flex-1">
                <Input
                  id="openai-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.integrations.openai.apiKey || ''}
                  onChange={(e) => {
                    updateSettings({
                      integrations: {
                        ...settings.integrations,
                        openai: {
                          ...settings.integrations.openai,
                          apiKey: e.target.value
                        }
                      }
                    });
                  }}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                onClick={() => handleSaveApiKey(settings.integrations.openai.apiKey || '')}
                disabled={!settings.integrations.openai.apiKey}
              >
                Salvar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Obtenha sua chave em{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                platform.openai.com/api-keys
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Other Integrations */}
      <div className="grid gap-6">
        {integrations.slice(1).map((integration) => {
          const Icon = integration.icon;
          
          return (
            <div key={integration.id} className="bg-card border-2 border-border rounded-lg p-6 hover:border-muted-foreground transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">
                        {integration.name}
                      </h3>
                      {integration.status === 'connected' && (
                        <span className="flex items-center text-green-600 dark:text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Conectado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {integration.description}
                    </p>

                    {integration.enabled && (
                      <div className="mt-4 space-x-2">
                        <Button variant="link" size="sm" className="px-0">
                          Configurar
                        </Button>
                        <span className="text-muted-foreground">•</span>
                        <Button variant="link" size="sm" className="px-0">
                          Ver logs
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Button variant={integration.enabled ? 'outline' : 'default'}>
                  {integration.enabled ? 'Desconectar' : 'Conectar'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Brain({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}
