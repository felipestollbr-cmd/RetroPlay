// src/lib/providers.ts

export interface CuratedGame {
  id: string;
  title: string;
  consoleId: string;
  coverUrl?: string;
  rating: number;
  year?: string;
  genre?: string;
  description?: string;
  provider: string;
  slug: string;
}

export interface ProviderSearchOptions {
  query?: string;
  consoleId?: string;
  limit?: number;
}

export const PROVIDERS = [
  { id: 'archive', name: 'Archive.org', enabled: true },
  { id: 'tgdb', name: 'TheGamesDB', enabled: true },
  { id: 'crazygames', name: 'CrazyGames', enabled: true }
];

// Função para buscar em todos os provedores simultaneamente
export const searchAllProviders = async (options: ProviderSearchOptions): Promise<CuratedGame[]> => {
  // Aqui entraria a lógica de fetch para cada API (Archive, TGDB, etc)
  // Por enquanto, retornamos um array vazio ou mock para evitar erros de compilação
  console.log("Buscando com opções:", options);
  return []; 
};

// Funções de utilidade exigidas pelas páginas
export const mergeAndDeduplicate = (games: CuratedGame[]): CuratedGame[] => {
  const seen = new Set();
  return games.filter(game => {
    const duplicate = seen.has(game.id);
    seen.add(game.id);
    return !duplicate;
  });
};

export const sortGames = (games: CuratedGame[], criteria: string): CuratedGame[] => {
  return [...games].sort((a, b) => {
    if (criteria === 'rating') return b.rating - a.rating;
    if (criteria === 'title') return a.title.localeCompare(b.title);
    return 0;
  });
};

export const filterGames = (games: CuratedGame[], consoleId: string): CuratedGame[] => {
  if (!consoleId || consoleId === 'all') return games;
  return games.filter(g => g.consoleId === consoleId);
};

// Configuração de consoles e skins
export const getConsoleConfig = (consoleId: string) => {
  const configs: Record<string, any> = {
    atari2600: { name: 'Atari 2600', skin: 'wood', core: 'stella' },
    snes: { name: 'Super Nintendo', skin: 'gray', core: 'snes9x' },
    gba: { name: 'Game Boy Advance', skin: 'indigo', core: 'mgba' }
  };
  return configs[consoleId] || { name: 'Console', skin: 'default', core: 'genesis_plus_gx' };
};