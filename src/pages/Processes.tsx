import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Processes() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState<string>("all");
  const [filterActionType, setFilterActionType] = useState<string>("all");

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
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProcesses(data || []);
    } catch (error) {
      console.error("Error loading processes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os processos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getResultBadge = (result: string) => {
    const variants: any = {
      'procedente': 'default',
      'improcedente': 'destructive',
      'parcial_procedente': 'secondary',
      'pendente': 'outline'
    };

    const labels: any = {
      'procedente': 'Procedente',
      'improcedente': 'Improcedente',
      'parcial_procedente': 'Parcial',
      'pendente': 'Pendente'
    };

    return (
      <Badge variant={variants[result] || 'outline'}>
        {labels[result] || result}
      </Badge>
    );
  };

  const getActionTypeLabel = (type: string) => {
    const labels: any = {
      'trabalhista': 'Trabalhista',
      'civel': 'Cível',
      'criminal': 'Criminal',
      'tributario': 'Tributário',
      'administrativo': 'Administrativo'
    };
    return labels[type] || type;
  };

  const filteredProcesses = processes.filter(p => {
    const matchesSearch = p.process_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.plaintiff.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.defendant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = filterResult === 'all' || p.result === filterResult;
    const matchesActionType = filterActionType === 'all' || p.action_type === filterActionType;
    
    return matchesSearch && matchesResult && matchesActionType;
  });

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
          <h1 className="text-3xl font-bold">Processos</h1>
          <p className="text-muted-foreground">Gerencie todos os seus processos jurídicos</p>
        </div>
        <Button onClick={() => navigate("/processes/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{processes.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {processes.filter(p => p.status === 'em_andamento').length}
            </div>
            <div className="text-sm text-muted-foreground">Em Andamento</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {processes.filter(p => p.status === 'concluido').length}
            </div>
            <div className="text-sm text-muted-foreground">Concluídos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {processes.filter(p => p.status === 'suspenso').length}
            </div>
            <div className="text-sm text-muted-foreground">Suspensos</div>
          </CardContent>
        </Card>
      </div>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <CardTitle>Lista de Processos ({filteredProcesses.length})</CardTitle>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número, parte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterResult} onValueChange={setFilterResult}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="procedente">Procedente</SelectItem>
                    <SelectItem value="improcedente">Improcedente</SelectItem>
                    <SelectItem value="parcial_procedente">Parcial</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterActionType} onValueChange={setFilterActionType}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Tipo de Ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="civel">Cível</SelectItem>
                    <SelectItem value="criminal">Criminal</SelectItem>
                    <SelectItem value="tributario">Tributário</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredProcesses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhum processo encontrado</p>
                <Button className="mt-4" onClick={() => navigate("/processes/new")}>
                  Adicionar Primeiro Processo
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Réu</TableHead>
                      <TableHead>Tribunal</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProcesses.map((process) => (
                      <TableRow 
                        key={process.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/processes/${process.id}`)}
                      >
                        <TableCell className="font-mono text-sm">
                          {process.process_number}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getActionTypeLabel(process.action_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>{process.plaintiff}</TableCell>
                        <TableCell>{process.defendant}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {process.tribunal}
                        </TableCell>
                        <TableCell>{getResultBadge(process.result)}</TableCell>
                        <TableCell className="text-right">
                          {process.amount 
                            ? `R$ ${parseFloat(process.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(process.distribution_date).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
