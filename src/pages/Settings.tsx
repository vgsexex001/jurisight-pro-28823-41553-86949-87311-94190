import { useState } from 'react';
import SettingsSidebar from '@/features/settings/components/SettingsSidebar';
import ProfileSettings from '@/features/settings/components/ProfileSettings';
import NotificationSettings from '@/features/settings/components/NotificationSettings';
import SecuritySettings from '@/features/settings/components/SecuritySettings';
import AppearanceSettings from '@/features/settings/components/AppearanceSettings';
import IntegrationSettings from '@/features/settings/components/IntegrationSettings';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="flex min-h-screen bg-background w-full">
      <SettingsSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <SettingsIcon className="w-8 h-8" />
              Configurações
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie as configurações e preferências do seu perfil
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-sm border border-border">
            {activeSection === 'profile' && <ProfileSettings />}
            {activeSection === 'account' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Conta</h2>
                <p className="text-sm text-muted-foreground">
                  Configurações de conta em desenvolvimento
                </p>
              </div>
            )}
            {activeSection === 'notifications' && <NotificationSettings />}
            {activeSection === 'security' && <SecuritySettings />}
            {activeSection === 'appearance' && <AppearanceSettings />}
            {activeSection === 'integrations' && <IntegrationSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}
