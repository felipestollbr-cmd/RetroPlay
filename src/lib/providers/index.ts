import type { CuratedGame, ProviderSearchOptions, SearchResult, GameProvider } from './types';
import { searchSteamGames, getSteamFreeGames } from './steamProvider';
import { searchItchIoGames } from './itchioProvider';
import { searchArchiveGames } from './archiveProvider';
import { searchBrowserGames } from './browserGamesProvider';

export const PROVIDERS: GameProvider[] = [
  {
    id: 'steam',
    name: 'Steam',
    description: 'Jogos free-to-play e demos da Steam',
    icon: 'steam',
    color: '#1b2838',
    enabled: true,
    supportsStreaming: false,
    supportsBrowser: false,
    supportsDownload: true,
  },
  {
    id: 'itchio',
    name: 'itch.io',
    description: 'Jogos indie gratuitos e experimentais',
    icon: 'gamepad',
    color: '#fa5c5c',
    enabled: true,
    supportsStreaming: false,
    supportsBrowser: true,
    supportsDownload: true,
  },
  {
    id: 'archive',
    name: 'Internet Archive',
    description: 'Jogos abandonware e clássicos',
    icon: 'archive',
    color: '#333333',
    enabled: true,
    supportsStreaming: true,
    supportsBrowser: true,
    supportsDownload: true,
  },
  {
    id: 'browser',
    name: 'Browser Games',
    description: 'Jogos HTML5 que rodam no navegador',
    icon: 'globe',
    color: '#4ade80',
    enabled: true,
    supportsStreaming: true,
    supportsBrowser: true,
    supportsDownload: false,
  },
];

export async function searchAllProviders(options: ProviderSearchOptions = {}): Promise<SearchResult[]> {
  const enabledProviders = PROVIDERS.filter((p) => p.enabled).map((p) => p.id);
  const results: SearchResult[] = [];

  const promises = enabledProviders.map(async (providerId) => {
    try {
      switch (providerId) {
        case 'steam':
          return await searchSteamGames(options);
        case 'itchio':
          return await searchItchIoGames(options);
        case 'archive':
          return await searchArchiveGames(options);
        case 'browser':
          return await searchBrowserGames(options);
        default:
          return { games: [], total: 0, provider: providerId };
      }
    } catch {
      return { games: [], total: 0, provider: providerId };
    }
  });

  const settled = await Promise.allSettled(promises);
  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value.games.length > 0) {
      results.push(result.value);
    }
  }

  return results;
}

export async function searchProvider(providerId: string, options: ProviderSearchOptions = {}): Promise<SearchResult> {
  try {
    switch (providerId) {
      case 'steam':
        return await searchSteamGames(options);
      case 'itchio':
        return await searchItchIoGames(options);
      case 'archive':
        return await searchArchiveGames(options);
      case 'browser':
        return await searchBrowserGames(options);
      default:
        return { games: [], total: 0, provider: providerId };
    }
  } catch {
    return { games: [], total: 0, provider: providerId };
  }
}

export function mergeAndDeduplicate(results: SearchResult[]): CuratedGame[] {
  const seen = new Set<string>();
  const allGames: CuratedGame[] = [];

  for (const result of results) {
    for (const game of result.games) {
      const key = `${game.title.toLowerCase()}-${game.provider}`;
      if (!seen.has(key)) {
        seen.add(key);
        allGames.push(game);
      }
    }
  }

  return allGames;
}

export function sortGames(games: CuratedGame[], sortBy: string): CuratedGame[] {
  const sorted = [...games];
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return dateB - dateA;
    });
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'popular':
    default:
      return sorted.sort((a, b) => b.rating - a.rating);
  }
}

export function filterGames(games: CuratedGame[], options: ProviderSearchOptions): CuratedGame[] {
  let filtered = [...games];

  if (options.query) {
    const q = options.query.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)) ||
        g.genre.some((gen) => gen.toLowerCase().includes(q))
    );
  }

  if (options.genre) {
    filtered = filtered.filter((g) =>
      g.genre.some((gen) => gen.toLowerCase() === options.genre!.toLowerCase())
    );
  }

  if (options.platform) {
    filtered = filtered.filter((g) =>
      g.platform.some((p) => p.toLowerCase() === options.platform!.toLowerCase())
    );
  }

  if (options.freeOnly) {
    filtered = filtered.filter((g) => g.isFree);
  }

  return filtered;
}

export * from './types';
