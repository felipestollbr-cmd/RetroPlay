const RAWG_API_KEY = '3f3e4e8b8e4e4e8b8e4e4e8b8e4e4e8b';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

export interface RawgGame {
  id: number;
  name: string;
  slug: string;
  released: string;
  background_image: string | null;
  rating: number;
  rating_top: number;
  platforms: Array<{
    platform: { id: number; name: string; slug: string };
  }>;
  genres: Array<{ id: number; name: string; slug: string }>;
  short_screenshots: Array<{ id: number; image: string }>;
}

export interface RawgSearchResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
}

export async function searchGames(
  query: string,
  platformId?: number,
  page = 1,
  pageSize = 20
): Promise<RawgSearchResult> {
  const params = new URLSearchParams({
    key: RAWG_API_KEY,
    search: query,
    page: String(page),
    page_size: String(pageSize),
    ordering: '-rating',
  });
  if (platformId) {
    params.append('platforms', String(platformId));
  }

  const response = await fetch(`${RAWG_BASE_URL}/games?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  return response.json();
}

export async function getGamesByPlatform(
  platformId: number,
  page = 1,
  pageSize = 20
): Promise<RawgSearchResult> {
  const params = new URLSearchParams({
    key: RAWG_API_KEY,
    platforms: String(platformId),
    page: String(page),
    page_size: String(pageSize),
    ordering: '-rating',
  });

  const response = await fetch(`${RAWG_BASE_URL}/games?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  return response.json();
}

export async function getGameDetails(slug: string): Promise<RawgGame> {
  const params = new URLSearchParams({
    key: RAWG_API_KEY,
  });

  const response = await fetch(`${RAWG_BASE_URL}/games/${slug}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }
  return response.json();
}

export function getGameCoverUrl(game: RawgGame): string {
  return (
    game.background_image ||
    game.short_screenshots?.[0]?.image ||
    '/placeholder-game.png'
  );
}
