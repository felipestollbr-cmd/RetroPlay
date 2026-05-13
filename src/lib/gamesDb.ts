export interface GameEntry {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl: string;
  rating: number;
  year: number;
  genre: string;
  developer: string;
  players?: string;
  archiveId?: string;
  archiveFile?: string;
}

export const NES_GAMES: GameEntry[] = [
  {
    id: 'nes-1', title: 'Super Mario Bros.', slug: 'super-mario-bros',
    description: 'O encanador Mario deve salvar a Princesa Peach do malvado Bowser.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png',
    rating: 4.9, year: 1985, genre: 'Platformer', developer: 'Nintendo', players: '1-2',
    archiveId: 'SMB1Archive',
    archiveFile: 'Super Mario Bros. [GoodSet - GoodNES V3.37].zip',
  },
  {
    id: 'nes-2', title: 'The Legend of Zelda', slug: 'the-legend-of-zelda',
    description: 'Link deve salvar a Princesa Zelda e o reino de Hyrule de Ganon.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/41/Legend_of_zelda_cover_%28with_cartridge%29_gold.png',
    rating: 4.8, year: 1986, genre: 'Action-Adventure', developer: 'Nintendo', players: '1',
    archiveId: 'the-legend-of-zelda-dark-labyrinth-pacnsacdave-nes-homebrew-game',
    archiveFile: 'Zelda - Dark Labyrinth.zip',
  },
  {
    id: 'nes-3', title: 'Mega Man 2', slug: 'mega-man-2',
    description: 'Mega Man enfrenta 8 novos Robot Masters para salvar o mundo.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/Megaman2_box.jpg',
    rating: 4.7, year: 1988, genre: 'Platformer', developer: 'Capcom', players: '1'
  },
  {
    id: 'nes-4', title: 'Contra', slug: 'contra',
    description: 'Dois soldados lutam contra uma força alienígena.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/65/Contra_cover.jpg',
    rating: 4.6, year: 1987, genre: 'Run and Gun', developer: 'Konami', players: '1-2'
  },
  {
    id: 'nes-5', title: 'Castlevania', slug: 'castlevania',
    description: 'Simon Belmont enfrenta Drácula e seus monstros no castelo.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/51/Castlevania_1_cover.png',
    rating: 4.5, year: 1986, genre: 'Action', developer: 'Konami', players: '1'
  },
  {
    id: 'nes-6', title: 'Metroid', slug: 'metroid',
    description: 'Samus Aran explora o planeta Zebes para derrotar os Space Pirates.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Metroid_boxart.jpg',
    rating: 4.6, year: 1986, genre: 'Action-Adventure', developer: 'Nintendo', players: '1'
  },
  {
    id: 'nes-7', title: 'Tetris', slug: 'tetris',
    description: 'O clássico jogo de quebra-cabeça com blocos.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Tetris_NES_cover_art.jpg',
    rating: 4.5, year: 1989, genre: 'Puzzle', developer: 'Nintendo', players: '1-2'
  },
  {
    id: 'nes-8', title: 'Duck Hunt', slug: 'duck-hunt',
    description: 'Caça patos com a Zapper light gun.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/14/DuckHuntBox.jpg',
    rating: 4.0, year: 1984, genre: 'Shooter', developer: 'Nintendo', players: '1-2'
  },
  {
    id: 'nes-9', title: 'Final Fantasy', slug: 'final-fantasy',
    description: 'Quatro guerreiros da luz devem salvar o mundo dos quatro elementais.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d8/FF1_USA_boxart.jpg',
    rating: 4.4, year: 1987, genre: 'RPG', developer: 'Square', players: '1'
  },
  {
    id: 'nes-10', title: 'Punch-Out!!', slug: 'punch-out',
    description: 'Little Mac sobe no ringue para se tornar campeão mundial de boxe.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/90/Punch-out_mrdream_boxart.png',
    rating: 4.5, year: 1987, genre: 'Sports', developer: 'Nintendo', players: '1'
  },
];

