import { useSettings } from '../hooks/useSettings';
import { Shield, Monitor, Smartphone, Tablet, AlertTriangle, Copy, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function SecuritySettings() {
  const { settings } = useSettings();

  const mockDevices: Array<{
    id: string;
    name: string;
    type: 'desktop' | 'mobile' | 'tablet';
    lastAccess: Date;
    location: string;
    ipAddress: string;
  }> = [
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      lastAccess: new Date(),
      location: 'São Paulo, SP',
      ipAddress: '192.168.1.1'
    },
    {
      id: '2',
      name: 'iPhone 14',
      type: 'mobile',
      lastAccess: new Date(Date.now() - 86400000),
      location: 'São Paulo, SP',
      ipAddress: '192.168.1.2'
    }
  ];

  const mockApiKeys = [
    {
      id: '1',
      name: 'Integração Principal',
      key: 'sk_live_••••••••••••••••1234',
      createdAt: new Date('2024-01-15'),
      lastUsed: new Date(),
      permissions: ['read', 'write']
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Segurança</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie a segurança da sua conta
        </p>
      </div>

      {/* Senha */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Senha</h3>
        <div className="bg-accent rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alterar senha</p>
              <p className="text-sm text-muted-foreground">
                Última alteração: há 3 meses
              </p>
            </div>
            <Button>
              Alterar Senha
            </Button>
          </div>
        </div>
      </section>

      {/* Autenticação de Dois Fatores */}
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Autenticação de Dois Fatores (2FA)
        </h3>
        <div className="bg-accent rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <p className="font-medium">
                  {settings.security.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione uma camada extra de segurança à sua conta
                </p>
              </div>
            </div>
            <Button variant="outline">
              {settings.security.twoFactorEnabled ? 'Desativar' : 'Ativar'}
            </Button>
          </div>
        </div>
      </section>

      {/* Dispositivos Confiáveis */}
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Dispositivos Confiáveis
        </h3>
        <div className="space-y-3">
          {mockDevices.map((device) => (
            <div key={device.id} className="bg-accent rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    {device.type === 'desktop' && <Monitor className="w-5 h-5 text-primary" />}
                    {device.type === 'mobile' && <Smartphone className="w-5 h-5 text-primary" />}
                    {device.type === 'tablet' && <Tablet className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {device.location} • {device.ipAddress}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Último acesso: {device.lastAccess.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="text-destructive hover:text-destructive">
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chaves API */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Chaves API</h3>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Chave
          </Button>
        </div>
        <div className="space-y-3">
          {mockApiKeys.map((apiKey) => (
            <div key={apiKey.id} className="bg-accent rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{apiKey.name}</p>
                  <p className="text-sm font-mono text-muted-foreground mt-1">
                    {apiKey.key}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Criada em: {apiKey.createdAt.toLocaleDateString('pt-BR')}
                    {apiKey.lastUsed && ` • Último uso: ${apiKey.lastUsed.toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sessões Ativas */}
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Gerenciar Sessões
        </h3>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Encerrar outras sessões</p>
              <p className="text-sm text-muted-foreground mt-1">
                Se você suspeita que sua conta foi comprometida, encerre todas as outras sessões ativas
              </p>
              <Button variant="destructive" size="sm" className="mt-3">
                Encerrar todas as sessões
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
