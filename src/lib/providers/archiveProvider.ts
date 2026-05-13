import type { CuratedGame, ProviderSearchOptions, SearchResult } from './types';

const IA_BASE = 'https://archive.org';

const PLATFORM_TO_CONSOLE: Record<string, string> = {
  'MS-DOS': 'dos',
  Windows: 'dos',
  PC: 'dos',
  'Software Library': 'dos',
  'Atari 2600': 'atari2600',
  'Atari 7800': 'atari2600',
  'Sega Genesis': 'segaMD',
  'Genesis': 'segaMD',
  'Super Nintendo': 'snes',
  'SNES': 'snes',
  'Nintendo Entertainment System': 'nes',
  NES: 'nes',
  'Game Boy': 'gb',
  'Game Boy Color': 'gbc',
  'Game Boy Advance': 'gba',
  'PlayStation': 'psx',
  'PS1': 'psx',
  'Nintendo 64': 'n64',
};

// Coleções de jogos abandonware e software na Internet Archive
const IA_COLLECTIONS = [
  { id: 'softwarelibrary_msdos', name: 'MS-DOS Games', platform: 'MS-DOS' },
  { id: 'softwarelibrary_win3', name: 'Windows 3.x Games', platform: 'Windows' },
  { id: 'classicpcgames', name: 'Classic PC Games', platform: 'PC' },
  { id: 'softwarelibrary', name: 'Software Library', platform: 'Various' },
];

function normalizeSlug(value: string) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getConsoleIdForPlatform(platform: string) {
  return PLATFORM_TO_CONSOLE[platform] ?? 'dos';
}

export async function searchArchiveGames(options: ProviderSearchOptions = {}): Promise<SearchResult> {
  try {
    const collection = IA_COLLECTIONS[0];
    const query = options.query
      ? `${options.query} AND collection:${collection.id}`
      : `collection:${collection.id}`;

    const params = new URLSearchParams({
      q: query,
      fl: 'identifier,title,year,description,creator',
      sort: 'downloads desc',
      rows: String(options.limit || 20),
      page: String(options.page || 1),
      output: 'json',
    });

    const response = await fetch(`${IA_BASE}/advancedsearch.php?${params.toString()}`);
    if (!response.ok) throw new Error('Archive.org API error');

    const data = await response.json();
    const items = data.response?.docs || [];

    const games: CuratedGame[] = [];

    for (const item of items) {
      const metaResponse = await fetch(`${IA_BASE}/metadata/${item.identifier}`, { mode: 'cors' }).catch(() => null);
      let coverUrl = '';
      let screenshotUrls: string[] = [];

      if (metaResponse?.ok) {
        const meta = await metaResponse.json();
        const files = meta.files || [];
        const imageFile = files.find((f: any) =>
          f.name.match(/\.(jpg|jpeg|png|gif)$/i) && !f.name.includes('thumb')
        );
        if (imageFile) {
          coverUrl = `${IA_BASE}/download/${item.identifier}/${imageFile.name}`;
        }
      }

      const consoleId = getConsoleIdForPlatform(collection.platform);
      games.push({
        id: `ia-${item.identifier}`,
        slug: normalizeSlug(item.identifier),
        consoleId,
        archiveId: item.identifier,
        title: item.title,
        description: item.description || `Jogo ${collection.platform} da coleção ${collection.name}`,
        provider: 'archive',
        providerName: 'Internet Archive',
        platform: [collection.platform],
        genre: [collection.name],
        coverUrl: coverUrl || `https://archive.org/services/img/${item.identifier}`,
        rating: 4.0,
        releaseDate: item.year,
        playUrl: `${IA_BASE}/embed/${item.identifier}`,
        downloadUrl: `${IA_BASE}/download/${item.identifier}`,
        archiveFile: undefined,
        tags: [collection.platform, 'abandonware', 'classic'],
        isFree: true,
        isOpenSource: false,
        isAbandonware: true,
        isBrowserGame: true,
        developer: item.creator,
      });
    }

    return { games, total: data.response?.numFound || games.length, provider: 'archive' };
  } catch {
    return getArchiveFallback(options);
  }
}

