import { useState, useEffect } from 'react';
import { Key, RefreshCw, CheckCircle, XCircle, Trash2, Eye, EyeOff, AlertCircle, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface IntegracaoAPI {
  id: string;
  nome: string;
  descricao: string;
  status: 'ativo' | 'inativo' | 'testando';
  apiKey: string;
  tipo: 'openai' | 'jusbrasil' | 'cnj';
  requireApiKey: boolean;
}

export default function Integrations() {
  const [integracoes, setIntegracoes] = useState<IntegracaoAPI[]>([
    {
      id: 'openai',
      nome: 'OpenAI GPT-4',
      descricao: 'IA generativa para análise jurídica inteligente',
      status: 'inativo',
      apiKey: '',
      tipo: 'openai',
      requireApiKey: true
    },
    {
      id: 'jusbrasil',
      nome: 'JusBrasil API',
      descricao: 'Acesso ao banco de jurisprudência do JusBrasil',
      status: 'inativo',
      apiKey: '',
      tipo: 'jusbrasil',
      requireApiKey: true
    },
    {
      id: 'cnj',
      nome: 'CNJ DataJud',
      descricao: 'Dados abertos do Poder Judiciário brasileiro',
      status: 'ativo',
      apiKey: 'PUBLIC',
      tipo: 'cnj',
      requireApiKey: false
    }
  ]);

  const [mostrarChave, setMostrarChave] = useState<{ [key: string]: boolean }>({});
  const [editando, setEditando] = useState<string | null>(null);
  const [chaveTemp, setChaveTemp] = useState('');

  useEffect(() => {
    carregarIntegracoesDoStorage();
  }, []);

  const carregarIntegracoesDoStorage = () => {
    const salvas = localStorage.getItem('integracoes');
    if (salvas) {
      try {
        const integracoesSalvas = JSON.parse(salvas);
        setIntegracoes(prev => prev.map(int => {
          const salva = integracoesSalvas.find((s: any) => s.id === int.id);
          return salva ? { ...int, ...salva } : int;
        }));
      } catch (error) {
        console.error('Erro ao carregar integrações:', error);
      }
    }
  };

  const salvarNoStorage = (integracoesAtualizadas: IntegracaoAPI[]) => {
    try {
      localStorage.setItem('integracoes', JSON.stringify(integracoesAtualizadas));
    } catch (error) {
      console.error('Erro ao salvar integrações:', error);
    }
  };

  const iniciarEdicao = (id: string, apiKey: string) => {
    setEditando(id);
    setChaveTemp(apiKey);
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setChaveTemp('');
  };

  const validarChaveOpenAI = (chave: string): boolean => {
    if (!chave || chave.trim() === '') return false;
    if (!chave.startsWith('sk-')) return false;
    if (chave.length < 20) return false;
    return true;
  };

  const testarConexaoOpenAI = async (apiKey: string): Promise<boolean> => {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.status === 401) {
        throw new Error('API Key inválida ou sem permissões');
      } else if (response.status === 429) {
        throw new Error('Limite de requisições excedido');
      } else if (response.status === 403) {
        throw new Error('API Key sem acesso');
      } else if (!response.ok) {
        throw new Error('Erro ao conectar com OpenAI');
      }

      return true;
    } catch (error: any) {
      console.error('Erro ao testar OpenAI:', error);
      throw error;
    }
  };

  const conectarIntegracao = async (id: string) => {
    const integracao = integracoes.find(i => i.id === id);
    if (!integracao) return;

    const chave = editando === id ? chaveTemp : integracao.apiKey;

    if (id === 'openai') {
      if (!validarChaveOpenAI(chave)) {
        toast({
          title: 'Chave inválida',
          description: 'Formato esperado: sk-... com mínimo de 20 caracteres',
          variant: 'destructive'
        });
        return;
      }
    }

    if (!chave && integracao.requireApiKey) {
      toast({
        title: 'API Key necessária',
        description: 'Por favor, insira uma API Key válida',
        variant: 'destructive'
      });
      return;
    }

    const integracoesAtualizadas = integracoes.map(int =>
      int.id === id ? { ...int, status: 'testando' as const } : int
    );
    setIntegracoes(integracoesAtualizadas);

    try {
      if (id === 'openai') {
        await testarConexaoOpenAI(chave);
      }

      const novasIntegracoes = integracoes.map(int =>
        int.id === id 
          ? { ...int, status: 'ativo' as const, apiKey: chave }
          : int
      );
      
      setIntegracoes(novasIntegracoes);
      salvarNoStorage(novasIntegracoes);
      setEditando(null);
      setChaveTemp('');

      toast({
        title: 'Sucesso!',
        description: `${integracao.nome} conectada com sucesso`,
      });

    } catch (error: any) {
      const integracoesComErro = integracoes.map(int =>
        int.id === id ? { ...int, status: 'inativo' as const } : int
      );
      setIntegracoes(integracoesComErro);

      toast({
        title: 'Erro na conexão',
        description: error.message || 'Não foi possível conectar',
        variant: 'destructive'
      });
    }
  };

  const desconectarIntegracao = (id: string) => {
    const integracao = integracoes.find(i => i.id === id);
    if (!integracao) return;

    const novasIntegracoes = integracoes.map(int =>
      int.id === id 
        ? { ...int, status: 'inativo' as const, apiKey: '' }
        : int
    );

    setIntegracoes(novasIntegracoes);
    salvarNoStorage(novasIntegracoes);
    setEditando(null);
    setChaveTemp('');

    toast({
      title: 'Desconectado',
      description: `${integracao.nome} foi desconectada`,
    });
  };

  const toggleMostrarChave = (id: string) => {
    setMostrarChave(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integrações</h1>
        <p className="text-muted-foreground">Configure APIs externas para expandir as funcionalidades do JuriMetrics Pro</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 font-medium">Sobre a segurança das API Keys</p>
            <p className="text-blue-800 text-sm mt-1">
              Suas chaves são armazenadas localmente no navegador e nunca são enviadas para nossos servidores. 
              Para maior segurança, recomendamos usar chaves com permissões limitadas.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integracoes.map(integracao => (
          <div 
            key={integracao.id} 
            className={`bg-card rounded-lg shadow-md border-2 transition-all ${
              integracao.status === 'ativo' ? 'border-green-300' :
              integracao.status === 'testando' ? 'border-blue-300' :
              'border-border'
            }`}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{integracao.nome}</h3>
                  <p className="text-sm text-muted-foreground">{integracao.descricao}</p>
                </div>
                
                <div className="flex items-center gap-2 ml-3">
                  {integracao.status === 'ativo' && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                  {integracao.status === 'inativo' && (
                    <XCircle className="w-6 h-6 text-muted-foreground" />
                  )}
                  {integracao.status === 'testando' && (
                    <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                  )}
                </div>
              </div>

              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                integracao.status === 'ativo' ? 'bg-green-100 text-green-800' :
                integracao.status === 'testando' ? 'bg-blue-100 text-blue-800' :
                'bg-muted text-muted-foreground'
              }`}>
                {integracao.status === 'ativo' ? '✓ Conectado' :
                 integracao.status === 'testando' ? '⏳ Testando...' :
                 '○ Desconectado'}
              </span>
            </div>

            <div className="p-6">
              {integracao.requireApiKey ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      <Key className="w-4 h-4 inline mr-1" />
                      API Key
                      {integracao.id === 'openai' && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (Formato: sk-...)
                        </span>
                      )}
                    </label>
                    
                    <div className="relative">
                      <input
                        type={mostrarChave[integracao.id] ? 'text' : 'password'}
                        value={editando === integracao.id ? chaveTemp : integracao.apiKey}
                        onChange={(e) => {
                          if (editando === integracao.id) {
                            setChaveTemp(e.target.value);
                          } else {
                            iniciarEdicao(integracao.id, e.target.value);
                          }
                        }}
                        onFocus={() => iniciarEdicao(integracao.id, integracao.apiKey)}
                        placeholder={`Cole sua ${integracao.nome} API Key`}
                        className="w-full px-3 py-2 pr-10 border border-input rounded-lg focus:ring-2 focus:ring-ring bg-background text-sm"
                      />
                      
                      <button
                        type="button"
                        onClick={() => toggleMostrarChave(integracao.id)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {mostrarChave[integracao.id] ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {integracao.id === 'openai' && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Não tem uma chave?{' '}
                        <a 
                          href="https://platform.openai.com/api-keys" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Obter no OpenAI
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {integracao.status === 'ativo' ? (
                      <>
                        <button
                          onClick={() => desconectarIntegracao(integracao.id)}
                          className="flex-1 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Desconectar
                        </button>
                        <button
                          onClick={() => conectarIntegracao(integracao.id)}
                          className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Reconectar/Atualizar"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </>
                    ) : editando === integracao.id ? (
                      <>
                        <button
                          onClick={() => conectarIntegracao(integracao.id)}
                          disabled={integracao.status === 'testando'}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {integracao.status === 'testando' ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Testando...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              Conectar
                            </>
                          )}
                        </button>
                        <button
                          onClick={cancelarEdicao}
                          disabled={integracao.status === 'testando'}
                          className="px-4 py-2 border border-border hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => iniciarEdicao(integracao.id, integracao.apiKey)}
                        className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                      >
                        Configurar
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Integração pública ativa</p>
                </div>
              )}
            </div>

            {integracao.status === 'ativo' && integracao.apiKey && (
              <div className="px-6 py-3 bg-green-50 border-t border-green-100 rounded-b-lg">
                <p className="text-xs text-green-800">
                  ✓ Conectado • Funcionalidades de IA ativas
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-muted border border-border rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">Como obter as API Keys?</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-600" />
              OpenAI GPT-4
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
              <li>Acesse <a href="https://platform.openai.com/signup" target="_blank" className="text-primary hover:underline">platform.openai.com</a></li>
              <li>Crie uma conta ou faça login</li>
              <li>Vá em "API Keys" no menu</li>
              <li>Clique em "Create new secret key"</li>
              <li>Copie a chave (começa com sk-)</li>
              <li>Cole aqui e clique em "Conectar"</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2 ml-6">
              💰 A OpenAI cobra por uso. Verifique os preços antes de usar.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              JusBrasil API
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              Entre em contato com o suporte do JusBrasil para solicitar acesso à API empresarial.
            </p>
          </div>
        </div>
      </div>

      {integracoes.some(i => i.status === 'ativo') && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Integrações Ativas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {integracoes.filter(i => i.status === 'ativo').length}
              </p>
              <p className="text-sm text-gray-600">Integrações ativas</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">100%</p>
              <p className="text-sm text-gray-600">Funcionalidades disponíveis</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {integracoes.find(i => i.id === 'openai')?.status === 'ativo' ? 'Ativo' : 'Mock'}
              </p>
              <p className="text-sm text-gray-600">Modo de IA</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
