import { useSettings } from '../hooks/useSettings';
import { Mail, Smartphone, Bell, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function NotificationToggle({ label, description, checked, onChange }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default function NotificationSettings() {
  const { settings, updateSettings } = useSettings();

  const handleToggle = (category: keyof typeof settings.notifications, key: string) => {
    const updated = {
      ...settings.notifications,
      [category]: {
        ...settings.notifications[category],
        [key]: !settings.notifications[category][key as keyof typeof settings.notifications[typeof category]]
      }
    };
    updateSettings({ notifications: updated });
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Notificações</h2>
        <p className="text-sm text-muted-foreground">
          Escolha como e quando você deseja receber notificações
        </p>
      </div>

      {/* Notificações por E-mail */}
      <section>
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">
            Notificações por E-mail
          </h3>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="Atualizações de processos"
            description="Receba e-mails quando houver movimentações em seus processos"
            checked={settings.notifications.email.processUpdates}
            onChange={() => handleToggle('email', 'processUpdates')}
          />

          <NotificationToggle
            label="Alertas de prazo"
            description="Avisos sobre prazos próximos ao vencimento"
            checked={settings.notifications.email.deadlineAlerts}
            onChange={() => handleToggle('email', 'deadlineAlerts')}
          />

          <NotificationToggle
            label="Análises prontas"
            description="Notificação quando suas análises jurídicas estiverem completas"
            checked={settings.notifications.email.analysisReady}
            onChange={() => handleToggle('email', 'analysisReady')}
          />

          <NotificationToggle
            label="Resumo semanal"
            description="Receba um resumo das atividades toda semana"
            checked={settings.notifications.email.weeklyDigest}
            onChange={() => handleToggle('email', 'weeklyDigest')}
          />
        </div>
      </section>

      {/* Notificações Push */}
      <section>
        <div className="flex items-center space-x-3 mb-4">
          <Smartphone className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">
            Notificações Push
          </h3>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="Atualizações de processos"
            description="Notificações instantâneas no navegador"
            checked={settings.notifications.push.processUpdates}
            onChange={() => handleToggle('push', 'processUpdates')}
          />

          <NotificationToggle
            label="Alertas urgentes"
            description="Avisos importantes que requerem ação imediata"
            checked={settings.notifications.push.urgentAlerts}
            onChange={() => handleToggle('push', 'urgentAlerts')}
          />
        </div>
      </section>

      {/* Notificações In-App */}
      <section>
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">
            Notificações no Sistema
          </h3>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="Atualizações de processos"
            description="Alertas visuais dentro do sistema"
            checked={settings.notifications.inApp.processUpdates}
            onChange={() => handleToggle('inApp', 'processUpdates')}
          />

          <NotificationToggle
            label="Menções"
            description="Quando alguém mencionar você em comentários"
            checked={settings.notifications.inApp.mentions}
            onChange={() => handleToggle('inApp', 'mentions')}
          />
        </div>
      </section>

      {/* Horário Silencioso */}
      <section className="bg-accent rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Moon className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">
            Horário Silencioso
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <p className="font-medium">Ativar horário silencioso</p>
              <p className="text-sm text-muted-foreground">
                Não receber notificações durante este período
              </p>
            </div>
            <Switch
              checked={settings.notifications.preferences.quietHours.enabled}
              onCheckedChange={() => {
                const updated = {
                  ...settings.notifications,
                  preferences: {
                    ...settings.notifications.preferences,
                    quietHours: {
                      ...settings.notifications.preferences.quietHours,
                      enabled: !settings.notifications.preferences.quietHours.enabled
                    }
                  }
                };
                updateSettings({ notifications: updated });
              }}
            />
          </div>

          {settings.notifications.preferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-8">
              <div>
                <Label htmlFor="quietStart">Início</Label>
                <input
                  id="quietStart"
                  type="time"
                  value={settings.notifications.preferences.quietHours.start}
                  onChange={(e) => {
                    const updated = {
                      ...settings.notifications,
                      preferences: {
                        ...settings.notifications.preferences,
                        quietHours: {
                          ...settings.notifications.preferences.quietHours,
                          start: e.target.value
                        }
                      }
                    };
                    updateSettings({ notifications: updated });
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="quietEnd">Término</Label>
                <input
                  id="quietEnd"
                  type="time"
                  value={settings.notifications.preferences.quietHours.end}
                  onChange={(e) => {
                    const updated = {
                      ...settings.notifications,
                      preferences: {
                        ...settings.notifications.preferences,
                        quietHours: {
                          ...settings.notifications.preferences.quietHours,
                          end: e.target.value
                        }
                      }
                    };
                    updateSettings({ notifications: updated });
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
