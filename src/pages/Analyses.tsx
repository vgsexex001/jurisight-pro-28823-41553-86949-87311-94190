import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, Clock, DollarSign, Target, Download, FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { toast } from "@/hooks/use-toast";

export default function Analyses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processes, setProcesses] = useState<any[]>([]);
  const [period, setPeriod] = useState("6");

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    await loadProcesses(session.user.id);
  };

  const loadProcesses = async (userId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("processes")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      setProcesses(data || []);
    } catch (error) {
      console.error("Error loading processes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Análises
  const totalProcesses = processes.length;
  const procedentes = processes.filter(p => p.result === 'procedente').length;
  const successRate = totalProcesses > 0 ? ((procedentes / totalProcesses) * 100).toFixed(1) : 0;
  
  const processesWithDates = processes.filter(p => p.judgment_date && p.distribution_date);
  const avgDuration = processesWithDates.length > 0
    ? Math.round(
        processesWithDates.reduce((acc, p) => {
          const start = new Date(p.distribution_date);
          const end = new Date(p.judgment_date);
          return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / processesWithDates.length
      )
    : 0;

  const processesWithAmount = processes.filter(p => p.amount);
  const avgAmount = processesWithAmount.length > 0
    ? processesWithAmount.reduce((acc, p) => acc + Number(p.amount), 0) / processesWithAmount.length
    : 0;

  // Dados por tribunal
  const tribunalData = Object.entries(
    processes.reduce((acc, p) => {
      if (!acc[p.tribunal]) acc[p.tribunal] = { total: 0, procedentes: 0 };
      acc[p.tribunal].total++;
      if (p.result === 'procedente') acc[p.tribunal].procedentes++;
      return acc;
    }, {} as any)
  ).map(([tribunal, data]: any) => ({
    tribunal: tribunal.substring(0, 15),
    taxa: ((data.procedentes / data.total) * 100).toFixed(1),
  })).slice(0, 5);

  // Tempo médio por tipo
  const typeTimeData = Object.entries(
    processes.reduce((acc, p) => {
      if (!p.judgment_date || !p.distribution_date) return acc;
      const days = (new Date(p.judgment_date).getTime() - new Date(p.distribution_date).getTime()) / (1000 * 60 * 60 * 24);
      if (!acc[p.action_type]) acc[p.action_type] = { total: 0, count: 0 };
      acc[p.action_type].total += days;
      acc[p.action_type].count++;
      return acc;
    }, {} as any)
  ).map(([type, data]: any) => ({
    tipo: type.charAt(0).toUpperCase() + type.slice(1),
    dias: Math.round(data.total / data.count),
  }));

  // Distribuição por status
  const statusData = Object.entries(
    processes.reduce((acc, p) => {
      const status = p.status || 'em_andamento';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as any)
  ).map(([status, count]) => ({
    name: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
    value: count,
  }));

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  const insights = [
    { 
      title: "Melhor Tribunal",
      description: tribunalData.length > 0 ? `${tribunalData[0].tribunal} com ${tribunalData[0].taxa}% de sucesso` : "Sem dados"
    },
    { 
      title: "Tipo Mais Rápido",
      description: typeTimeData.length > 0 ? `${typeTimeData[0].tipo} (${typeTimeData[0].dias} dias)` : "Sem dados"
    },
    { 
      title: "Período de Análise",
      description: `Últimos ${period} meses analisados`
    },
    { 
      title: "Tendência",
      description: Number(successRate) > 60 ? "Taxa de sucesso acima da média" : "Oportunidade de melhoria"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Análises Avançadas</h1>
          <p className="text-muted-foreground">Insights inteligentes dos seus processos</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 mês</SelectItem>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">1 ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Taxa de Sucesso"
          value={`${successRate}%`}
          icon={Target}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Tempo Médio"
          value={`${avgDuration}d`}
          icon={Clock}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          trend={{ value: 8.1, isPositive: false }}
        />
        <StatCard
          title="Valor Médio"
          value={`R$ ${(avgAmount / 1000).toFixed(0)}k`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-amber-500 to-amber-600 text-white"
          trend={{ value: 12.4, isPositive: true }}
        />
        <StatCard
          title="Total Processos"
          value={totalProcesses}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Sucesso por Tribunal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tribunalData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="tribunal" width={100} />
                <Tooltip />
                <Bar dataKey="taxa" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dias" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processos por Fase</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights Inteligentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exportar Análises</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                PowerPoint
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
