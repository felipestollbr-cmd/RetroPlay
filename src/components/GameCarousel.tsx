import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CuratedGame } from '../lib/providers';

interface GameCarouselProps {
  title: string;
  games: CuratedGame[];
}

export default function GameCarousel({ title, games }: GameCarouselProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  if (games.length === 0) return null;

  return (
    <div className="relative mb-10">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-10 lg:px-16">
        <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-10 lg:px-16 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className="group relative flex-shrink-0 w-[160px] sm:w-[200px] cursor-pointer"
            onClick={() => navigate(`/game/${game.id}`)}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/[0.06] group-hover:border-white/20 transition-all duration-300 group-hover:shadow-xl">
              {game.coverUrl ? (
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white/20" />
                </div>
              )}

              {game.isFree && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-green-500/80 text-[10px] font-bold text-white">
                  FREE
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-lg self-start">
                  <Play className="w-4 h-4 text-[#0f0f1a] fill-current ml-0.5" />
                </button>
                <p className="text-white text-xs font-bold line-clamp-1">{game.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-amber-400 text-xs flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {game.rating.toFixed(1)}
                  </span>
                  <span className="text-white/40 text-xs">{game.providerName}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
