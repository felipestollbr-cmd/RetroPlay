import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Search } from 'lucide-react';
import { searchAllProviders, mergeAndDeduplicate, sortGames, filterGames } from '../lib/providers';
import type { CuratedGame, ProviderSearchOptions } from '../lib/providers';
import CuratedGameCard from '../components/CuratedGameCard';
import SearchBar from '../components/SearchBar';
import ProviderFilter from '../components/ProviderFilter';
import { PROVIDERS } from '../lib/providers';
import { canSearch, incrementSearch } from '../lib/subscription';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [games, setGames] = useState<CuratedGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState(PROVIDERS.map((p) => p.id));
  const [selectedSort, setSelectedSort] = useState('popular');
  const [freeOnly, setFreeOnly] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    if (!canSearch()) {
      navigate('/plans');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      incrementSearch();
      const options: ProviderSearchOptions = {
        query: searchQuery,
        limit: 100,
      };
      const results = await searchAllProviders(options);
      const merged = mergeAndDeduplicate(results);
      const sorted = sortGames(merged, selectedSort);
      setGames(sorted);
    } catch (err) {
      setError('Erro ao buscar jogos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    performSearch(newQuery);
  };

  const filteredGames = filterGames(games, {
    query: query,
    freeOnly,
  });

  return (
    <div className="min-h-screen pb-20">
      <div className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Buscar Jogos</h1>
            <p className="text-white/40 mb-8">Pesquise em todos os providers simultaneamente</p>
            <SearchBar initialQuery={query} onSearch={handleSearch} placeholder="Digite o nome do jogo..." autoFocus />
          </motion.div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
              <p className="text-white/40">Buscando em todos os providers...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-white/60 mb-4">{error}</p>
              <button onClick={() => performSearch(query)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium">
                Tentar novamente
              </button>
            </div>
          )}

          {searched && !loading && filteredGames.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">Nenhum jogo encontrado para &quot;{query}&quot;</p>
            </div>
          )}

          {!loading && !error && filteredGames.length > 0 && (
            <>
              <ProviderFilter
                selectedProviders={selectedProviders}
                onChange={setSelectedProviders}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                freeOnly={freeOnly}
                onFreeOnlyChange={setFreeOnly}
              />
              <p className="text-white/40 text-sm mb-6">
                {filteredGames.length} resultado{filteredGames.length !== 1 ? 's' : ''} para &quot;{query}&quot;
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredGames.map((game, index) => (
                  <CuratedGameCard key={game.id} game={game} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
