import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Bluetooth, Sparkles, Search, Loader2, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchAllProviders, mergeAndDeduplicate, sortGames, filterGames, PROVIDERS } from '../lib/providers';
import type { CuratedGame, ProviderSearchOptions } from '../lib/providers';
import { CONSOLES } from '../lib/consoles';
import { getAvailableConsoles } from '../lib/subscription';
import CuratedGameCard from '../components/CuratedGameCard';
import GameCarousel from '../components/GameCarousel';
import ProviderFilter from '../components/ProviderFilter';
import SearchBar from '../components/SearchBar';
import AISearch from '../components/AISearch';

export default function Discovery() {
  const [games, setGames] = useState<CuratedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviders, setSelectedProviders] = useState(PROVIDERS.map((p) => p.id));
  const [selectedSort, setSelectedSort] = useState('popular');
  const [freeOnly, setFreeOnly] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const loadGames = useCallback(async () => {
    setLoading(true);
    try {
      const options: ProviderSearchOptions = {
        limit: 50,
        sortBy: selectedSort as any,
      };
      const results = await searchAllProviders(options);
      const merged = mergeAndDeduplicate(results);
      const sorted = sortGames(merged, selectedSort);
      setGames(sorted);
    } catch (err) {
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSort]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredGames = filterGames(games, {
    query: searchQuery,
    freeOnly,
  });

  const browserGames = games.filter((g) => g.isBrowserGame).slice(0, 15);
  const freeGames = games.filter((g) => g.isFree).slice(0, 15);
  const classicGames = games.filter((g) => g.isAbandonware).slice(0, 15);
  const indieGames = games.filter((g) => g.provider === 'itchio').slice(0, 15);

  const availableConsoles = getAvailableConsoles();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Curadoria de Jogos da Internet</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              O <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Stremio</span> dos Games
            </h1>
            <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-8 leading-relaxed">
              Não hospedamos jogos. Varremos a internet inteira e trazemos os melhores jogos
              gratuitos, abandonware, indie e browser games em um só lugar.
            </p>

            <div className="max-w-xl mx-auto mb-8">
              <SearchBar placeholder="Buscar jogos em toda a internet..." onSearch={handleSearch} />
            </div>

            <button
              onClick={() => setShowAI(!showAI)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {showAI ? 'Fechar Busca IA' : 'Não lembra o nome? Use IA'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* AI Search */}
      {showAI && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pb-12"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AISearch />
          </div>
        </motion.section>
      )}

      {/* Consoles Retro Section */}
      {!searchQuery && (
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Consoles Retro</h2>
                <p className="text-white/40 text-sm">Jogue clássicos com emulador no navegador</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {CONSOLES.map((c) => {
                const isAvailable = availableConsoles.includes(c.id);
                return (
                  <Link
                    key={c.id}
                    to={isAvailable ? `/console/${c.id}` : '/plans'}
                    className={`group relative p-4 rounded-2xl border transition-all duration-300 ${
                      isAvailable
                        ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.06]'
                        : 'bg-white/[0.01] border-white/[0.04] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-center text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                      {c.shortName}
                    </p>
                    <p className="text-center text-[10px] text-white/30 mt-0.5">{c.year}</p>
                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                          PRO
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Carousels */}
      {!searchQuery && !loading && (
        <div className="pb-8">
          {browserGames.length > 0 && (
            <GameCarousel title="Jogos no Navegador" games={browserGames} />
          )}
          {freeGames.length > 0 && (
            <GameCarousel title="Jogos Gratuitos" games={freeGames} />
          )}
          {classicGames.length > 0 && (
            <GameCarousel title="Clássicos & Abandonware" games={classicGames} />
          )}
          {indieGames.length > 0 && (
            <GameCarousel title="Indie Games" games={indieGames} />
          )}
        </div>
      )}

      {/* Filter + Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos os Jogos'}
              </h2>
              <p className="text-white/40 text-sm">
                {filteredGames.length} jogos encontrados em {PROVIDERS.length} providers
              </p>
            </div>
          </div>

          <ProviderFilter
            selectedProviders={selectedProviders}
            onChange={setSelectedProviders}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            freeOnly={freeOnly}
            onFreeOnlyChange={setFreeOnly}
          />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
              <p className="text-white/40">Varrendo a internet por jogos...</p>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">Nenhum jogo encontrado</p>
              <p className="text-white/20 text-sm mt-2">Tente ajustar os filtros ou fazer uma nova busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredGames.map((game, index) => (
                <CuratedGameCard key={game.id} game={game} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: '4 Providers',
                desc: 'Steam, itch.io, Internet Archive e Browser Games. Tudo em um só lugar.',
              },
              {
                icon: Bluetooth,
                title: 'Controle Bluetooth',
                desc: 'Conecte seu controle e jogue jogos de navegador e abandonware como em um console.',
              },
              {
                icon: Sparkles,
                title: 'Busca por IA',
                desc: 'Descreva o jogo e a IA Gemini encontra para você, mesmo sem saber o nome.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
