export interface GameProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
  supportsStreaming: boolean;
  supportsBrowser: boolean;
  supportsDownload: boolean;
}

export interface CuratedGame {
  id: string;
  title: string;
  description: string;
  provider: string;
  providerName: string;
  platform: string[];
  genre: string[];
  coverUrl: string;
  bannerUrl?: string;
  screenshotUrls?: string[];
  rating: number;
  releaseDate?: string;
  playUrl?: string;
  downloadUrl?: string;
  steamAppId?: string;
  itchIoUrl?: string;
  tags: string[];
  isFree: boolean;
  isOpenSource: boolean;
  isAbandonware: boolean;
  isBrowserGame: boolean;
  players?: string;
  developer?: string;
  publisher?: string;
}

export interface SearchResult {
  games: CuratedGame[];
  total: number;
  provider: string;
}

export interface ProviderSearchOptions {
  query?: string;
  genre?: string;
  platform?: string;
  sortBy?: 'popular' | 'newest' | 'rating' | 'name';
  page?: number;
  limit?: number;
  freeOnly?: boolean;
}
