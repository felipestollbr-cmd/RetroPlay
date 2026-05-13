// src/components/NativeEmulator.tsx
// EmulatorJS embutido nativamente — aparência RetroPlay, zero Archive.org visível

import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, RotateCcw, Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';

// Cores EmulatorJS para casar com a marca
const BRAND_COLOR = '#6366f1';

// Mapeamento console → core EmulatorJS
const EJS_CORES: Record<string, string> = {
  nes:       'nes',
  snes:      'snes9x',
  gba:       'mgba',
  gb:        'gambatte',
  gbc:       'gambatte',
  genesis:   'segaMD',
  segaMD:    'segaMD',
  n64:       'n64',
  ps1:       'psx',
  psx:       'psx',
  atari2600: 'stella',
  nds:       'nds',
  arcade:    'mame2003',
  dos:       'dosbox_pure',
};

// Aspect ratio por console
const CONSOLE_RATIO: Record<string, string> = {
  nes:       '4/3',
  snes:      '4/3',
  gba:       '3/2',
  gb:        '10/9',
  gbc:       '10/9',
  genesis:   '4/3',
  segaMD:    '4/3',
  n64:       '4/3',
  ps1:       '4/3',
  atari2600: '4/3',
  nds:       '3/4',
  arcade:    '3/4',
  dos:       '4/3',
};

interface NativeEmulatorProps {
  gameId: string;      // Archive.org identifier
  consoleId: string;
  title: string;
  archiveFile?: string;
}

// CSS para sobrescrever a UI padrão do EmulatorJS e deixá-la com cara RetroPlay
const EMULATOR_STYLE = `
  #__ejs-container__ {
    width: 100% !important;
    height: 100% !important;
    background: #000 !important;
    border-radius: 0 !important;
  }
  #__ejs-container__ .ejs-menu-bar,
  #__ejs-container__ .ejs_menu_bar {
    background: rgba(0,0,0,0.85) !important;
    backdrop-filter: blur(8px) !important;
    border-top: 0.5px solid rgba(255,255,255,0.08) !important;
  }
  #__ejs-container__ .ejs-menu-bar svg,
  #__ejs-container__ .ejs_menu_bar svg {
    color: #fff !important;
  }
  #__ejs-container__ canvas {
    image-rendering: pixelated !important;
    image-rendering: crisp-edges !important;
  }
`;

let instanceCount = 0;