function getArchiveFallback(options: ProviderSearchOptions): SearchResult {
  const mockGames: CuratedGame[] = [
    {
      id: 'ia-doom',
      slug: 'doom',
      consoleId: 'dos',
      archiveId: 'DOOM_201405',
      title: 'DOOM',
      description: 'O jogo de tiro em primeira pessoa que revolucionou a indústria.',
      provider: 'archive',
      providerName: 'Internet Archive',
      platform: ['MS-DOS'],
      genre: ['FPS'],
      coverUrl: 'https://archive.org/services/img/DOOM_201405',
      rating: 4.9,
      releaseDate: '1993',
      playUrl: 'https://archive.org/embed/DOOM_201405',
      downloadUrl: 'https://archive.org/download/DOOM_201405/',
      archiveFile: undefined,
      tags: ['fps', 'classic', 'abandonware'],
      isFree: true,
      isOpenSource: true,
      isAbandonware: true,
      isBrowserGame: true,
      developer: 'id Software',
    },
    {
      id: 'ia-wolf3d',
      title: 'Wolfenstein 3D',
      description: 'O pioneiro dos jogos de tiro em primeira pessoa.',
      provider: 'archive',
      providerName: 'Internet Archive',
      platform: ['MS-DOS'],
      genre: ['FPS'],
      coverUrl: 'https://archive.org/services/img/msdos_Wolfenstein_3D_1992',
      rating: 4.7,
      releaseDate: '1992',
      playUrl: 'https://archive.org/embed/msdos_Wolfenstein_3D_1992',
      tags: ['fps', 'classic', 'abandonware'],
      isFree: true,
      isOpenSource: false,
      isAbandonware: true,
      isBrowserGame: true,
      developer: 'id Software',
    },
    {
      id: 'ia-oregon',
      title: 'The Oregon Trail',
      description: 'Clássico educativo sobre a jornada para o Oeste.',
      provider: 'archive',
      providerName: 'Internet Archive',
      platform: ['MS-DOS'],
      genre: ['Educational'],
      coverUrl: 'https://archive.org/services/img/msdos_Oregon_Trail_The_1990',
      rating: 4.6,
      releaseDate: '1990',
      playUrl: 'https://archive.org/embed/msdos_Oregon_Trail_The_1990',
      tags: ['educational', 'classic', 'abandonware'],
      isFree: true,
      isOpenSource: false,
      isAbandonware: true,
      isBrowserGame: true,
      developer: 'MECC',
    },
    {
      id: 'ia-prince',
      title: 'Prince of Persia',
      description: 'Aventura de plataforma com animações fluidas.',
      provider: 'archive',
      providerName: 'Internet Archive',
      platform: ['MS-DOS'],
      genre: ['Platformer'],
      coverUrl: 'https://archive.org/services/img/msdos_Prince_of_Persia_1990',
      rating: 4.8,
      releaseDate: '1989',
      playUrl: 'https://archive.org/embed/msdos_Prince_of_Persia_1990',
      tags: ['platformer', 'classic', 'abandonware'],
      isFree: true,
      isOpenSource: false,
      isAbandonware: true,
      isBrowserGame: true,
      developer: 'Broderbund',
    },
    {
      id: 'ia-simc',
      title: 'SimCity',
      description: 'O jogo de construção de cidades que iniciou um gênero.',
      provider: 'archive',
      providerName: 'Internet Archive',
      platform: ['MS-DOS'],
      genre: ['Simulation'],
      coverUrl: 'https://archive.org/services/img/msdos_SimCity_1989',
      rating: 4.7,
      releaseDate: '1989',
      playUrl: 'https://archive.org/embed/msdos_SimCity_1989',
      tags: ['simulation', 'strategy', 'classic'],
      isFree: true,
      isOpenSource: false,
      isAbandonware: true,
      isBrowserGame: true,
      developer: 'Maxis',
    },
  ];

  return { games: mockGames, total: mockGames.length, provider: 'archive' };
}