export const SNES_GAMES: GameEntry[] = [
  {
    id: 'snes-1', title: 'Super Mario World', slug: 'super-mario-world',
    description: 'Mario e Yoshi exploram Dinosaur Land para salvar a Princesa Peach.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/32/Super_Mario_World_Coverart.png',
    rating: 4.9, year: 1990, genre: 'Platformer', developer: 'Nintendo', players: '1-2',
    archiveId: 'super-mario-world-utsurun-desu',
    archiveFile: 'super utsurun world.sfc',
  },
  {
    id: 'snes-2', title: 'The Legend of Zelda: A Link to the Past', slug: 'zelda-link-to-the-past',
    description: 'Link viaja entre o mundo da luz e o mundo das trevas para salvar Hyrule.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/22/The_Legend_of_Zelda_A_Link_to_the_Past_SNES_Game_Cover.jpg',
    rating: 4.9, year: 1991, genre: 'Action-Adventure', developer: 'Nintendo', players: '1',
    archiveId: 'legend-of-zelda-the-a-link-to-the-past',
    archiveFile: 'Legend of Zelda, The_ A Link to the Past.zip',
  },
  {
    id: 'snes-3', title: 'Super Metroid', slug: 'super-metroid',
    description: 'Samus Aran retorna a Zebes para resgatar um bebê Metroid.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Smetroidbox.jpg',
    rating: 4.9, year: 1994, genre: 'Action-Adventure', developer: 'Nintendo', players: '1'
  },
  {
    id: 'snes-4', title: 'Chrono Trigger', slug: 'chrono-trigger',
    description: 'Uma jornada épica através do tempo para salvar o futuro.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Chrono_Trigger.jpg',
    rating: 4.9, year: 1995, genre: 'RPG', developer: 'Square', players: '1'
  },
  {
    id: 'snes-5', title: 'Super Mario Kart', slug: 'super-mario-kart',
    description: 'Mario e amigos competem em corridas de kart com itens especiais.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/38/Supermariokart_box.JPG',
    rating: 4.7, year: 1992, genre: 'Racing', developer: 'Nintendo', players: '1-2'
  },
  {
    id: 'snes-6', title: 'Street Fighter II', slug: 'street-fighter-ii',
    description: 'O jogo de luta que definiu um gênero inteiro.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1d/SF2_JPN_flyer.jpg',
    rating: 4.6, year: 1992, genre: 'Fighting', developer: 'Capcom', players: '1-2'
  },
  {
    id: 'snes-7', title: 'Donkey Kong Country', slug: 'donkey-kong-country',
    description: 'DK e Diddy Kong recuperam seu estoque de bananas roubadas.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1a/Donkey_Kong_Country_SNES_cover.png',
    rating: 4.7, year: 1994, genre: 'Platformer', developer: 'Rare', players: '1-2'
  },
  {
    id: 'snes-8', title: 'Final Fantasy VI', slug: 'final-fantasy-vi',
    description: 'Uma história épica sobre magia, tecnologia e esperança.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e7/Final_Fantasy_VI_box.png',
    rating: 4.9, year: 1994, genre: 'RPG', developer: 'Square', players: '1'
  },
];

export const GENESIS_GAMES: GameEntry[] = [
  {
    id: 'gen-1', title: 'Sonic the Hedgehog', slug: 'sonic-the-hedgehog',
    description: 'Sonic corre em alta velocidade para salvar os animais do Dr. Robotnik.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Sonic_the_Hedgehog_1_Genesis_box_art.jpg',
    rating: 4.7, year: 1991, genre: 'Platformer', developer: 'Sega', players: '1'
  },
  {
    id: 'gen-2', title: 'Streets of Rage 2', slug: 'streets-of-rage-2',
    description: 'Três lutadores limpam as ruas da cidade do crime.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Streets_of_Rage_2_cover.jpg',
    rating: 4.6, year: 1992, genre: 'Beat em Up', developer: 'Sega', players: '1-2'
  },
  {
    id: 'gen-3', title: 'Gunstar Heroes', slug: 'gunstar-heroes',
    description: 'Ação frenética com armas combináveis e explosões.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Gunstar_Heroes_Coverart.png',
    rating: 4.5, year: 1993, genre: 'Run and Gun', developer: 'Treasure', players: '1-2'
  },
  {
    id: 'gen-4', title: 'Phantasy Star IV', slug: 'phantasy-star-iv',
    description: 'RPG épico de ficção científica no sistema Algol.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8b/Phantasy_Star_IV_box.jpg',
    rating: 4.6, year: 1993, genre: 'RPG', developer: 'Sega', players: '1'
  },
  {
    id: 'gen-5', title: 'Aladdin', slug: 'aladdin',
    description: 'Aladdin luta contra Jafar para salvar Agrabah.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1d/Disney%27s_Aladdin_Coverart.png',
    rating: 4.3, year: 1993, genre: 'Platformer', developer: 'Virgin', players: '1'
  },
  {
    id: 'gen-6', title: 'Earthworm Jim', slug: 'earthworm-jim',
    description: 'Uma minhoca com um traje espacial salva a Princesa Whats-Her-Name.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/72/Earthworm_Jim_cover.jpg',
    rating: 4.4, year: 1994, genre: 'Platformer', developer: 'Shiny', players: '1'
  },
];

