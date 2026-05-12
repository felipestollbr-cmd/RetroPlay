// src/lib/providers.ts
export interface GameSource {
  url: string;
  provider: 'archive' | 'libretro' | 'custom';
}

export const getGameSource = (consoleId: string, slug: string): string => {
  // Mapeamento de coleções no Archive.org para maior precisão
  const collections: Record<string, string> = {
    'atari2600': 'atari_2600_library',
    'snes': 'nintendo_snes_library',
    'gba': 'nintendo_gba_library',
    'nes': 'nintendo_nes_library'
  };

  const collection = collections[consoleId] || `roms-${consoleId}`;
  
  // Retorna o link direto via proxy para evitar erro de Mixed Content
  return `https://archive.org/download/${collection}/${slug}.zip`;
};

export const CONSOLES_CONFIG = [
  { 
    id: 'atari2600', 
    name: 'Atari 2600', 
    skin: 'wood-panel', 
    core: 'stella',
    extensions: ['.a26', '.bin'] 
  },
  { 
    id: 'snes', 
    name: 'Super Nintendo', 
    skin: 'retro-gray', 
    core: 'snes9x',
    extensions: ['.smc', '.sfc', '.zip'] 
  }
];