import { FileText, ExternalLink } from 'lucide-react';
import type { LegislationResult } from '../types/legal-search.types';

interface LegislationCardProps {
  data: LegislationResult;
}

export const LegislationCard = ({ data }: LegislationCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-all hover:-translate-y-0.5 duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-success-600" />
          </div>
          <div>
            <span className="text-xs font-semibold text-success-600 bg-success-50 px-2 py-1 rounded uppercase">
              {data.type}
            </span>
            <p className="text-xs text-neutral-500 mt-1">{data.number}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          data.status === 'vigente' 
            ? 'bg-green-100 text-green-700'
            : data.status === 'revogada'
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {data.status}
        </span>
      </div>

      <h3 className="text-lg font-bold text-neutral-900 mb-2">
        {data.title}
      </h3>

      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
        {data.ementa}
      </p>

      {data.amendments && data.amendments.length > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-warning-800 mb-1">Alterações:</p>
          {data.amendments.map((amendment, index) => (
            <p key={index} className="text-xs text-warning-700">
              • {amendment}
            </p>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{new Date(data.date).toLocaleDateString('pt-BR')}</span>
        
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
        >
          Ver texto completo
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
