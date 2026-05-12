import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import type { GameEntry } from '../lib/gamesDb';

interface GameCardProps {
  game: GameEntry;
  index: number;
  onPlay: (game: GameEntry) => void;
}

export default function GameCard({ game, index, onPlay }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => onPlay(game)}
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/[0.06] group-hover:border-white/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/5">
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10';
                fallback.innerHTML = `<svg class="w-10 h-10 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
            <Play className="w-10 h-10 text-white/15" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl">
            <Play className="w-6 h-6 text-[#0f0f1a] fill-current ml-0.5" />
          </div>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white">{game.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors line-clamp-1">
          {game.title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-white/30">{game.year}</span>
          <span className="text-xs text-white/20">{game.genre}</span>
        </div>
      </div>
    </motion.div>
  );
}
