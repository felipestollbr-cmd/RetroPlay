import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Loader2, Gamepad2, AlertTriangle, Zap, Play } from 'lucide-react';
import { searchGameByDescription, type GeminiGameResult } from '../lib/gemini';
import { canUseAI, incrementAISearch, getPlan, getUser, isLoggedIn } from '../lib/subscription';
import { useNavigate } from 'react-router-dom';

export default function AISearch() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [results, setResults] = useState<GeminiGameResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [anonCount, setAnonCount] = useState(0);

  const user = getUser();
  const loggedIn = isLoggedIn();

  // Get anonymous count from sessionStorage
  useEffect(() => {
    if (!loggedIn) {
      const today = new Date().toISOString().split('T')[0];
      const savedDate = sessionStorage.getItem('retroplay_anon_ai_date');
      if (savedDate !== today) {
        sessionStorage.setItem('retroplay_anon_ai_date', today);
        sessionStorage.setItem('retroplay_anon_ai_count', '0');
        setAnonCount(0);
      } else {
        const count = parseInt(sessionStorage.getItem('retroplay_anon_ai_count') || '0', 10);
        setAnonCount(count);
      }
    }
  }, [loggedIn]);

  const plan = getPlan();
  const aiRemaining = loggedIn
    ? (plan.limits.aiSearches === Infinity
        ? Infinity
        : Math.max(0, plan.limits.aiSearches - (user?.dailyStats.aiSearches || 0)))
    : Math.max(0, 2 - anonCount);

  const handleSearch = async () => {
    if (!description.trim()) return;

    if (!canUseAI()) {
      navigate('/plans');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      incrementAISearch();
      if (!loggedIn) {
        setAnonCount((c) => c + 1);
      }
      const aiResults = await searchGameByDescription(description);
      setResults(aiResults);
    } catch (err) {
      setError('Erro na busca com IA. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (gameName: string) => {
    const slug = gameName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    // Map platform to console id
    const consoleId = 'nes'; // Default, user can choose later
    navigate(`/play/${consoleId}/${slug}`);
  };

  const examples = [
    'Jogo de um encanador que salva uma princesa de um castelo',
    'Ouriço azul que corre muito rápido coletando anéis',
    'Jogo de luta com personagens de todo o mundo fazendo hadouken',
    'RPG japonês com um espadachim de cabelo loiro espada grande',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Busca Inteligente com IA</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Descreva o jogo, a IA encontra
        </h2>
        <p className="text-white/40 text-sm sm:text-base max-w-lg mx-auto">
          Não lembra o nome? Descreva a capa, uma cena, personagens ou qualquer detalhe.
          Nossa IA vai identificar o jogo para você.
        </p>
      </div>

      {/* Usage indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Zap className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-white/40">
          {aiRemaining === Infinity
            ? 'Busca por IA ilimitada'
            : `${aiRemaining} busca${aiRemaining !== 1 ? 's' : ''} restante${aiRemaining !== 1 ? 's' : ''} hoje`}
          {!loggedIn && ' (sem login)'}
        </span>
      </div>

      {/* Search input */}
      <div className="relative mb-8">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o jogo que você está procurando..."
          rows={3}
          className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all resize-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !description.trim()}
          className="absolute bottom-3 right-3 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/20 disabled:opacity-40 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Buscar com IA
            </>
          )}
        </button>
      </div>

      {/* Examples */}
      {!searched && (
        <div className="mb-8">
          <p className="text-white/30 text-sm mb-3 text-center">Exemplos de descrições:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setDescription(ex)}
                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs hover:bg-white/[0.06] hover:text-white/60 hover:border-white/10 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-6"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {searched && !loading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <p className="text-white/40 text-sm mb-4">
            {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''} pela IA
          </p>
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all cursor-pointer"
              onClick={() => handlePlay(result.name)}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
                <Gamepad2 className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-bold text-sm truncate group-hover:text-purple-300 transition-colors">
                    {result.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    result.confidence >= 80
                      ? 'bg-green-500/10 text-green-400'
                      : result.confidence >= 50
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-white/5 text-white/40'
                  }`}>
                    {result.confidence}% match
                  </span>
                </div>
                <p className="text-white/30 text-xs mb-1">
                  {result.platform} • {result.year}
                </p>
                <p className="text-white/40 text-xs line-clamp-1">{result.description}</p>
                <p className="text-purple-400/60 text-xs mt-1 italic">
                  {result.why}
                </p>
              </div>
              <button className="p-3 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white/40 hover:text-purple-400 transition-colors shrink-0">
                <Play className="w-4 h-4 fill-current" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-10">
          <Search className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">Nenhum jogo encontrado. Tente outra descrição.</p>
        </div>
      )}
    </div>
  );
}
