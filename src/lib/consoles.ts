export interface ConsoleInfo {
  id: string;
  name: string;
  shortName: string;
  manufacturer: string;
  year: number;
  ejsCore: string;
  rawgPlatformId: number;
  extensions: string[];
  biosRequired: boolean;
  biosFile?: string;
  color: string;
  gradient: string;
  icon: string;
  description: string;
}

export const CONSOLES: ConsoleInfo[] = [
  {
    id: 'nes',
    name: 'Nintendo Entertainment System',
    shortName: 'NES',
    manufacturer: 'Nintendo',
    year: 1983,
    ejsCore: 'nes',
    rawgPlatformId: 49,
    extensions: ['.nes', '.zip'],
    biosRequired: false,
    color: '#ef4444',
    gradient: 'from-red-600 to-red-800',
    icon: 'gamepad-2',
    description: 'O console que revolucionou os jogos nos anos 80 com clássicos como Mario e Zelda.'
  },
  {
    id: 'snes',
    name: 'Super Nintendo',
    shortName: 'SNES',
    manufacturer: 'Nintendo',
    year: 1990,
    ejsCore: 'snes',
    rawgPlatformId: 79,
    extensions: ['.smc', '.sfc', '.zip'],
    biosRequired: false,
    color: '#8b5cf6',
    gradient: 'from-violet-600 to-violet-800',
    icon: 'gamepad-2',
    description: 'A era de ouro dos RPGs e jogos de plataforma com gráficos de 16 bits.'
  },
  {
    id: 'segaMD',
    name: 'Sega Mega Drive / Genesis',
    shortName: 'Genesis',
    manufacturer: 'Sega',
    year: 1988,
    ejsCore: 'segaMD',
    rawgPlatformId: 167,
    extensions: ['.md', '.bin', '.gen', '.zip'],
    biosRequired: false,
    color: '#3b82f6',
    gradient: 'from-blue-600 to-blue-800',
    icon: 'gamepad-2',
    description: 'Sonic, Streets of Rage e a rivalidade que definiu uma geração.'
  },
  {
    id: 'gb',
    name: 'Game Boy',
    shortName: 'Game Boy',
    manufacturer: 'Nintendo',
    year: 1989,
    ejsCore: 'gb',
    rawgPlatformId: 33,
    extensions: ['.gb', '.zip'],
    biosRequired: false,
    color: '#22c55e',
    gradient: 'from-green-600 to-green-800',
    icon: 'smartphone',
    description: 'O portátil que colocou o mundo dos jogos no seu bolso.'
  },
  {
    id: 'gba',
    name: 'Game Boy Advance',
    shortName: 'GBA',
    manufacturer: 'Nintendo',
    year: 2001,
    ejsCore: 'gba',
    rawgPlatformId: 24,
    extensions: ['.gba', '.zip'],
    biosRequired: true,
    biosFile: 'gba_bios.bin',
    color: '#f59e0b',
    gradient: 'from-amber-600 to-amber-800',
    icon: 'smartphone',
    description: 'Gráficos avançados em um portátil compacto com jogos épicos.'
  },
  {
    id: 'n64',
    name: 'Nintendo 64',
    shortName: 'N64',
    manufacturer: 'Nintendo',
    year: 1996,
    ejsCore: 'n64',
    rawgPlatformId: 83,
    extensions: ['.z64', '.n64', '.v64', '.zip'],
    biosRequired: false,
    color: '#f97316',
    gradient: 'from-orange-600 to-orange-800',
    icon: 'gamepad-2',
    description: 'Jogos em 3D que mudaram para sempre a indústria dos games.'
  },
  {
    id: 'psx',
    name: 'PlayStation',
    shortName: 'PS1',
    manufacturer: 'Sony',
    year: 1994,
    ejsCore: 'psx',
    rawgPlatformId: 27,
    extensions: ['.bin', '.cue', '.iso', '.zip'],
    biosRequired: true,
    biosFile: 'psx_bios.bin',
    color: '#6366f1',
    gradient: 'from-indigo-600 to-indigo-800',
    icon: 'disc',
    description: 'A revolução dos CDs e jogos em 3D que dominou os anos 90.'
  },
  {
    id: 'nds',
    name: 'Nintendo DS',
    shortName: 'NDS',
    manufacturer: 'Nintendo',
    year: 2004,
    ejsCore: 'nds',
    rawgPlatformId: 13,
    extensions: ['.nds', '.zip'],
    biosRequired: false,
    color: '#ec4899',
    gradient: 'from-pink-600 to-pink-800',
    icon: 'smartphone',
    description: 'Duas telas, stylus e uma biblioteca incrível de jogos portáteis.'
  }
];

export function getConsoleById(id: string): ConsoleInfo | undefined {
  return CONSOLES.find((c) => c.id === id);
}

export function getConsoleByRawgId(rawgId: number): ConsoleInfo | undefined {
  return CONSOLES.find((c) => c.rawgPlatformId === rawgId);
}