export const GB_GAMES: GameEntry[] = [
  {
    id: 'gb-1', title: 'Tetris', slug: 'tetris-gb',
    description: 'O clássico puzzle game que acompanhou o Game Boy.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Tetris_%28Game_Boy%29_boxart.jpg',
    rating: 4.7, year: 1989, genre: 'Puzzle', developer: 'Nintendo', players: '1-2'
  },
  {
    id: 'gb-2', title: 'Super Mario Land', slug: 'super-mario-land',
    description: 'Mario viaja para Sarasaland para salvar a Princesa Daisy.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Super_Mario_Land_boxart.png',
    rating: 4.3, year: 1989, genre: 'Platformer', developer: 'Nintendo', players: '1'
  },
  {
    id: 'gb-3', title: 'Pokemon Red', slug: 'pokemon-red',
    description: 'Capture e treine Pokémon para se tornar o campeão de Kanto.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Red_and_Blue_cover_art.jpg',
    rating: 4.8, year: 1996, genre: 'RPG', developer: 'Game Freak', players: '1-2'
  },
  {
    id: 'gb-4', title: 'The Legend of Zelda: Link\'s Awakening', slug: 'links-awakening',
    description: 'Link naufraga na Ilha Koholint e deve acordar o Wind Fish.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c1/Link%27s_Awakening.png',
    rating: 4.8, year: 1993, genre: 'Action-Adventure', developer: 'Nintendo', players: '1'
  },
];

export const GBC_GAMES: GameEntry[] = [
  {
    id: 'gbc-1', title: 'Pokemon Gold', slug: 'pokemon-gold',
    description: 'Explore Johto em um clássico RPG portátil colorido.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/25/Pok%C3%A9mon_Gold_Boxart.jpg',
    rating: 4.8, year: 1999, genre: 'RPG', developer: 'Game Freak', players: '1-2'
  },
  {
    id: 'gbc-2', title: 'The Legend of Zelda: Oracle of Ages', slug: 'oracle-of-ages',
    description: 'Link viaja por dois mundos para recuperar as esmeraldas sagradas.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Boxart_zelda_oracle_of_ages.png',
    rating: 4.7, year: 2001, genre: 'Action-Adventure', developer: 'Capcom', players: '1'
  },
  {
    id: 'gbc-3', title: 'Mario Golf', slug: 'mario-golf-gbc',
    description: 'Golf leve com personagens da Nintendo em campos coloridos.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/49/Mario_Golf_box_art.jpg',
    rating: 4.4, year: 1999, genre: 'Sports', developer: 'Camelot', players: '1-4'
  },
];

export const ARCADE_GAMES: GameEntry[] = [
  {
    id: 'arcade-1', title: 'Pac-Man', slug: 'pac-man-arcade',
    description: 'Goblins comem bolas em labirintos coloridos.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Pac-Man_Cover_Art.jpg',
    rating: 4.4, year: 1980, genre: 'Arcade', developer: 'Namco', players: '1-2'
  },
  {
    id: 'arcade-2', title: 'Street Fighter II', slug: 'street-fighter-ii-arcade',
    description: 'Duelos intensos com personagens icônicos e combos memoráveis.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1d/SF2_JPN_flyer.jpg',
    rating: 4.7, year: 1991, genre: 'Fighting', developer: 'Capcom', players: '1-2'
  },
];

