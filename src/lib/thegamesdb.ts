const TGDB_API_KEY = '1';
const TGDB_BASE_URL = 'https://api.thegamesdb.net/v1';

export interface TGDBGame {
  id: number;
  game_title: string;
  release_date: string;
  platform: number;
  overview?: string;
  players?: string;
  genres?: Array<{ id: number; name: string }>;
  publishers?: Array<{ id: number; name: string }>;
  rating?: string;
  last_updated?: string;
  youtube?: string;
  alternates?: string;
}

export interface TGDBPlatform {
  id: number;
  name: string;
  alias: string;
  icon?: string;
  console?: string;
  controller?: string;
  developer?: string;
  manufacturer?: string;
  cpu?: string;
  memory?: string;
  graphics?: string;
  sound?: string;
  display?: string;
  media?: string;
  maxcontrollers?: string;
  rating?: string;
}

export interface TGDBSearchResult {
  code: number;
  status: string;
  remaining_monthly_allowance: number;
  extra_allowance: number;
  pages: {
    previous: string | null;
    current: string;
    next: string | null;
  };
  data: {
    count: number;
    games: TGDBGame[];
  };
  include?: {
    boxart?: {
      base_url: {
        original: string;
        small: string;
        thumb: string;
        medium: string;
        large: string;
        croppedsmall?: string;
      };
      data: Record<string, Array<{
        id: number;
        type: string;
        side: string;
        filename: string;
        resolution?: string;
      }>>;
    };
    platform?: {
      data: Record<string, TGDBPlatform>;
    };
  };
}

export interface TGDBPlatformListResult {
  code: number;
  status: string;
  data: {
    count: number;
    platforms: TGDBPlatform[];
  };
}

export async function searchGamesByName(
  name: string,
  page = 1,
  includeBoxart = true
): Promise<TGDBSearchResult> {
  const params = new URLSearchParams({
    apikey: TGDB_API_KEY,
    name,
    page: String(page),
    fields: 'overview,genres,publishers,players,rating,platform',
  });
  if (includeBoxart) {
    params.append('include', 'boxart,platform');
  }

  const response = await fetch(`${TGDB_BASE_URL}/Games/ByGameName?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`TheGamesDB API error: ${response.status}`);
  }
  return response.json();
}

export async function getGamesByPlatform(
  platformId: number,
  page = 1,
  includeBoxart = true
): Promise<TGDBSearchResult> {
  const params = new URLSearchParams({
    apikey: TGDB_API_KEY,
    id: String(platformId),
    page: String(page),
    fields: 'overview,genres,publishers,players,rating,platform',
  });
  if (includeBoxart) {
    params.append('include', 'boxart,platform');
  }

  const response = await fetch(`${TGDB_BASE_URL}/Games/ByPlatformID?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`TheGamesDB API error: ${response.status}`);
  }
  return response.json();
}

export async function getGameById(
  gameId: number,
  includeBoxart = true
): Promise<TGDBSearchResult> {
  const params = new URLSearchParams({
    apikey: TGDB_API_KEY,
    id: String(gameId),
    fields: 'overview,genres,publishers,players,rating,platform,youtube,alternates',
  });
  if (includeBoxart) {
    params.append('include', 'boxart,platform');
  }

  const response = await fetch(`${TGDB_BASE_URL}/Games/ByGameID?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`TheGamesDB API error: ${response.status}`);
  }
  return response.json();
}

export async function getPlatforms(): Promise<TGDBPlatformListResult> {
  const response = await fetch(`${TGDB_BASE_URL}/Platforms?apikey=${TGDB_API_KEY}`);
  if (!response.ok) {
    throw new Error(`TheGamesDB API error: ${response.status}`);
  }
  return response.json();
}

export function getGameCoverUrl(
  result: TGDBSearchResult,
  gameId: number,
  size: 'thumb' | 'small' | 'medium' | 'large' | 'original' = 'medium'
): string {
  if (!result.include?.boxart) return '';
  const boxarts = result.include.boxart.data[String(gameId)];
  if (!boxarts || boxarts.length === 0) return '';
  const front = boxarts.find((b) => b.side === 'front') || boxarts[0];
  const baseUrl = result.include.boxart.base_url[size];
  return `${baseUrl}${front.filename}`;
}

export function getGameBannerUrl(
  result: TGDBSearchResult,
  gameId: number,
  size: 'thumb' | 'small' | 'medium' | 'large' | 'original' = 'large'
): string {
  if (!result.include?.boxart) return '';
  const boxarts = result.include.boxart.data[String(gameId)];
  if (!boxarts || boxarts.length === 0) return '';
  const banner = boxarts.find((b) => b.type === 'banner') || boxarts[0];
  const baseUrl = result.include.boxart.base_url[size];
  return `${baseUrl}${banner.filename}`;
}
