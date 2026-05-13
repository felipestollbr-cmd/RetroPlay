import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Smartphone, Disc, Lock } from 'lucide-react';
import type { ConsoleInfo } from '../lib/consoles';
import { getAvailableConsoles } from '../lib/subscription';

const iconMap: Record<string, React.ElementType> = {
  'gamepad-2': Gamepad2,
  smartphone: Smartphone,
  disc: Disc,
};

interface ConsoleCardProps {
  console: ConsoleInfo;
  index: number;
}

export default function ConsoleCard({ console: c, index }: ConsoleCardProps) {
  const Icon = iconMap[c.icon] || Gamepad2;
  const available = getAvailableConsoles().includes(c.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={available ? `/console/${c.id}` : '/plans'}
        className="group block relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 ${!available ? 'opacity-40 grayscale' : ''}`}>
              {c.imageUrl ? (
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${c.gradient}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="flex items-center gap-2">
              {!available && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
                  <Lock className="w-3 h-3" />
                  Pro
                </span>
              )}
              <span className="text-xs font-medium text-white/30 bg-white/5 px-3 py-1 rounded-full">
                {c.year}
              </span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
            {c.shortName}
          </h3>
          <p className="text-sm text-white/40 mb-3">{c.manufacturer}</p>
          <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
            {c.description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/30 group-hover:text-indigo-400 transition-colors">
            <span>{available ? 'Ver jogos' : 'Desbloquear'}</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
