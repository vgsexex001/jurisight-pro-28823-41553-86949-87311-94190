import { BarChart3, FileText, TrendingUp, FolderKanban, Settings, LogOut, Key, Brain, Search, BookOpen, Bell, Scale, Sparkles, LayoutDashboard } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, badge: null },
  { title: "Pesquisa Jurídica", url: "/pesquisa-juridica", icon: Search, badge: null },
  { title: "Processos", url: "/processes", icon: FileText, badge: null },
  { title: "Análises", url: "/analyses", icon: TrendingUp, badge: null },
  { title: "Análise com IA", url: "/ai-analysis", icon: Sparkles, badge: "Novo" },
  { title: "Projetos", url: "/projects", icon: FolderKanban, badge: null },
  { title: "Modelos de Petições", url: "/modelos-peticoes", icon: BookOpen, badge: null },
  { title: "Alertas", url: "/alertas", icon: Bell, badge: null },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const [alertasNaoLidos, setAlertasNaoLidos] = useState(0);

  useEffect(() => {
    const atualizarAlertas = () => {
      const alertas = JSON.parse(localStorage.getItem('alertas') || '[]');
      const naoLidos = alertas.filter((a: any) => !a.lido && !a.arquivado).length;
      setAlertasNaoLidos(naoLidos);
    };

    atualizarAlertas();
    const interval = setInterval(atualizarAlertas, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível sair",
        variant: "destructive"
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          {open && (
            <div>
              <h1 className="text-lg font-bold">JuriMetrics</h1>
              <p className="text-xs text-muted-foreground font-medium">Pro</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Menu Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const badge = item.title === 'Alertas' && alertasNaoLidos > 0 
                  ? String(alertasNaoLidos > 9 ? '9+' : alertasNaoLidos)
                  : item.badge;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => 
                          `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`
                        }
                      >
                        <item.icon className="w-5 h-5" />
                        {open && (
                          <>
                            <span className="text-sm flex-1">{item.title}</span>
                            {badge && (
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                                item.badge === "Novo"
                                  ? "bg-secondary/10 text-secondary"
                                  : "bg-destructive text-destructive-foreground"
                              }`}>
                                {badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-3 border-t border-border space-y-1">
          <SidebarMenuButton asChild>
            <NavLink 
              to="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <Settings className="w-5 h-5" />
              {open && <span className="text-sm">Configurações</span>}
            </NavLink>
          </SidebarMenuButton>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {open && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