export default function NativeEmulator({ gameId, consoleId, title, archiveFile }: NativeEmulatorProps) {
  const [status, setStatus]   = useState<'loading' | 'ready' | 'error'>('loading');
  const [muted, setMuted]     = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef  = useRef<HTMLDivElement>(null);
  const wrapRef       = useRef<HTMLDivElement>(null);
  const instanceId    = useRef(`ejs_${++instanceCount}`);
  const scriptRef     = useRef<HTMLScriptElement | null>(null);
  const styleRef      = useRef<HTMLStyleElement | null>(null);
  const mountedRef    = useRef(false);

  useEffect(() => {
    // Evita double-mount do StrictMode
    if (mountedRef.current) return;
    mountedRef.current = true;

    const containerId = instanceId.current;
    const core = EJS_CORES[consoleId] ?? 'nes';
    const romUrl = `/api/rom?id=${encodeURIComponent(gameId)}&console=${encodeURIComponent(consoleId)}${archiveFile ? `&file=${encodeURIComponent(archiveFile)}` : ''}`;

    // Injeta estilos
    const style = document.createElement('style');
    style.textContent = EMULATOR_STYLE.replace(/__ejs-container__/g, containerId);
    document.head.appendChild(style);
    styleRef.current = style;

    // Configura globals do EmulatorJS ANTES de carregar o script
    const w = window as any;
    w.EJS_player         = `#${containerId}`;
    w.EJS_gameUrl        = romUrl;
    w.EJS_core           = core;
    w.EJS_pathtodata     = 'https://cdn.emulatorjs.org/latest/data/';
    w.EJS_color          = BRAND_COLOR;
    w.EJS_language       = 'pt-BR';
    w.EJS_startOnLoaded  = true;
    w.EJS_gameID         = 0;
    w.EJS_AdUrl          = '';        // sem anúncios
    w.EJS_AdMode         = 0;
    w.EJS_defaultOptions = {
      'save-state-slot': 1,
      'rewind-enabled': 'enabled',
    };

    // Callbacks de estado
    w.EJS_onGameStart = () => setStatus('ready');
    w.EJS_onLoadError = () => setStatus('error');

    // Carrega o loader do EmulatorJS
    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/latest/data/loader.js';
    script.async = true;
    script.onerror = () => setStatus('error');
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      // Cleanup
      scriptRef.current?.remove();
      styleRef.current?.remove();
      const keys = ['EJS_player','EJS_gameUrl','EJS_core','EJS_pathtodata','EJS_color',
                    'EJS_language','EJS_startOnLoaded','EJS_gameID','EJS_AdUrl','EJS_AdMode',
                    'EJS_defaultOptions','EJS_onGameStart','EJS_onLoadError','EJS_emulator'];
      keys.forEach(k => delete (window as any)[k]);
    };
  }, [gameId, consoleId]);

  useEffect(() => {
    if (wrapRef.current && !document.fullscreenElement) {
      wrapRef.current.requestFullscreen().catch(() => {
        console.warn('Fullscreen request denied');
      });
    }
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleMute = () => {
    const ejs = (window as any).EJS_emulator;
    if (ejs) {
      muted ? ejs.setVolume(1) : ejs.setVolume(0);
      setMuted(m => !m);
    }
  };

  const restart = () => {
    const ejs = (window as any).EJS_emulator;
    if (ejs) ejs.restart();
  };

  const ratio = CONSOLE_RATIO[consoleId] ?? '4/3';

  return (
    <div
      ref={wrapRef}
      style={{
        position:     'fixed',
        inset:        0,
        width:        '100vw',
        height:       '100vh',
        background:   '#000',
        borderRadius: 0,
        overflow:     'hidden',
        zIndex:       50,
      }}
    >
      {/* Overlay de loading */}
      {status === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 30,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a0a0f', gap: 16,
          aspectRatio: ratio,
        }}>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <Loader2 style={{
              width: 48, height: 48, color: BRAND_COLOR,
              animation: 'ejs-spin 1s linear infinite',
              position: 'absolute', top: 8, left: 8,
            }} />
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `${BRAND_COLOR}18`,
              position: 'absolute', top: 0, left: 0,
            }} />
          </div>
          <span style={{ color: '#888', fontSize: 13 }}>Carregando {title}…</span>
          <span style={{ color: '#444', fontSize: 11 }}>Buscando ROM e iniciando emulador</span>
          <style>{`@keyframes ejs-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Overlay de erro */}
      {status === 'error' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 30,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a0a0f', gap: 14, padding: 32,
          aspectRatio: ratio,
        }}>
          <AlertCircle style={{ width: 40, height: 40, color: '#ef4444' }} />
          <p style={{ color: '#fff', fontSize: 15, fontWeight: 500, margin: 0 }}>
            ROM não encontrada
          </p>
          <p style={{ color: '#555', fontSize: 13, textAlign: 'center', margin: 0 }}>
            Este jogo não está disponível no Archive.org ou o arquivo foi removido.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8, padding: '8px 20px',
              borderRadius: 8, background: BRAND_COLOR,
              color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13,
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Container do EmulatorJS — fullscreen */}
      <div
        ref={containerRef}
        id={instanceId.current}
        style={{
          width: '100%',
          height: '100%',
          display:     status === 'error' ? 'none' : 'block',
        }}
      />

      {/* Barra de controles customizada RetroPlay */}
      {status === 'ready' && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 6, padding: '8px 12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          opacity: 0, transition: 'opacity 0.3s',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
        >
          <CtrlBtn onClick={toggleMute} title={muted ? 'Ativar som' : 'Mudo'}>
            {muted ? <VolumeX size={15}/> : <Volume2 size={15}/>}
          </CtrlBtn>
          <CtrlBtn onClick={restart} title="Reiniciar">
            <RotateCcw size={15}/>
          </CtrlBtn>
          <CtrlBtn onClick={toggleFullscreen} title="Tela cheia">
            {fullscreen ? <Minimize2 size={15}/> : <Maximize2 size={15}/>}
          </CtrlBtn>
        </div>
      )}
    </div>
  );
}

function CtrlBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'rgba(255,255,255,0.12)',
        border: 'none', borderRadius: 6,
        padding: '5px 7px', cursor: 'pointer',
        color: '#fff', display: 'flex', alignItems: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      {children}
    </button>
  );
}
