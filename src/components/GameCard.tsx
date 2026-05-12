import { motion } from 'framer-motion';
import { Play, Star, Gamepad2 } from 'lucide-react'; // 'G' maiúsculo
import { useState } from 'react';
import type { CuratedGame } from '../lib/providers'; 

interface GameCardProps {
  game: CuratedGame;
  index: number;
  onPlay: (game: CuratedGame) => void;
}

export default function GameCard({ game, index, onPlay }: GameCardProps) {
  const [imageError, setImageError] = useState(false);

  // Proteção para evitar crash se 'game' estiver indefinido
  if (!game) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => onPlay(game)}
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/[0.06] group-hover:border-indigo-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/10">
        
        {!imageError && game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/20 to-black gap-2">
            <Play className="w-10 h-10 text-white/10" />
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Sem Capa</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-2 left-2 bg-indigo-600 text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-tighter text-white opacity-90">
          {game.consoleId}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-white fill-current ml-0.5" />
          </div>
        </div>

        {/* Verificação segura para o rating */}
        {typeof game.rating === 'number' && game.rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-white">{game.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 px-1">
        <h3 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors line-clamp-1">
          {game.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-white/40">{game.year || 'N/A'}</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="text-[10px] font-medium text-white/40 truncate max-w-[80px]">
              {game.genre || 'Classic'}
            </span>
          </div>
          <div className="text-indigo-400/50">
             <Gamepad2 className="w-3 h-3" /> 
          </div>
        </div>
      </div>
    </motion.div>
  );
}