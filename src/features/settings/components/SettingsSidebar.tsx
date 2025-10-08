import { User, Settings, Bell, Shield, Palette, Plug, LogOut } from 'lucide-react';

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  {
    id: 'profile',
    label: 'Perfil',
    icon: User,
    description: 'Informações pessoais'
  },
  {
    id: 'account',
    label: 'Conta',
    icon: Settings,
    description: 'Preferências gerais'
  },
  {
    id: 'notifications',
    label: 'Notificações',
    icon: Bell,
    description: 'Alertas e avisos'
  },
  {
    id: 'security',
    label: 'Segurança',
    icon: Shield,
    description: 'Senha e autenticação'
  },
  {
    id: 'appearance',
    label: 'Aparência',
    icon: Palette,
    description: 'Tema e interface'
  },
  {
    id: 'integrations',
    label: 'Integrações',
    icon: Plug,
    description: 'Serviços conectados'
  }
];

export default function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <aside className="w-72 bg-card border-r border-border p-6">
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-all duration-200 text-left
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-accent'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{section.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {section.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-border">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}
