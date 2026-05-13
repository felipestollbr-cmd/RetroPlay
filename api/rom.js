// api/rom.js
// Edge Function: busca ROM no Archive.org e faz stream para o browser
// Sem CORS, sem limite de tamanho, sem ads
export const config = { runtime: 'edge' };

const ROM_EXTENSIONS = {
  nes:       ['.nes'],
  snes:      ['.smc', '.sfc', '.fig', '.swc'],
  gba:       ['.gba'],
  gb:        ['.gb'],
  gbc:       ['.gbc'],
  genesis:   ['.md', '.bin', '.gen', '.smd'],
  segaMD:    ['.md', '.bin', '.gen', '.smd'],
  n64:       ['.z64', '.n64', '.v64'],
  ps1:       ['.bin', '.iso', '.pbp', '.cue'],
  atari2600: ['.a26', '.bin'],
  nds:       ['.nds'],
  arcade:    ['.zip'],
  dos:       ['.zip'],
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const id          = searchParams.get('id');
  const consoleId   = searchParams.get('console') ?? 'nes';

  if (!id) {
    return new Response(JSON.stringify({ error: 'id obrigatório' }), { status: 400 });
  }

  // 1. Busca metadata do item no Archive.org
  let files;
  try {
    const metaRes = await fetch(`https://archive.org/metadata/${id}/files`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!metaRes.ok) throw new Error('metadata falhou');
    const meta = await metaRes.json();
    files = meta.result ?? [];
  } catch {
    return new Response(JSON.stringify({ error: 'Item não encontrado no Archive.org' }), { status: 404 });
  }

  // 2. Encontra o arquivo de ROM correto pela extensão
  const exts = ROM_EXTENSIONS[consoleId] ?? ['.zip'];

  // Prioridade: exts específicas do console; fallback: .zip
  let romFile = files.find(f =>
    exts.some(ext => f.name?.toLowerCase().endsWith(ext))
  );

  // Se não achou extensão específica, tenta .zip
  if (!romFile) {
    romFile = files.find(f => f.name?.toLowerCase().endsWith('.zip'));
  }

  if (!romFile) {
    return new Response(JSON.stringify({ error: 'ROM não encontrada nos arquivos do item' }), { status: 404 });
  }

  // 3. Faz stream do arquivo diretamente do Archive.org
  const romUrl = `https://archive.org/download/${id}/${encodeURIComponent(romFile.name)}`;

  try {
    const upstream = await fetch(romUrl);
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: 'Falha ao baixar ROM' }), { status: 502 });
    }

    // Stream direto para o cliente, com headers de cache
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type':        'application/octet-stream',
        'Content-Disposition': `attachment; filename="${romFile.name}"`,
        'Cache-Control':       'public, max-age=86400, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
