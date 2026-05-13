// src/pages/GamePlay.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Gamepad2, Keyboard } from 'lucide-react';
import NativeEmulator from '../components/NativeEmulator';
import { searchByTitle, type ArchiveGame } from '../lib/archiveSearch';

const CONSOLE_LABELS: Record<string, string> = {
  nes: 'Nintendo Entertainment System', snes: 'Super Nintendo',
  gba: 'Game Boy Advance', gb: 'Game Boy', gbc: 'Game Boy Color',
  genesis: 'Sega Genesis', segaMD: 'Sega Mega Drive', n64: 'Nintendo 64',
  ps1: 'PlayStation', atari2600: 'Atari 2600', nds: 'Nintendo DS',
  arcade: 'Arcade', dos: 'DOS',
};

const DEFAULT_CONTROLS: Record<string, { label: string; key: string }[]> = {
  nes:  [{ label: 'A', key: 'Z' }, { label: 'B', key: 'X' }, { label: 'Start', key: 'Enter' }, { label: 'Select', key: 'Shift' }, { label: 'Direcional', key: '↑↓←→' }],
  snes: [{ label: 'A', key: 'X' }, { label: 'B', key: 'Z' }, { label: 'X', key: 'S' }, { label: 'Y', key: 'A' }, { label: 'Start', key: 'Enter' }],
  gba:  [{ label: 'A', key: 'X' }, { label: 'B', key: 'Z' }, { label: 'L', key: 'A' }, { label: 'R', key: 'S' }, { label: 'Start', key: 'Enter' }],
  default: [{ label: 'Movimento', key: '↑↓←→' }, { label: 'Ação', key: 'Z/X' }, { label: 'Start', key: 'Enter' }, { label: 'Menu', key: 'Esc' }],
};

export default function GamePlay() {
  const { consoleId = 'nes', slug = '' } = useParams<{ consoleId: string; slug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<ArchiveGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (!slug) return;
    if (/^[a-zA-Z0-9_\-]+$/.test(slug)) {
      setGame({ id: slug, identifier: slug,
        title: slug.replace(/[_\-]+/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        consoleId, embedUrl: '',
        thumbnailUrl: `https://archive.org/services/img/${slug}`,
      });
      setLoading(false);
      return;
    }
    const titleQuery = decodeURIComponent(slug).replace(/-/g, ' ');
    searchByTitle(titleQuery, consoleId, 1).then(results => {
      setGame(results[0] ?? { id: slug, identifier: slug, title: titleQuery, consoleId, embedUrl: '' });
      setLoading(false);
    });
  }, [slug, consoleId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
      <span style={{ color: '#555', fontSize: 14 }}>Carregando…</span>
    </div>
  );
  if (!game) return null;

  const controls = DEFAULT_CONTROLS[consoleId] ?? DEFAULT_CONTROLS.default;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#777', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
          <ArrowLeft style={{ width: 15, height: 15 }} /> Voltar
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{game.title}</span>
          <span style={{ color: '#555', fontSize: 11 }}>{CONSOLE_LABELS[game.consoleId] ?? game.consoleId}</span>
        </div>
        <button onClick={() => setShowControls(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: showControls ? '#6366f1' : '#777', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>
          <Keyboard style={{ width: 15, height: 15 }} /> Controles
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Emulador */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px', overflow: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 900 }}>
            <NativeEmulator gameId={game.identifier} consoleId={game.consoleId} title={game.title} />
          </div>
        </div>

        {/* Painel de controles */}
        <div style={{ width: showControls ? 240 : 0, minWidth: 0, overflow: 'hidden', transition: 'width 0.3s ease', borderLeft: showControls ? '0.5px solid rgba(255,255,255,0.06)' : 'none', background: '#0d0d14', flexShrink: 0 }}>
          <div style={{ padding: '20px 16px', minWidth: 240 }}>
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
      </div>
    </div>
  );
}
