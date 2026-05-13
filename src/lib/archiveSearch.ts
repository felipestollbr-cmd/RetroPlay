import { searchROMsOnIA } from './internetArchive';

export interface ArchiveGame {
  id: string;
  identifier: string;
  title: string;
  consoleId: string;
  embedUrl: string;
  thumbnailUrl: string;
  archiveFile?: string;
}

function parseArchiveUrl(url: string) {
  const match = url.match(/archive\.org\/download\/([^/]+)\/(.+)$/i);
  if (!match) return null;
  return {
    identifier: match[1],
    archiveFile: decodeURIComponent(match[2]),
  };
}

const ROM_EXTENSIONS: Record<string, string[]> = {
  nes: ['.nes'],
  snes: ['.smc', '.sfc', '.fig', '.swc'],
  gba: ['.gba'],
  gb: ['.gb'],
  gbc: ['.gbc'],
  genesis: ['.md', '.bin', '.gen', '.smd'],
  segaMD: ['.md', '.bin', '.gen', '.smd'],
  n64: ['.z64', '.n64', '.v64'],
  ps1: ['.bin', '.iso', '.pbp', '.cue'],
  atari2600: ['.a26', '.bin'],
  nds: ['.nds'],
  arcade: ['.zip'],
  dos: ['.zip'],
};

function findArchiveFile(files: any[], consoleId: string) {
  const exts = ROM_EXTENSIONS[consoleId] ?? ['.zip'];
  let file = files.find((f: any) => exts.some(ext => f.name?.toLowerCase().endsWith(ext)));
  if (!file) {
    file = files.find((f: any) => f.name?.toLowerCase().endsWith('.zip'));
  }
  return file?.name;
}

export async function getArchiveGameByIdentifier(identifier: string, consoleId: string): Promise<ArchiveGame | null> {
  try {
    const response = await fetch(`https://archive.org/metadata/${identifier}`);
    if (!response.ok) return null;
    const meta = await response.json();
    const title = meta.metadata?.title || identifier;
    const files = meta.files || [];
    const archiveFile = findArchiveFile(files, consoleId);

    return {
      id: identifier,
      identifier,
      title,
      consoleId,
      embedUrl: '',
      thumbnailUrl: `https://archive.org/services/img/${identifier}`,
      archiveFile,
    };
  } catch {
    return null;
  }
}

export async function searchByTitle(
  title: string,
  consoleId: string,
  limit = 1
): Promise<ArchiveGame[]> {
  const roms = await searchROMsOnIA(title, consoleId);
  return roms.slice(0, limit).map((rom, index) => {
    const parsed = parseArchiveUrl(rom.url);
    const identifier = parsed?.identifier ?? `archive-${index}`;
    return {
      id: `${identifier}-${index}`,
      identifier,
      title: rom.name || title,
      consoleId,
      embedUrl: '',
      thumbnailUrl: `https://archive.org/services/img/${identifier}`,
      archiveFile: parsed?.archiveFile,
    };
  });
}
