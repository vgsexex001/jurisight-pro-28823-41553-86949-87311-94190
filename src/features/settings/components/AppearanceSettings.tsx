import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function AppearanceSettings() {
  const { data: settings } = useSettings();
  const updateMutation = useUpdateSettings();

  const themes = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Escuro', icon: Moon },
    { id: 'system', label: 'Sistema', icon: Monitor }
  ];

  const accentColors = [
    { id: 'blue', color: 'hsl(221, 83%, 53%)', label: 'Azul' },
    { id: 'purple', color: 'hsl(262, 83%, 58%)', label: 'Roxo' },
    { id: 'green', color: 'hsl(142, 71%, 45%)', label: 'Verde' },
    { id: 'red', color: 'hsl(0, 84%, 60%)', label: 'Vermelho' },
    { id: 'orange', color: 'hsl(25, 95%, 53%)', label: 'Laranja' }
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Aparência</h2>
        <p className="text-sm text-muted-foreground">
          Personalize a interface do sistema
        </p>
      </div>

      {/* Tema */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Tema</h3>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isActive = settings?.appearance.theme === theme.id;

            return (
              <button
                key={theme.id}
              onClick={() => updateMutation.mutate({
                section: 'appearance',
                data: { ...settings?.appearance, theme: theme.id as any }
              })}
                className={`
                  p-6 border-2 rounded-lg transition-all
                  ${isActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-muted-foreground'
                  }
                `}
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className={`font-medium ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {theme.label}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Cor de Destaque */}
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Cor de Destaque
        </h3>
        <div className="flex space-x-4">
          {accentColors.map((accent) => {
            const isActive = settings?.appearance.accentColor === accent.id;

            return (
              <button
                key={accent.id}
              onClick={() => updateMutation.mutate({
                section: 'appearance',
                data: { ...settings?.appearance, accentColor: accent.id }
              })}
                className={`
                  relative w-16 h-16 rounded-full border-4 transition-all
                  ${isActive ? 'border-foreground scale-110' : 'border-transparent'}
                `}
                style={{ backgroundColor: accent.color }}
                title={accent.label}
              >
                {isActive && (
                  <Check className="absolute inset-0 m-auto w-8 h-8 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Tamanho da Fonte */}
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Tamanho da Fonte
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
            onClick={() => updateMutation.mutate({
              section: 'appearance',
              data: { ...settings?.appearance, fontSize: size }
            })}
              className={`
                p-4 border-2 rounded-lg transition-all
                ${settings?.appearance.fontSize === size
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground'
                }
              `}
            >
              <p className={`font-medium ${
                size === 'small' ? 'text-sm' : 
                size === 'medium' ? 'text-base' : 'text-lg'
              }`}>
                {size === 'small' ? 'Pequena' : 
                 size === 'medium' ? 'Média' : 'Grande'}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Modo Compacto */}
      <section>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium">Modo Compacto</p>
            <p className="text-sm text-muted-foreground">
              Reduz o espaçamento entre elementos
            </p>
          </div>
          <Switch
            checked={settings?.appearance.compactMode}
            onCheckedChange={(checked) => updateMutation.mutate({
              section: 'appearance',
              data: {
                ...settings?.appearance,
                compactMode: checked
              }
            })}
          />
        </div>
      </section>

      {/* Sidebar Colapsada */}
      <section>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium">Menu Lateral Colapsado</p>
            <p className="text-sm text-muted-foreground">
              Iniciar com o menu lateral minimizado
            </p>
          </div>
          <Switch
            checked={settings?.appearance.sidebarCollapsed}
            onCheckedChange={(checked) => updateMutation.mutate({
              section: 'appearance',
              data: {
                ...settings?.appearance,
                sidebarCollapsed: checked
              }
            })}
          />
        </div>
      </section>
    </div>
  );
}
