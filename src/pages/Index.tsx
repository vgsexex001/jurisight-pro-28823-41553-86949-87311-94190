import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import PredictionCalculator from "@/components/PredictionCalculator";
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  DollarSign,
  BarChart3,
  Upload,
  FolderKanban,
  Search,
  Filter,
  BookOpen,
  Scale,
  Brain,
  CheckCircle,
  AlertCircle,
  Key
} from "lucide-react";
import { getOpenAIService } from "@/services/openaiService";
import { AlertasJuridicos } from "@/components/AlertasJuridicos";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6B7280'];

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [stats, setStats] = useState({
    totalProcesses: 0,
    successRate: 0,
    avgDuration: 0,
    avgAmount: 0
  });
  
  interface ChartData {
    name: string;
    value?: number;
    count?: number;
  }
  
  const [resultData, setResultData] = useState<ChartData[]>([]);
  const [actionTypeData, setActionTypeData] = useState<ChartData[]>([]);
  const [selectedTribunal, setSelectedTribunal] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [iaAtiva, setIaAtiva] = useState(false);

  useEffect(() => {
    checkUser();
    const service = getOpenAIService();
    setIaAtiva(service.isConfigured());
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await loadDashboardData(session.user.id);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      const { data: processes, error } = await (supabase as any)
        .from("processes")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      if (processes && processes.length > 0) {
        // Calculate stats
        const total = processes.length;
        const successful = processes.filter(p => p.result === 'procedente').length;
        const successRate = total > 0 ? (successful / total) * 100 : 0;
        
        // Calculate average duration
        const durations = processes
          .filter(p => p.judgment_date && p.distribution_date)
          .map(p => {
            const start = new Date(p.distribution_date);
            const end = new Date(p.judgment_date);
            return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          });
        const avgDuration = durations.length > 0
          ? Math.floor(durations.reduce((a, b) => a + b, 0) / durations.length)
          : 0;

        // Calculate average amount
        const amounts = processes.filter(p => p.amount).map(p => Number(p.amount));
        const avgAmount = amounts.length > 0
          ? amounts.reduce((a, b) => a + b, 0) / amounts.length
          : 0;

        setStats({
          totalProcesses: total,
          successRate: Math.round(successRate),
          avgDuration,
          avgAmount: Math.round(avgAmount)
        });

        // Result distribution
        const resultCounts = processes.reduce((acc: any, p) => {
          acc[p.result] = (acc[p.result] || 0) + 1;
          return acc;
        }, {});

        const resultLabels: any = {
          'procedente': 'Procedente',
          'improcedente': 'Improcedente',
          'parcial_procedente': 'Parcial',
          'pendente': 'Pendente'
        };

        setResultData(
          Object.entries(resultCounts).map(([key, value]) => ({
            name: resultLabels[key] || key,
            value: value as number
          }))
        );

        // Action type distribution
        const actionCounts = processes.reduce((acc: any, p) => {
          acc[p.action_type] = (acc[p.action_type] || 0) + 1;
          return acc;
        }, {});

        const actionLabels: any = {
          'trabalhista': 'Trabalhista',
          'civel': 'Cível',
          'criminal': 'Criminal',
          'tributario': 'Tributário',
          'administrativo': 'Administrativo'
        };

        setActionTypeData(
          Object.entries(actionCounts).map(([key, value]) => ({
            name: actionLabels[key] || key,
            count: value as number
          }))
        );
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral dos seus processos jurídicos</p>
      </div>

      {/* Indicador de status da IA */}
      {iaAtiva ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">IA OpenAI Ativa</p>
            <p className="text-xs text-green-700">Análises com inteligência artificial em tempo real</p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">IA não configurada</p>
            <p className="text-xs text-yellow-700">
              Usando análises simuladas. 
              <button 
                onClick={() => navigate('/integrations')}
                className="ml-1 underline hover:text-yellow-900 inline-flex items-center gap-1"
              >
                <Key className="w-3 h-3" />
                Configure a OpenAI
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/processes/new")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Adicionar Processo</h3>
              <p className="text-sm text-muted-foreground">Upload de dados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/analyses")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold">Nova Análise</h3>
              <p className="text-sm text-muted-foreground">Criar relatório</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/projects")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <FolderKanban className="h-6 w-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Novo Projeto</h3>
              <p className="text-sm text-muted-foreground">Organizar estudos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistema de Pesquisa Jurídica */}
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Search className="w-6 h-6 text-primary" />
          Pesquisa Jurídica Avançada
        </h2>
        
        {/* Barra de busca principal */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar jurisprudência, legislação, súmulas, doutrinas..."
            className="w-full pl-12 pr-32 py-6 text-lg"
          />
          <Button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => navigate("/pesquisa")}
          >
            Pesquisar
          </Button>
        </div>

        {/* Tabs de categorias */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['Tudo', 'Jurisprudência', 'Legislação', 'Súmulas', 'Doutrinas', 'Precedentes', 'Modelos'].map(tab => (
            <Button
              key={tab}
              variant="outline"
              onClick={() => navigate("/pesquisa")}
              className="whitespace-nowrap"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Filtros rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select 
            value={selectedTribunal}
            onChange={(e) => setSelectedTribunal(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="">Tribunal</option>
            <option value="STF">STF</option>
            <option value="STJ">STJ</option>
            <option value="TST">TST</option>
            <option value="TJSP">TJSP</option>
            <option value="TRT 2ª">TRT 2ª</option>
          </select>
          
          <select 
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="">Área do Direito</option>
            <option value="Trabalhista">Trabalhista</option>
            <option value="Cível">Cível</option>
            <option value="Criminal">Criminal</option>
            <option value="Tributário">Tributário</option>
            <option value="Família">Família</option>
          </select>
          
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="">Período</option>
            <option value="1w">Última semana</option>
            <option value="1m">Último mês</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último ano</option>
            <option value="5y">Últimos 5 anos</option>
          </select>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2"
            onClick={() => {
              if (selectedTribunal || selectedArea || selectedPeriod) {
                navigate(`/pesquisa?tribunal=${selectedTribunal}&area=${selectedArea}&periodo=${selectedPeriod}`);
              }
            }}
          >
            <Filter className="w-4 h-4" />
            Mais Filtros
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Processos"
          value={stats.totalProcesses}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Taxa de Sucesso"
          value={`${stats.successRate}%`}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Tempo Médio"
          value={`${stats.avgDuration}d`}
          icon={Clock}
          trend={{ value: 8, isPositive: false }}
        />
        <StatCard
          title="Valor Médio"
          value={`R$ ${stats.avgAmount.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Prediction Calculator */}
      <div>
        <PredictionCalculator />
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resultData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resultData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processos por Tipo de Ação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={actionTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
          </div>
        </div>

        {/* Alertas Jurídicos */}
        <div>
          <AlertasJuridicos />
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.totalProcesses === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhum processo cadastrado ainda</p>
                <Button className="mt-4" onClick={() => navigate("/processes/new")}>
                  Adicionar Primeiro Processo
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Visualize seus processos na página de Processos
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
