import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function NewProcess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    process_number: "",
    tribunal: "",
    vara: "",
    action_type: "",
    plaintiff: "",
    defendant: "",
    distribution_date: "",
    judgment_date: "",
    result: "pendente",
    amount: "",
    summary: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const processData = {
        process_number: formData.process_number,
        tribunal: formData.tribunal,
        vara: formData.vara || null,
        action_type: formData.action_type as "trabalhista" | "civel" | "criminal" | "tributario" | "administrativo",
        plaintiff: formData.plaintiff,
        defendant: formData.defendant,
        distribution_date: formData.distribution_date,
        judgment_date: formData.judgment_date || null,
        result: formData.result as "procedente" | "improcedente" | "parcial_procedente" | "pendente",
        amount: formData.amount ? parseFloat(formData.amount) : null,
        summary: formData.summary || null,
        user_id: session.user.id
      };

      const { error } = await (supabase as any).from("processes").insert([processData]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Processo cadastrado com sucesso",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Error creating process:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o processo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/processes")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Processo</h1>
          <p className="text-muted-foreground">Adicione um novo processo ao sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Processo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="process_number">Número do Processo *</Label>
                <Input
                  id="process_number"
                  required
                  value={formData.process_number}
                  onChange={(e) => handleChange("process_number", e.target.value)}
                  placeholder="0000000-00.0000.0.00.0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tribunal">Tribunal *</Label>
                <Input
                  id="tribunal"
                  required
                  value={formData.tribunal}
                  onChange={(e) => handleChange("tribunal", e.target.value)}
                  placeholder="Ex: TRT 2ª Região"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vara">Vara</Label>
                <Input
                  id="vara"
                  value={formData.vara}
                  onChange={(e) => handleChange("vara", e.target.value)}
                  placeholder="Ex: 1ª Vara do Trabalho"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action_type">Tipo de Ação *</Label>
                <Select
                  value={formData.action_type}
                  onValueChange={(value) => handleChange("action_type", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="civel">Cível</SelectItem>
                    <SelectItem value="criminal">Criminal</SelectItem>
                    <SelectItem value="tributario">Tributário</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plaintiff">Autor *</Label>
                <Input
                  id="plaintiff"
                  required
                  value={formData.plaintiff}
                  onChange={(e) => handleChange("plaintiff", e.target.value)}
                  placeholder="Nome do autor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defendant">Réu *</Label>
                <Input
                  id="defendant"
                  required
                  value={formData.defendant}
                  onChange={(e) => handleChange("defendant", e.target.value)}
                  placeholder="Nome do réu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distribution_date">Data de Distribuição *</Label>
                <Input
                  id="distribution_date"
                  type="date"
                  required
                  value={formData.distribution_date}
                  onChange={(e) => handleChange("distribution_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="judgment_date">Data de Julgamento</Label>
                <Input
                  id="judgment_date"
                  type="date"
                  value={formData.judgment_date}
                  onChange={(e) => handleChange("judgment_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Resultado</Label>
                <Select
                  value={formData.result}
                  onValueChange={(value) => handleChange("result", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="procedente">Procedente</SelectItem>
                    <SelectItem value="improcedente">Improcedente</SelectItem>
                    <SelectItem value="parcial_procedente">Parcial Procedente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Resumo/Observações</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => handleChange("summary", e.target.value)}
                placeholder="Adicione informações relevantes sobre o processo..."
                rows={4}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/processes")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Processo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
