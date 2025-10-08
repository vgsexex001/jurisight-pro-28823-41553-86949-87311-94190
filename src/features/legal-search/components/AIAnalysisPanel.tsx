import { Sparkles, Download, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { AIAnalysis } from '../types/legal-search.types';
import toast from 'react-hot-toast';

interface AIAnalysisPanelProps {
  analysis: AIAnalysis;
}

export const AIAnalysisPanel = ({ analysis }: AIAnalysisPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.analysis);
    setCopied(true);
    toast.success('Análise copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const content = `
ANÁLISE JURÍDICA
Data: ${analysis.generatedAt.toLocaleDateString('pt-BR')}
Consulta: ${analysis.query}
Confiança: ${analysis.confidence}%

ANÁLISE:
${analysis.analysis}

FONTES CONSULTADAS:
${analysis.sources.map((s, i) => `
[${i + 1}] ${s.type.toUpperCase()}: ${s.title}
Referência: ${s.reference}
`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-juridica-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Análise exportada!');
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Análise com IA</h3>
            <p className="text-xs text-neutral-600">
              Confiança: {analysis.confidence}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
        <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
          {analysis.analysis}
        </p>
      </div>

      {analysis.sources.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success-600" />
            Fontes Consultadas ({analysis.sources.length}):
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {analysis.sources.map((source, index) => (
              <div key={index} className="text-xs bg-white rounded-lg p-3 border border-neutral-200">
                <div className="flex items-start gap-2 mb-1">
                  <span className="font-bold text-primary-600 flex-shrink-0">
                    [{index + 1}]
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900">{source.title}</p>
                    <p className="text-neutral-500 mt-0.5">{source.reference}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-semibold text-warning-900 mb-2">
            Recomendações:
          </h4>
          <ul className="space-y-1">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="text-xs text-warning-800">
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={handleCopy}
          className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-success-600" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </button>
        <button 
          onClick={handleExport}
          className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>
    </div>
  );
};
