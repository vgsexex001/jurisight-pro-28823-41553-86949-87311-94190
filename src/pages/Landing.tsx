import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  Brain, 
  FileCheck, 
  Scale, 
  TrendingUp, 
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">JuriMetrics Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Recursos</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Planos</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contato</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button className="gradient-primary">Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>IA + Jurimetria = Decisões Inteligentes</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
              Inteligência Jurídica que Transforma Dados em Estratégia
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Análise preditiva, estatísticas processuais e insights estratégicos automatizados para escritórios de advocacia modernos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="gradient-primary shadow-glow text-lg px-8">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Ver Demonstração
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Sem cartão de crédito • Configuração em 2 minutos • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "500K+", label: "Processos Analisados" },
              { value: "94%", label: "Precisão Preditiva" },
              { value: "1.2K+", label: "Escritórios Ativos" },
              { value: "60%", label: "Redução de Tempo" }
            ].map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Recursos Poderosos para Análise Jurídica</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para tomar decisões baseadas em dados reais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "IA Preditiva",
                description: "Calcule probabilidades de sucesso e tempo de tramitação com machine learning"
              },
              {
                icon: BarChart3,
                title: "Análises Estatísticas",
                description: "Dashboards interativos com métricas de performance e tendências"
              },
              {
                icon: FileCheck,
                title: "Processamento Automático",
                description: "OCR e extração de dados de PDFs e documentos judiciais"
              },
              {
                icon: TrendingUp,
                title: "Insights Estratégicos",
                description: "Identifique padrões e oportunidades nos seus casos"
              },
              {
                icon: Users,
                title: "Colaboração em Equipe",
                description: "Compartilhe análises e relatórios com sua equipe"
              },
              {
                icon: Shield,
                title: "100% Seguro",
                description: "Criptografia de ponta a ponta e conformidade LGPD"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground">Simples, rápido e poderoso</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Importe seus dados",
                description: "Upload de PDFs, planilhas ou integração direta com tribunais"
              },
              {
                step: "2",
                title: "Processamento IA",
                description: "Nossa IA extrai e analisa automaticamente todos os dados"
              },
              {
                step: "3",
                title: "Insights Prontos",
                description: "Visualize relatórios e tome decisões estratégicas"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-glow">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Planos para Todos os Tamanhos</h2>
            <p className="text-xl text-muted-foreground">Escolha o plano ideal para seu escritório</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "R$ 0",
                period: "/mês",
                description: "Para testar a plataforma",
                features: [
                  "100 processos/mês",
                  "1 usuário",
                  "Análises básicas",
                  "Relatórios em PDF",
                  "Suporte por email"
                ],
                cta: "Começar Grátis",
                highlighted: false
              },
              {
                name: "Pro",
                price: "R$ 297",
                period: "/mês",
                description: "Para escritórios em crescimento",
                features: [
                  "5.000 processos/mês",
                  "5 usuários",
                  "IA Preditiva",
                  "Integrações com tribunais",
                  "Relatórios customizados",
                  "Suporte prioritário"
                ],
                cta: "Começar Teste Grátis",
                highlighted: true
              },
              {
                name: "Enterprise",
                price: "R$ 997",
                period: "/mês",
                description: "Para grandes operações",
                features: [
                  "Processos ilimitados",
                  "Usuários ilimitados",
                  "API dedicada",
                  "Treinamento personalizado",
                  "SLA garantido",
                  "Gerente de conta dedicado"
                ],
                cta: "Falar com Vendas",
                highlighted: false
              }
            ].map((plan, index) => (
              <Card key={index} className={cn(
                "relative hover:shadow-xl transition-all duration-300",
                plan.highlighted && "border-primary shadow-lg scale-105"
              )}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <Link to="/auth">
                    <Button 
                      className={cn(
                        "w-full mb-6",
                        plan.highlighted && "gradient-primary"
                      )}
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-glow to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMThjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Pronto para Revolucionar sua Prática Jurídica?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de advogados que já usam IA para tomar decisões mais inteligentes
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-background text-primary hover:bg-background/90 text-lg px-8 shadow-xl">
                Começar Agora Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-6 h-6 text-primary" />
                <span className="font-bold">JuriMetrics Pro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Inteligência artificial para análise jurídica estratégica
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">LGPD</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Segurança</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 JuriMetrics Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
