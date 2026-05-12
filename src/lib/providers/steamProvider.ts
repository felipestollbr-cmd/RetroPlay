import type { CuratedGame, ProviderSearchOptions, SearchResult } from './types';

const STEAM_API = 'https://store.steampowered.com/api';

export async function searchSteamGames(options: ProviderSearchOptions = {}): Promise<SearchResult> {
  try {
    // Busca jogos free-to-play e demos da Steam
    const params = new URLSearchParams({
      json: '1',
      filter: 'topsellers',
      maxresults: String(options.limit || 20),
    });

    const response = await fetch(`${STEAM_API}/featuredcategories/?${params.toString()}`);
    if (!response.ok) throw new Error('Steam API error');

    const data = await response.json();
    const games: CuratedGame[] = [];

    // Featured free games
    const freeGames = data.specials?.items || [];
    const topSellers = data.top_sellers?.items || [];
    const newReleases = data.new_releases?.items || [];
    const comingSoon = data.coming_soon?.items || [];

    const allItems = [...freeGames, ...topSellers, ...newReleases, ...comingSoon];
    const seen = new Set<string>();

    for (const item of allItems.slice(0, options.limit || 20)) {
      if (seen.has(String(item.id))) continue;
      seen.add(String(item.id));

      const discount = item.discount_percent || 0;
      const isFree = discount === 100 || (item.original_price === 0 && item.final_price === 0);

      games.push({
        id: `steam-${item.id}`,
        title: item.name,
        description: '',
        provider: 'steam',
        providerName: 'Steam',
        platform: ['PC'],
        genre: item.genres?.map((g: any) => g.description) || ['Action'],
        coverUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.id}/header.jpg`,
        bannerUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.id}/library_600x900_2x.jpg`,
        rating: item.review_score ? item.review_score / 100 : 4.0,
        releaseDate: item.release_date?.date,
        playUrl: `https://store.steampowered.com/app/${item.id}`,
        steamAppId: String(item.id),
        tags: item.genres?.map((g: any) => g.description) || [],
        isFree,
        isOpenSource: false,
        isAbandonware: false,
        isBrowserGame: false,
        developer: item.developers?.[0],
        publisher: item.publishers?.[0],
      });
    }

    return { games, total: games.length, provider: 'steam' };
  } catch {
    return { games: [], total: 0, provider: 'steam' };
  }
}

export async function getSteamFreeGames(): Promise<SearchResult> {
  try {
    const response = await fetch('https://store.steampowered.com/api/featuredcategories/?json=1');
    if (!response.ok) throw new Error('Steam API error');

    const data = await response.json();
    const freeGames = data.specials?.items?.filter((item: any) => item.discount_percent === 100) || [];

    const games: CuratedGame[] = freeGames.map((item: any) => ({
      id: `steam-${item.id}`,
      title: item.name,
      description: '',
      provider: 'steam',
      providerName: 'Steam',
      platform: ['PC'],
      genre: item.genres?.map((g: any) => g.description) || ['Action'],
      coverUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.id}/header.jpg`,
      bannerUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.id}/library_600x900_2x.jpg`,
      rating: item.review_score ? item.review_score / 100 : 4.0,
      releaseDate: item.release_date?.date,
      playUrl: `https://store.steampowered.com/app/${item.id}`,
      steamAppId: String(item.id),
      tags: item.genres?.map((g: any) => g.description) || [],
      isFree: true,
      isOpenSource: false,
      isAbandonware: false,
      isBrowserGame: false,
    }));

    return { games, total: games.length, provider: 'steam' };
  } catch {
    return { games: [], total: 0, provider: 'steam' };
  }
}