export const DOS_GAMES: GameEntry[] = [
  {
    id: 'dos-1', title: 'Doom', slug: 'doom-dos',
    description: 'Dedique-se a uma aventura visceral de tiro em primeira pessoa.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg',
    rating: 4.8, year: 1993, genre: 'FPS', developer: 'id Software', players: '1'
  },
  {
    id: 'dos-2', title: 'Commander Keen', slug: 'commander-keen',
    description: 'O jovem Billy viaja por planetas alienígenas em um clássico plataforma.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d8/Commander_Keen_cover_art.jpg',
    rating: 4.3, year: 1990, genre: 'Platformer', developer: 'id Software', players: '1'
  },
];

export const GBA_GAMES: GameEntry[] = [
  {
    id: 'gba-1', title: 'Pokemon FireRed', slug: 'pokemon-firered',
    description: 'Remake do clássico Pokémon Red com gráficos melhorados.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Pok%C3%A9mon_FireRed_cover.png',
    rating: 4.7, year: 2004, genre: 'RPG', developer: 'Game Freak', players: '1-4'
  },
  {
    id: 'gba-2', title: 'Metroid Fusion', slug: 'metroid-fusion',
    description: 'Samus enfrenta um parasita X em uma estação espacial.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/99/Metroid_Fusion_box_art.jpg',
    rating: 4.7, year: 2002, genre: 'Action-Adventure', developer: 'Nintendo', players: '1'
  },
  {
    id: 'gba-3', title: 'The Legend of Zelda: The Minish Cap', slug: 'minish-cap',
    description: 'Link usa o poder do Minish Cap para encolher e explorar.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5d/The_Legend_of_Zelda_The_Minish_Cap_Game_Cover.JPG',
    rating: 4.6, year: 2004, genre: 'Action-Adventure', developer: 'Nintendo', players: '1'
  },
  {
    id: 'gba-4', title: 'Mario Kart: Super Circuit', slug: 'mario-kart-super-circuit',
    description: 'Mario Kart no Game Boy Advance com 20 pistas clássicas.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Mario_Kart_Super_Circuit_box_art.jpg',
    rating: 4.3, year: 2001, genre: 'Racing', developer: 'Nintendo', players: '1-4'
  },
];

export const ATARI_GAMES: GameEntry[] = [
  {
    id: 'atari-1', title: 'Pac-Man', slug: 'pac-man',
    description: 'Ajude Pac-Man a devorar pontos e evitar fantasmas em um labirinto clássico.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Pac-Man_Cover_Art.jpg',
    rating: 4.4, year: 1981, genre: 'Arcade', developer: 'Atari', players: '1-2'
  },
  {
    id: 'atari-2', title: 'Adventure', slug: 'adventure',
    description: 'Explore um mundo medieval pixelado em busca do cálice mágico.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/73/Adventure_Atari_2600_box_art.jpg',
    rating: 4.2, year: 1980, genre: 'Adventure', developer: 'Atari', players: '1-2'
  },
  {
    id: 'atari-3', title: 'Space Invaders', slug: 'space-invaders',
    description: 'Defenda a Terra contra ondas de invasores espaciais clássicos.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/59/Space_Invaders_2600.png',
    rating: 4.4, year: 1980, genre: 'Shooter', developer: 'Taito', players: '1-2'
  },
  {
    id: 'atari-4', title: 'Frogger', slug: 'frogger',
    description: 'Ajude o sapo a atravessar estradas e rios em segurança.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/83/Frogger_2600_box.jpg',
    rating: 4.1, year: 1982, genre: 'Arcade', developer: 'Konami', players: '1-2'
  },
];

export const N64_GAMES: GameEntry[] = [ 
  {
    id: 'n64-1', title: 'Super Mario 64', slug: 'super-mario-64',
    description: 'Mario explora o Castelo da Peach em 3D pela primeira vez.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Super_Mario_64_box_cover.jpg',
    rating: 4.9, year: 1996, genre: 'Platformer', developer: 'Nintendo', players: '1'
  },
  {
    id: 'n64-2', title: 'The Legend of Zelda: Ocarina of Time', slug: 'ocarina-of-time',
    description: 'Link viaja no tempo para salvar Hyrule de Ganondorf.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8e/The_Legend_of_Zelda_Ocarina_of_Time_box_art.png',
    rating: 4.9, year: 1998, genre: 'Action-Adventure', developer: 'Nintendo', players: '1'
  },
  {
    id: 'n64-3', title: 'GoldenEye 007', slug: 'goldeneye-007',
    description: 'James Bond em uma missão para impedir um ataque nuclear.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/00/GoldenEye_007_1997_box.jpg',
    rating: 4.6, year: 1997, genre: 'FPS', developer: 'Rare', players: '1-4'
  },
  {
    id: 'n64-4', title: 'Mario Kart 64', slug: 'mario-kart-64',
    description: 'Corrida de kart 3D com itens e pistas icônicas.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Mario_Kart_64box.png',
    rating: 4.5, year: 1996, genre: 'Racing', developer: 'Nintendo', players: '1-4'
  },
];

