import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, Download, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                
                <div className="flex flex-1 items-center max-w-2xl">
                  <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Buscar processos, análises..."
                      className="w-full h-11 pl-12 pr-4 rounded-xl border border-border bg-muted text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10"
                    />
                    <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-border bg-background px-2 font-mono text-xs text-muted-foreground">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-6">
                <button className="hidden md:flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-background hover:bg-muted transition-colors">
                  <span className="text-sm font-medium">6 meses</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                <button className="hidden md:flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-background hover:bg-muted transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Exportar</span>
                </button>

                <button className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive ring-2 ring-background"></span>
                </button>

                <button className="flex items-center gap-3 h-10 pl-1 pr-3 rounded-lg hover:bg-muted transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm font-bold">
                      JM
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 bg-gradient-to-br from-neutral-50 via-white to-primary/5">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
