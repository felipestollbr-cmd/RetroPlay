import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TGDBGame, TGDBSearchResult } from '../lib/thegamesdb';
import { getGameCoverUrl } from '../lib/thegamesdb';
import { canPlay, incrementPlay } from '../lib/subscription';

interface HeroBannerProps {
  games: TGDBSearchResult | null;
  consoleId: string;
}

export default function HeroBanner({ games, consoleId }: HeroBannerProps) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const heroGames = games?.data?.games?.slice(0, 5) || [];

  useEffect(() => {
    if (heroGames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroGames.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroGames.length]);

  const handlePlay = (game: TGDBGame) => {
    if (!canPlay()) {
      navigate('/plans');
      return;
    }
    incrementPlay();
    navigate(`/play/${consoleId}/${game.game_title.toLowerCase().replace(/\s+/g, '-')}`);
  };

  if (heroGames.length === 0) return null;

  const game = heroGames[current];
  const coverUrl = getGameCoverUrl(games!, game.id, 'large');

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={game.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: coverUrl ? `url(${coverUrl})` : 'none',
            }}
          >
            {!coverUrl && (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a]/90 via-[#0f0f1a]/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {game.genres?.[0] && (
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-white/80">
                      {game.genres[0].name}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-amber-400 text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {game.rating || '4.5'}
                  </span>
                  <span className="text-white/40 text-sm">
                    {game.release_date ? new Date(game.release_date).getFullYear() : ''}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white mb-4 max-w-2xl leading-tight">
                  {game.game_title}
                </h1>

                <p className="text-white/60 text-sm sm:text-base max-w-xl mb-6 line-clamp-3 leading-relaxed">
                  {game.overview || 'Um clássico jogo retro que definiu uma geração de jogadores.'}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePlay(game)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-[#0f0f1a] rounded-xl font-bold text-sm hover:bg-white/90 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Jogar Agora
                  </button>
                  <button
                    onClick={() => navigate(`/play/${consoleId}/${game.game_title.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    Mais Info
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      {heroGames.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-10 lg:right-16 flex items-center gap-2">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + heroGames.length) % heroGames.length)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {heroGames.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % heroGames.length)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
