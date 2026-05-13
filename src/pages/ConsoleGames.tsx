import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Search } from 'lucide-react';
import { getConsoleById } from '../lib/consoles';
import { getGamesForConsole } from '../lib/gamesDb';
import type { GameEntry } from '../lib/gamesDb';
import type { CuratedGame } from '../lib/providers';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import { canPlay, incrementPlay, getAvailableConsoles } from '../lib/subscription';

export default function ConsoleGames() {
  const { consoleId } = useParams<{ consoleId: string }>();
  const navigate = useNavigate();
  const consoleInfo = getConsoleById(consoleId || '');
  const [searchQuery, setSearchQuery] = useState('');

  const isAvailable = consoleId ? getAvailableConsoles().includes(consoleId) : false;

  const allGames = useMemo(() => {
    if (!consoleId) return [];
    return getGamesForConsole(consoleId);
  }, [consoleId]);

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return allGames;
    const q = searchQuery.toLowerCase();
    return allGames.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.genre.toLowerCase().includes(q)
    );
  }, [allGames, searchQuery]);

  const handlePlay = (game: CuratedGame | GameEntry) => {
    if (!canPlay()) {
      navigate('/plans');
      return;
    }
    incrementPlay();
    if (!consoleId) return;
    navigate(`/play/${consoleId}/${game.slug}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (!consoleInfo) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-lg mb-4">Console não encontrado</p>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Console Bloqueado</h2>
          <p className="text-white/40 mb-2">
            {consoleInfo.shortName} não está disponível no seu plano atual.
          </p>
          <p className="text-white/30 text-sm mb-6">
            Faça upgrade para desbloquear este console e muito mais.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl text-white font-bold transition-all shadow-lg shadow-amber-500/20"
          >
            Ver Planos
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="relative overflow-hidden pt-8 pb-12">
        <div className={`absolute inset-0 bg-gradient-to-br ${consoleInfo.gradient} opacity-5`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                  {consoleInfo.shortName}
                </h1>
                <p className="text-white/40">
                  {consoleInfo.name} • {consoleInfo.manufacturer} • {consoleInfo.year}
                </p>
              </div>
              <div className="w-full sm:w-80">
                <SearchBar
                  placeholder={`Buscar em ${consoleInfo.shortName}...`}
                  onSearch={handleSearch}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg">
              {searchQuery ? 'Nenhum jogo encontrado' : 'Nenhum jogo disponível'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-white/40 text-sm mb-6">
              {filteredGames.length} jogo{filteredGames.length !== 1 ? 's' : ''} disponível{filteredGames.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredGames.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} onPlay={handlePlay} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
