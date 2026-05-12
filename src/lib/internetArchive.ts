export interface IAROM {
  name: string;
  url: string;
  size: number;
  format: string;
}

export async function searchROMsOnIA(
  query: string,
  consoleName: string
): Promise<IAROM[]> {
  const searchQuery = `${query} ${consoleName} rom`;
  const encodedQuery = encodeURIComponent(searchQuery);

  try {
    const response = await fetch(
      `https://archive.org/advancedsearch.php?q=${encodedQuery}&fl[]=identifier&fl[]=title&sort[]=downloads+desc&rows=10&page=1&output=json&save=yes`,
      { mode: 'cors' }
    );

    if (!response.ok) return [];

    const data = await response.json();
    const items = data.response?.docs || [];
    const roms: IAROM[] = [];

    for (const item of items.slice(0, 5)) {
      try {
        const metaResponse = await fetch(
          `https://archive.org/metadata/${item.identifier}`,
          { mode: 'cors' }
        );
        if (!metaResponse.ok) continue;

        const meta = await metaResponse.json();
        const files = meta.files || [];

        const romFile = files.find((f: any) => {
          const ext = f.name.toLowerCase();
          return (
            ext.endsWith('.nes') ||
            ext.endsWith('.smc') ||
            ext.endsWith('.sfc') ||
            ext.endsWith('.md') ||
            ext.endsWith('.bin') ||
            ext.endsWith('.gen') ||
            ext.endsWith('.gb') ||
            ext.endsWith('.gba') ||
            ext.endsWith('.z64') ||
            ext.endsWith('.n64') ||
            ext.endsWith('.nds') ||
            ext.endsWith('.zip')
          );
        });

        if (romFile) {
          roms.push({
            name: item.title || romFile.name,
            url: `https://archive.org/download/${item.identifier}/${romFile.name}`,
            size: romFile.size || 0,
            format: romFile.name.split('.').pop() || 'unknown',
          });
        }
      } catch {
        continue;
      }
    }

    return roms;
  } catch {
    return [];
  }
}
