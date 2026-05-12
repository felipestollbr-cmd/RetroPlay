import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Filter } from 'lucide-react';
import { PROVIDERS } from '../lib/providers';

interface ProviderFilterProps {
  selectedProviders: string[];
  onChange: (providers: string[]) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  freeOnly: boolean;
  onFreeOnlyChange: (v: boolean) => void;
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Populares' },
  { value: 'rating', label: 'Melhor Avaliados' },
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'name', label: 'A-Z' },
];

export default function ProviderFilter({
  selectedProviders,
  onChange,
  selectedSort,
  onSortChange,
  freeOnly,
  onFreeOnlyChange,
}: ProviderFilterProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleProvider = (id: string) => {
    if (selectedProviders.includes(id)) {
      onChange(selectedProviders.filter((p) => p !== id));
    } else {
      onChange([...selectedProviders, id]);
    }
  };

  const selectAll = () => onChange(PROVIDERS.map((p) => p.id));
  const clearAll = () => onChange([]);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-all border border-white/10"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {selectedProviders.length < PROVIDERS.length && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedSort === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onFreeOnlyChange(!freeOnly)}
          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
            freeOnly
              ? 'bg-green-600/20 text-green-400 border border-green-600/30'
              : 'bg-white/5 text-white/40 hover:text-white/60 border border-white/10'
          }`}
        >
          Gratuitos
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/60">Providers</span>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-xs text-indigo-400 hover:text-indigo-300">
                Todos
              </button>
              <button onClick={clearAll} className="text-xs text-white/30 hover:text-white/50">
                Nenhum
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROVIDERS.map((provider) => {
              const selected = selectedProviders.includes(provider.id);
              return (
                <button
                  key={provider.id}
                  onClick={() => toggleProvider(provider.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selected
                      ? 'text-white border'
                      : 'bg-white/5 text-white/30 hover:text-white/50 border border-transparent'
                  }`}
                  style={
                    selected
                      ? {
                          backgroundColor: provider.color + '30',
                          borderColor: provider.color + '60',
                        }
                      : {}
                  }
                >
                  {selected ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-30" />}
                  {provider.name}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
