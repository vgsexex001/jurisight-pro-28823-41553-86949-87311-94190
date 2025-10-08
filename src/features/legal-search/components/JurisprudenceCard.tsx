import { Scale, Download, Share2, ExternalLink } from 'lucide-react';
import type { JurisprudenceResult } from '../types/legal-search.types';

interface JurisprudenceCardProps {
  data: JurisprudenceResult;
}

export const JurisprudenceCard = ({ data }: JurisprudenceCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-all hover:-translate-y-0.5 duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Scale className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
              {data.court}
            </span>
            <p className="text-xs text-neutral-500 mt-1">{data.caseNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <Download className="w-4 h-4 text-neutral-600" />
          </button>
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <Share2 className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2">
        {data.title}
      </h3>

      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
        {data.summary}
      </p>

      <div className="flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-4">
          <span>Relator: {data.relator}</span>
          <span>{new Date(data.date).toLocaleDateString('pt-BR')}</span>
        </div>
        
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
        >
          Ver completo
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {data.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100">
          {data.keywords.slice(0, 4).map((keyword, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
