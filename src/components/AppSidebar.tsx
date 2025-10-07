import { BarChart3, FileText, TrendingUp, FolderKanban, Settings, LogOut, Key, Brain, Search, BookOpen, Bell } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
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
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Pesquisa Jurídica", url: "/pesquisa", icon: Search },
  { title: "Processos", url: "/processes", icon: FileText },
  { title: "Análises", url: "/analyses", icon: TrendingUp },
  { title: "Análise com IA", url: "/ai-analysis", icon: Brain },
  { title: "Projetos", url: "/projects", icon: FolderKanban },
  { title: "Modelos", url: "/modelos", icon: BookOpen },
  { title: "Alertas", url: "/alertas", icon: Bell },
  { title: "Integrações", url: "/integrations", icon: Key },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();

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
    <Sidebar className={open ? "w-60" : "w-14"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-2 border-b">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          {open && (
            <div>
              <h1 className="font-bold text-lg">JuriMetrics</h1>
              <p className="text-xs text-muted-foreground">Pro</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {open && <span>Sair</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
