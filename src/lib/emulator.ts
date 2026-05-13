import { ConsoleInfo } from './consoles';

export interface EmulatorConfig {
  core: string;
  gameUrl: string;
  biosUrl?: string;
  playerSelector: string;
  pathToData: string;
  width?: string;
  height?: string;
}

export function createEmulatorConfig(
  consoleInfo: ConsoleInfo,
  gameUrl: string,
  playerSelector: string
): EmulatorConfig {
  return {
    core: consoleInfo.ejsCore,
    gameUrl,
    playerSelector,
    pathToData: 'https://cdn.emulatorjs.org/latest/data/',
    width: '100%',
    height: '100%',
  };
}

export function loadEmulator(config: EmulatorConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById('emulatorjs-script');
    if (existing) {
      existing.remove();
    }

    const container = document.querySelector(config.playerSelector);
    if (!container) {
      reject(new Error('Player container not found'));
      return;
    }

    (window as any).EJS_player = config.playerSelector;
    (window as any).EJS_core = config.core;
    (window as any).EJS_gameUrl = config.gameUrl;
    (window as any).EJS_pathtodata = config.pathToData;
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_backgroundColor = '#0f0f1a';
    (window as any).EJS_backgroundImage = '';

    if (config.biosUrl) {
      (window as any).EJS_biosUrl = config.biosUrl;
    }

    const script = document.createElement('script');
    script.id = 'emulatorjs-script';
    script.src = `${config.pathToData}loader.js`;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load EmulatorJS'));
    };
    document.body.appendChild(script);
  });
}

export function unloadEmulator(): void {
  const script = document.getElementById('emulatorjs-script');
  if (script) script.remove();

  const canvas = document.querySelector('canvas');
  if (canvas) canvas.remove();

  delete (window as any).EJS_player;
  delete (window as any).EJS_core;
  delete (window as any).EJS_gameUrl;
  delete (window as any).EJS_pathtodata;
  delete (window as any).EJS_biosUrl;
  delete (window as any).EJS_startOnLoaded;
}
