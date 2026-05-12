import { motion } from 'framer-motion';
import { Play, ExternalLink, Star, Download, Globe, Heart } from 'lucide-react';
import type { CuratedGame } from '../lib/providers';
import { useNavigate } from 'react-router-dom';

interface CuratedGameCardProps {
  game: CuratedGame;
  index: number;
  variant?: 'grid' | 'list' | 'hero';
}

export default function CuratedGameCard({ game, index, variant = 'grid' }: CuratedGameCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  const providerColors: Record<string, string> = {
    steam: '#1b2838',
    itchio: '#fa5c5c',
    archive: '#666666',
    browser: '#4ade80',
  };

  const providerColor = providerColors[game.provider] || '#6366f1';

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        onClick={handleClick}
        className="group relative cursor-pointer rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 aspect-[3/4] sm:aspect-auto sm:h-full overflow-hidden shrink-0">
            {game.coverUrl ? (
              <img
                src={game.coverUrl}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <Play className="w-8 h-8 text-white/20" />
              </div>
            )}
          </div>
          <div className="p-5 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: providerColor + '80' }}
              >
                {game.providerName}
              </span>
              {game.isFree && (
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">
                  Free
                </span>
              )}
              {game.isOpenSource && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">
                  Open Source
                </span>
              )}
              {game.isAbandonware && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                  Abandonware
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
              {game.title}
            </h3>
            <p className="text-white/40 text-sm line-clamp-2 mb-3">{game.description}</p>
            <div className="flex items-center gap-3 text-xs text-white/30">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {game.rating.toFixed(1)}
              </span>
              {game.releaseDate && (
                <span>{new Date(game.releaseDate).getFullYear()}</span>
              )}
              {game.developer && <span>{game.developer}</span>}
              <span className="flex items-center gap-1">
                {game.isBrowserGame ? <Globe className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                {game.isBrowserGame ? 'Browser' : 'Download'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={handleClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/[0.06] group-hover:border-white/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/5">
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
            <Play className="w-10 h-10 text-white/15" />
          </div>
        )}

        {/* Provider badge */}
        <div className="absolute top-2 left-2">
          <span
            className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-white backdrop-blur-sm"
            style={{ backgroundColor: providerColor + 'CC' }}
          >
            {game.providerName}
          </span>
        </div>

        {/* Free badge */}
        {game.isFree && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-lg bg-green-500/80 backdrop-blur-sm text-[10px] font-bold text-white">
              FREE
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl">
            {game.isBrowserGame ? (
              <Play className="w-6 h-6 text-[#0f0f1a] fill-current ml-1" />
            ) : (
              <ExternalLink className="w-6 h-6 text-[#0f0f1a]" />
            )}
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-sm font-bold text-white line-clamp-1">{game.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-amber-400 text-xs flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400" />
              {game.rating.toFixed(1)}
            </span>
            {game.genre[0] && (
              <span className="text-white/40 text-xs">{game.genre[0]}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2.5">
        <h3 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors line-clamp-1">
          {game.title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-white/30">{game.providerName}</span>
          {game.platform[0] && (
            <span className="text-[10px] text-white/20">
              {game.platform[0]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
