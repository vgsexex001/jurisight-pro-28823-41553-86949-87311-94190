import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [historico, setHistorico] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistorico(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      salvarNoHistorico(query);
      setShowSuggestions(false);
    }
  };

  const salvarNoHistorico = (termo: string) => {
    const novoHistorico = [termo, ...historico.filter(h => h !== termo)].slice(0, 10);
    setHistorico(novoHistorico);
    localStorage.setItem('searchHistory', JSON.stringify(novoHistorico));
  };

  const limparHistorico = () => {
    setHistorico([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder || "Ex: 'direito à desconexão trabalho remoto', 'súmula 331 TST', 'lei 13.467/2017'"}
          className="pl-14 pr-32 py-6 text-lg"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-32 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <Button 
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Search className="w-5 h-5 mr-2" />
          Buscar
        </Button>
      </div>

      {showSuggestions && historico.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium">Buscas Recentes</span>
            <button
              onClick={limparHistorico}
              className="text-xs text-primary hover:text-primary/80"
            >
              Limpar
            </button>
          </div>
          {historico.map((termo, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(termo);
                onSearch(termo);
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 border-b border-border last:border-0"
            >
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{termo}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
