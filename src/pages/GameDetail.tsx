import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, ExternalLink, Download, Star, Calendar, User, Tag, Globe, Heart, Share2, Monitor } from 'lucide-react';
import { searchAllProviders, mergeAndDeduplicate } from '../lib/providers';
import type { CuratedGame } from '../lib/providers';
import { canPlay, incrementPlay } from '../lib/subscription';

export default function GameDetail() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<CuratedGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) return;
      setLoading(true);
      try {
        const results = await searchAllProviders({ limit: 100 });
        const allGames = mergeAndDeduplicate(results);
        const found = allGames.find((g) => g.id === gameId);
        if (found) {
          setGame(found);
        }
      } catch (err) {
        console.error('Error loading game:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGame();
  }, [gameId]);

  const handlePlay = () => {
    if (!canPlay()) {
      navigate('/plans');
      return;
    }
    incrementPlay();
    if (game?.isBrowserGame && game.playUrl) {
      setPlaying(true);
    } else if (game?.playUrl) {
      window.open(game.playUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (game?.downloadUrl) {
      window.open(game.downloadUrl, '_blank');
    }
  };

  const providerColors: Record<string, string> = {
    steam: '#1b2838',
    itchio: '#fa5c5c',
    archive: '#666666',
    browser: '#4ade80',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-white/60 text-lg mb-4">Jogo não encontrado</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300">Voltar ao início</Link>
      </div>
    );
  }

  const providerColor = providerColors[game.provider] || '#6366f1';

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        {game.bannerUrl || game.coverUrl ? (
          <img
            src={game.bannerUrl || game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/70 to-[#0f0f1a]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a]/80 to-transparent" />

        <div className="absolute top-4 left-4 sm:top-6 sm:left-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cover + Actions */}
          <div className="lg:w-72 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl"
            >
              {game.coverUrl ? (
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-12 h-12 text-white/20" />
                </div>
              )}
            </motion.div>

            <div className="mt-4 space-y-2">
              {game.isBrowserGame && game.playUrl && (
                <button
                  onClick={handlePlay}
                  className="w-full py-3.5 bg-white text-[#0f0f1a] rounded-xl font-bold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Jogar no Navegador
                </button>
              )}

              {game.playUrl && !game.isBrowserGame && (
                <button
                  onClick={handlePlay}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir na Loja
                </button>
              )}

              {game.downloadUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  Favoritar
                </button>
                <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: providerColor + 'CC' }}
              >
                {game.providerName}
              </span>
              {game.isFree && (
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                  GRATUITO
                </span>
              )}
              {game.isOpenSource && (
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                  OPEN SOURCE
                </span>
              )}
              {game.isAbandonware && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                  ABANDONWARE
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">{game.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white font-medium">{game.rating.toFixed(1)}</span>
              </span>
              {game.releaseDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(game.releaseDate).getFullYear()}
                </span>
              )}
              {game.developer && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {game.developer}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Monitor className="w-4 h-4" />
                {game.platform.join(', ')}
              </span>
            </div>

            <p className="text-white/60 leading-relaxed mb-8">{game.description}</p>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-white/40 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.genre.map((g) => (
                  <span key={g} className="px-3 py-1.5 rounded-xl bg-white/5 text-white/50 text-xs font-medium">
                    {g}
                  </span>
                ))}
                {game.tags.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-xl bg-white/5 text-white/50 text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Provider info */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/40 mb-2">Fonte</h3>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: providerColor + '30' }}
                >
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{game.providerName}</p>
                  <p className="text-white/30 text-xs">
                    {game.isBrowserGame
                      ? 'Jogue diretamente no navegador'
                      : game.downloadUrl
                      ? 'Download disponível'
                      : 'Disponível na loja oficial'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Browser Game Player */}
      {playing && game.isBrowserGame && game.playUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black"
        >
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setPlaying(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Fechar
            </button>
          </div>
          <iframe
            src={game.playUrl}
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            allow="fullscreen; gamepad"
          />
        </motion.div>
      )}
    </div>
  );
}
