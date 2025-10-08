import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import PesquisaJuridica from "./pages/PesquisaJuridica";
import ModelosPeticoes from "./pages/ModelosPeticoes";
import Alertas from "./pages/Alertas";
import Processes from "./pages/Processes";
import NewProcess from "./pages/NewProcess";
import Analyses from "./pages/Analyses";
import AIAnalysis from "./pages/AIAnalysis";
import Integrations from "./pages/Integrations";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Layout><Index /></Layout>} />
          <Route path="/pesquisa" element={<Layout><PesquisaJuridica /></Layout>} />
          <Route path="/pesquisa-juridica" element={<Layout><PesquisaJuridica /></Layout>} />
          <Route path="/modelos" element={<Layout><ModelosPeticoes /></Layout>} />
          <Route path="/alertas" element={<Layout><Alertas /></Layout>} />
          <Route path="/processes" element={<Layout><Processes /></Layout>} />
          <Route path="/processes/new" element={<Layout><NewProcess /></Layout>} />
          <Route path="/analyses" element={<Layout><Analyses /></Layout>} />
          <Route path="/ai-analysis" element={<Layout><AIAnalysis /></Layout>} />
          <Route path="/integrations" element={<Layout><Integrations /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