export const PSX_GAMES: GameEntry[] = [
  {
    id: 'psx-1', title: 'Final Fantasy VII', slug: 'final-fantasy-vii',
    description: 'Cloud e seus amigos lutam contra a corporação Shinra.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
    rating: 4.9, year: 1997, genre: 'RPG', developer: 'Square', players: '1'
  },
  {
    id: 'psx-2', title: 'Metal Gear Solid', slug: 'metal-gear-solid',
    description: 'Solid Snake infiltra-se em uma base para deter uma ameaça nuclear.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png',
    rating: 4.8, year: 1998, genre: 'Stealth', developer: 'Konami', players: '1'
  },
  {
    id: 'psx-3', title: 'Castlevania: Symphony of the Night', slug: 'symphony-of-the-night',
    description: 'Alucard explora o castelo do Drácula em um metroidvania definitivo.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Castlevania_Symphony_of_the_Night_cover.jpg',
    rating: 4.9, year: 1997, genre: 'Action-Adventure', developer: 'Konami', players: '1'
  },
  {
    id: 'psx-4', title: 'Crash Bandicoot', slug: 'crash-bandicoot',
    description: 'Crash deve salvar sua namorada Tawna do Dr. Neo Cortex.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Crash_Bandicoot_Cover.png',
    rating: 4.4, year: 1996, genre: 'Platformer', developer: 'Naughty Dog', players: '1'
  },
];

export const NDS_GAMES: GameEntry[] = [
  {
    id: 'nds-1', title: 'New Super Mario Bros.', slug: 'new-super-mario-bros',
    description: 'Mario retorna em uma aventura 2.5D com power-ups novos.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d1/NewSuperMarioBrothers.jpg',
    rating: 4.6, year: 2006, genre: 'Platformer', developer: 'Nintendo', players: '1-4'
  },
  {
    id: 'nds-2', title: 'Pokemon Diamond', slug: 'pokemon-diamond',
    description: 'Explore a região de Sinnoh e capture novos Pokémon.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/59/Pok%C3%A9mon_Diamond_box_art.jpg',
    rating: 4.5, year: 2006, genre: 'RPG', developer: 'Game Freak', players: '1-4'
  },
  {
    id: 'nds-3', title: 'The Legend of Zelda: Phantom Hourglass', slug: 'phantom-hourglass',
    description: 'Link navega pelos mares para resgatar Tetra.',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0e/The_Legend_of_Zelda_Phantom_Hourglass_Box_Art.jpg',
    rating: 4.5, year: 2007, genre: 'Action-Adventure', developer: 'Nintendo', players: '1'
  },
];

const ALL_GAMES: Record<string, GameEntry[]> = {
  nes: NES_GAMES,
  snes: SNES_GAMES,
  segaMD: GENESIS_GAMES,
  gb: GB_GAMES,
  gbc: GBC_GAMES,
  arcade: ARCADE_GAMES,
  dos: DOS_GAMES,
  atari2600: ATARI_GAMES,
  gba: GBA_GAMES,
  n64: N64_GAMES,
  psx: PSX_GAMES,
  nds: NDS_GAMES,
};

export function getGamesForConsole(consoleId: string): GameEntry[] {
  return ALL_GAMES[consoleId] || [];
}

export function getGameBySlug(consoleId: string, slug: string): GameEntry | undefined {
  return getGamesForConsole(consoleId).find((game) => game.slug === slug);
}

export function searchGames(query: string): GameEntry[] {
  const q = query.toLowerCase();
  const all: GameEntry[] = [];
  for (const games of Object.values(ALL_GAMES)) {
    all.push(...games);
  }
  return all.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q) ||
      g.developer.toLowerCase().includes(q)
  );
}
