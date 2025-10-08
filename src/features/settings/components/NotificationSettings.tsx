import { Mail, Smartphone, Moon } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';

export default function NotificationSettings() {
  const { data: settings } = useSettings();
  const updateMutation = useUpdateSettings();

  const toggleNotification = async (category: 'email' | 'push', key: string) => {
    const currentValue = settings?.notifications[category][key as keyof typeof settings.notifications.email];
    
    await updateMutation.mutateAsync({
      section: 'notifications',
      data: {
        ...settings?.notifications,
        [category]: {
          ...settings?.notifications[category],
          [key]: !currentValue
        }
      }
    });
  };

  const toggleQuietHours = () => {
    updateMutation.mutate({
      section: 'notifications',
      data: {
        ...settings?.notifications,
        preferences: {
          ...settings?.notifications.preferences,
          quietHours: {
            ...settings?.notifications.preferences.quietHours,
            enabled: !settings?.notifications.preferences.quietHours.enabled
          }
        }
      }
    });
  };

  const updateTime = (field: 'start' | 'end', value: string) => {
    updateMutation.mutate({
      section: 'notifications',
      data: {
        ...settings?.notifications,
        preferences: {
          ...settings?.notifications.preferences,
          quietHours: {
            ...settings?.notifications.preferences.quietHours,
            [field]: value
          }
        }
      }
    });
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Notificações</h2>
        <p className="text-sm text-muted-foreground">
          Escolha como e quando receber notificações
        </p>
      </div>

      <section>
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Notificações por E-mail</h3>
        </div>
        <div className="space-y-4">
          <ToggleItem label="Atualizações de processos" description="Receba e-mails quando houver movimentações" checked={settings?.notifications.email.processUpdates} onChange={() => toggleNotification('email', 'processUpdates')} />
          <ToggleItem label="Alertas de prazo" description="Avisos sobre prazos próximos" checked={settings?.notifications.email.deadlineAlerts} onChange={() => toggleNotification('email', 'deadlineAlerts')} />
          <ToggleItem label="Análises prontas" description="Quando análises estiverem completas" checked={settings?.notifications.email.analysisReady} onChange={() => toggleNotification('email', 'analysisReady')} />
          <ToggleItem label="Resumo semanal" description="Resumo das atividades" checked={settings?.notifications.email.weeklyDigest} onChange={() => toggleNotification('email', 'weeklyDigest')} />
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-3 mb-4">
          <Smartphone className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Notificações Push</h3>
        </div>
        <div className="space-y-4">
          <ToggleItem label="Atualizações de processos" description="Notificações instantâneas" checked={settings?.notifications.push.processUpdates} onChange={() => toggleNotification('push', 'processUpdates')} />
          <ToggleItem label="Alertas urgentes" description="Avisos importantes" checked={settings?.notifications.push.urgentAlerts} onChange={() => toggleNotification('push', 'urgentAlerts')} />
        </div>
      </section>

      <section className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Moon className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Horário Silencioso</h3>
        </div>
        <ToggleItem label="Ativar horário silencioso" description="Não receber notificações neste período" checked={settings?.notifications.preferences.quietHours.enabled} onChange={toggleQuietHours} />
        {settings?.notifications.preferences.quietHours.enabled && (
          <div className="grid grid-cols-2 gap-4 mt-4 ml-8">
            <div>
              <label className="block text-sm font-medium mb-2">Início</label>
              <input type="time" value={settings.notifications.preferences.quietHours.start} onChange={(e) => updateTime('start', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Término</label>
              <input type="time" value={settings.notifications.preferences.quietHours.end} onChange={(e) => updateTime('end', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

const ToggleItem = ({ label, description, checked, onChange }: any) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1">
      <p className="font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);
