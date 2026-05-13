// src/pages/GamePlay.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Gamepad2, Keyboard } from 'lucide-react';
import NativeEmulator from '../components/NativeEmulator';
import { getArchiveGameByIdentifier, searchByTitle, type ArchiveGame } from '../lib/archiveSearch';
import { getGameBySlug } from '../lib/gamesDb';

const CONSOLE_LABELS: Record<string, string> = {
  nes: 'Nintendo Entertainment System', snes: 'Super Nintendo',
  gba: 'Game Boy Advance', gb: 'Game Boy', gbc: 'Game Boy Color',
  genesis: 'Sega Genesis', segaMD: 'Sega Mega Drive', n64: 'Nintendo 64',
  ps1: 'PlayStation', psx: 'PlayStation', atari2600: 'Atari 2600', nds: 'Nintendo DS',
  arcade: 'Arcade', dos: 'DOS',
};

const DEFAULT_CONTROLS: Record<string, { label: string; key: string }[]> = {
  nes:  [{ label: 'A', key: 'Z' }, { label: 'B', key: 'X' }, { label: 'Start', key: 'Enter' }, { label: 'Select', key: 'Shift' }, { label: 'Direcional', key: '↑↓←→' }],
  snes: [{ label: 'A', key: 'X' }, { label: 'B', key: 'Z' }, { label: 'X', key: 'S' }, { label: 'Y', key: 'A' }, { label: 'Start', key: 'Enter' }],
  gba:  [{ label: 'A', key: 'X' }, { label: 'B', key: 'Z' }, { label: 'L', key: 'A' }, { label: 'R', key: 'S' }, { label: 'Start', key: 'Enter' }],
  ps1: [{ label: 'X', key: 'Z' }, { label: 'Circle', key: 'X' }, { label: 'Triangle', key: 'A' }, { label: 'Square', key: 'S' }, { label: 'Start', key: 'Enter' }],
  psx: [{ label: 'X', key: 'Z' }, { label: 'Circle', key: 'X' }, { label: 'Triangle', key: 'A' }, { label: 'Square', key: 'S' }, { label: 'Start', key: 'Enter' }],
  atari2600: [{ label: 'Fire', key: 'Z' }, { label: 'Direcional', key: '↑↓←→' }, { label: 'Start', key: 'Enter' }],
  default: [{ label: 'Movimento', key: '↑↓←→' }, { label: 'Ação', key: 'Z/X' }, { label: 'Start', key: 'Enter' }, { label: 'Menu', key: 'Esc' }],
};

export default function GamePlay() {
  const { consoleId = 'nes', gameSlug = '' } = useParams<{ consoleId: string; gameSlug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<ArchiveGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') { e.preventDefault(); setShowUI(v => !v); }
      if (e.key === 'Escape' && isFullscreen) document.exitFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!gameSlug) return;

    const loadGame = async () => {
      const localGame = getGameBySlug(consoleId, gameSlug);
      if (localGame && localGame.archiveId) {
        setGame({
          id: localGame.id,
          identifier: localGame.archiveId,
          title: localGame.title,
          consoleId,
          embedUrl: '',
          thumbnailUrl: `https://archive.org/services/img/${localGame.archiveId}`,
          archiveFile: localGame.archiveFile,
        });
        setLoading(false);
        return;
      }

      const archiveById = await getArchiveGameByIdentifier(gameSlug, consoleId);
      if (archiveById) {
        setGame(archiveById);
        setLoading(false);
        return;
      }

      const titleQuery = localGame?.title ?? decodeURIComponent(gameSlug).replace(/-/g, ' ');
      const results = await searchByTitle(titleQuery, consoleId, 1);
      if (results.length > 0) {
        setGame(results[0]);
      } else if (localGame) {
        setGame({
          id: localGame.id,
          identifier: localGame.archiveId ?? localGame.slug,
          title: localGame.title,
          consoleId,
          embedUrl: '',
          thumbnailUrl: `https://archive.org/services/img/${localGame.archiveId ?? localGame.slug}`,
          archiveFile: localGame.archiveFile,
        });
      } else {
        setGame(null);
      }
      setLoading(false);
    };

    loadGame();
  }, [gameSlug, consoleId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
      <span style={{ color: '#555', fontSize: 14 }}>Carregando…</span>
    </div>
  );
  if (!game) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <div style={{ textAlign: 'center', padding: 24, borderRadius: 20, background: '#11131d', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>Jogo não encontrado ou não disponível no Archive.org.</p>
          <button
            onClick={() => navigate(-1)}
            style={{ padding: '10px 18px', borderRadius: 12, background: '#6366f1', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const controls = DEFAULT_CONTROLS[consoleId] ?? DEFAULT_CONTROLS.default;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      {/* Emulador em fullscreen */}
      <NativeEmulator gameId={game.identifier} consoleId={game.consoleId} title={game.title} archiveFile={game.archiveFile} />

      {/* Overlay UI — aparece ao pressionar Tab */}
      {showUI && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', backdropFilter: 'blur(8px)' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#aaa', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 13, padding: '8px 12px', borderRadius: 8, transition: 'all 0.2s' }}>
            <ArrowLeft style={{ width: 15, height: 15 }} /> Voltar
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{game.title}</span>
            <span style={{ color: '#888', fontSize: 11 }}>{CONSOLE_LABELS[game.consoleId] ?? game.consoleId}</span>
          </div>
          <button onClick={() => setShowControls(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: showControls ? '#6366f1' : '#aaa', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 12, padding: '8px 12px', borderRadius: 8, transition: 'all 0.2s' }}>
            <Keyboard style={{ width: 15, height: 15 }} /> Controles
          </button>
        </div>
      )}

      {/* Hint — pressione Tab para mostrar UI */}
      {!showUI && (
        <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 999, padding: '8px 12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#888', fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setShowUI(true)}>
          Pressione Tab para menu
        </div>
      )}

      {/* Painel de controles — overlay na direita */}
      {showUI && (
        <div style={{ position: 'fixed', bottom: 0, right: 0, width: showControls ? 240 : 0, height: '100vh', minWidth: 0, overflow: 'hidden', transition: 'width 0.3s ease', borderLeft: showControls ? '0.5px solid rgba(255,255,255,0.06)' : 'none', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1001 }}>
          <div style={{ padding: '20px 16px', minWidth: 240, maxHeight: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Gamepad2 style={{ width: 16, height: 16, color: '#6366f1' }} />
              <span style={{ color: '#aaa', fontSize: 13, fontWeight: 500 }}>Controles</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {controls.map(ctrl => (
                <div key={ctrl.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                  <span style={{ color: '#888', fontSize: 13 }}>{ctrl.label}</span>
                  <kbd style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '2px 8px', fontSize: 12, color: '#ccc', fontFamily: 'monospace' }}>{ctrl.key}</kbd>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: 12, background: 'rgba(99,102,241,0.08)', borderRadius: 8, border: '0.5px solid rgba(99,102,241,0.2)' }}>
              <p style={{ color: '#6366f1', fontSize: 11, margin: 0, lineHeight: 1.5 }}>Conecte um controle Bluetooth — detectado automaticamente.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
