import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Maximize, Minimize, RotateCcw, Gamepad2, Bluetooth, Upload, Search, ExternalLink, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadEmulator, unloadEmulator, createEmulatorConfig } from '../lib/emulator';
import { getConsoleById } from '../lib/consoles';
import { isGamepadSupported, addGamepadListener, formatGamepadName } from '../lib/gamepad';
import { searchROMsOnIA, type IAROM } from '../lib/internetArchive';

interface EmulatorPlayerProps {
  consoleId: string;
  gameSlug: string;
  gameName: string;
  romUrl?: string;
}

export default function EmulatorPlayer({ consoleId, gameSlug, gameName, romUrl }: EmulatorPlayerProps) {
  const navigate = useNavigate();
  const playerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const [gamepadName, setGamepadName] = useState('');
  const [showGamepadInfo, setShowGamepadInfo] = useState(false);
  const [foundROMs, setFoundROMs] = useState<IAROM[]>([]);
  const [searchingROMs, setSearchingROMs] = useState(false);
  const [selectedRomUrl, setSelectedRomUrl] = useState<string | undefined>(romUrl);
  const [emulatorReady, setEmulatorReady] = useState(false);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const consoleInfo = getConsoleById(consoleId);

  // Check for uploaded ROM in sessionStorage
  const checkUploadedROM = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(`rom-${consoleId}-${gameSlug}`);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.url) {
          setSelectedRomUrl(data.url);
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  }, [consoleId, gameSlug]);

  // Search for ROMs on Internet Archive
  const searchForROMs = useCallback(async () => {
    if (!consoleInfo) return;
    setSearchingROMs(true);
    setError(null);
    try {
      const roms = await searchROMsOnIA(gameName, consoleInfo.shortName);
      setFoundROMs(roms);
      if (roms.length > 0) {
        setSelectedRomUrl(roms[0].url);
      }
    } catch {
      setFoundROMs([]);
    } finally {
      setSearchingROMs(false);
    }
  }, [consoleInfo, gameName]);

  const startEmulator = useCallback(async () => {
    if (!consoleInfo) {
      setError('Console não suportado');
      setLoading(false);
      return;
    }

    // First check for uploaded ROM
    const hasUploaded = checkUploadedROM();

    // If no ROM URL yet, search Internet Archive
    if (!selectedRomUrl && !hasUploaded) {
      setLoading(false);
      setError(null);
      await searchForROMs();
      return;
    }

    const url = selectedRomUrl || `https://archive.org/download/roms-${consoleId}/${gameSlug}.${consoleInfo.extensions[0].replace('.', '')}`;

    try {
      setLoading(true);
      setError(null);

      const config = createEmulatorConfig(consoleInfo, url, '#emulator-player');
      await loadEmulator(config);
      setLoading(false);
      setEmulatorReady(true);
    } catch (err) {
      setError('Erro ao carregar o emulador. A ROM pode não estar disponível.');
      setLoading(false);
      setEmulatorReady(false);
    }
  }, [consoleInfo, gameSlug, selectedRomUrl, checkUploadedROM, searchForROMs]);

  useEffect(() => {
    startEmulator();
    return () => {
      unloadEmulator();
    };
  }, [startEmulator]);

  useEffect(() => {
    if (!isGamepadSupported()) return;

    const unsubscribe = addGamepadListener((states) => {
      if (states.length > 0) {
        setGamepadConnected(true);
        setGamepadName(formatGamepadName(states[0].id));
      } else {
        setGamepadConnected(false);
        setGamepadName('');
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fullscreen]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (!loading) setShowControls(false);
    }, 3000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleBack = () => {
    unloadEmulator();
    navigate(-1);
  };

  const handleRetry = () => {
    unloadEmulator();
    setEmulatorReady(false);
    setFoundROMs([]);
    startEmulator();
  };

  const handleSelectROM = (rom: IAROM) => {
    setSelectedRomUrl(rom.url);
    setError(null);
    setEmulatorReady(false);
    unloadEmulator();
    // Small delay to let unload complete
    setTimeout(() => {
      startEmulator();
    }, 500);
  };

  const handleUploadClick = () => {
    unloadEmulator();
    navigate('/upload');
  };

  if (!consoleInfo) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-lg mb-4">Console não encontrado</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium transition-colors">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // Show ROM selection screen when no ROM is loaded yet
  if (!emulatorReady && !loading && foundROMs.length > 0 && !error) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white font-bold text-sm sm:text-base">{gameName}</h1>
              <p className="text-white/40 text-xs">{consoleInfo.name}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg w-full"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">ROMs Encontradas</h2>
              <p className="text-white/40 text-sm">
                Encontramos {foundROMs.length} ROM(s) para <span className="text-white/60">{gameName}</span> na Internet Archive.
                Selecione uma para jogar:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {foundROMs.map((rom, index) => (
                <motion.button
                  key={rom.url}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectROM(rom)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{rom.name}</p>
                    <p className="text-white/30 text-xs uppercase">.{rom.format}</p>
                  </div>
                  <div className="text-white/20 text-xs">
                    {(rom.size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={searchForROMs}
                disabled={searchingROMs}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {searchingROMs ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Buscando...</>
                ) : (
                  <><Search className="w-4 h-4" />Buscar novamente</>
                )}
              </button>
              <button
                onClick={handleUploadClick}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Fazer upload da minha ROM
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show "no ROMs found" screen
  if (!emulatorReady && !loading && foundROMs.length === 0 && !error && !searchingROMs) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white font-bold text-sm sm:text-base">{gameName}</h1>
              <p className="text-white/40 text-xs">{consoleInfo.name}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Nenhuma ROM encontrada</h2>
            <p className="text-white/40 text-sm mb-6">
              Não encontramos ROMs para <span className="text-white/60">{gameName}</span> na Internet Archive.
              Você pode fazer upload da sua própria ROM ou buscar novamente.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={searchForROMs}
                disabled={searchingROMs}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {searchingROMs ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Buscando...</>
                ) : (
                  <><Search className="w-4 h-4" />Buscar na Internet Archive</>
                )}
              </button>
              <button
                onClick={handleUploadClick}
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Fazer upload da ROM
              </button>
              <button
                onClick={() => navigate('/discovery')}
                className="w-full py-3 rounded-xl text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                Ver outros jogos
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className={`relative bg-black ${fullscreen ? 'fixed inset-0 z-[100]' : 'w-full h-screen'}`}
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      <div
        id="emulator-player"
        className="w-full h-full flex items-center justify-center"
        style={{ minHeight: fullscreen ? '100vh' : '100vh' }}
      />

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-white font-bold text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">
                    {gameName}
                  </h1>
                  <p className="text-white/40 text-xs">{consoleInfo.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {gamepadConnected && (
                  <div
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs"
                    onMouseEnter={() => setShowGamepadInfo(true)}
                    onMouseLeave={() => setShowGamepadInfo(false)}
                  >
                    <Bluetooth className="w-3 h-3" />
                    <Gamepad2 className="w-3 h-3" />
                    {showGamepadInfo && gamepadName && (
                      <span className="ml-1">{gamepadName}</span>
                    )}
                  </div>
                )}
                <button
                  onClick={handleRetry}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                  title={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
                >
                  {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f1a] z-20">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
          <p className="text-white/60 text-lg font-medium">Carregando emulador...</p>
          <p className="text-white/30 text-sm mt-2">{consoleInfo.name}</p>
          {!gamepadConnected && (
            <div className="mt-6 flex items-center gap-2 text-white/30 text-sm">
              <Gamepad2 className="w-4 h-4" />
              <span>Conecte um controle Bluetooth para jogar</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f1a] z-20 p-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
            <Gamepad2 className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-white/80 text-lg font-medium text-center mb-2">{error}</p>
          <p className="text-white/40 text-sm text-center mb-6 max-w-md">
            Não foi possível carregar esta ROM. Ela pode ter sido removida ou estar indisponível.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={handleRetry}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Tentar novamente
            </button>
            <button
              onClick={() => { setError(null); setFoundROMs([]); searchForROMs(); }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar outras ROMs
            </button>
            <button
              onClick={handleUploadClick}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload de ROM
            </button>
          </div>
        </div>
      )}

      {!gamepadConnected && !loading && !error && emulatorReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-white/40 text-xs">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Conecte um controle Bluetooth ou use o teclado</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
