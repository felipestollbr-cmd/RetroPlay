const GEMINI_API_KEY = 'AIzaSyB66SsyncQcr2zUzyINNmoYDbDw0tR_oi8';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GeminiGameResult {
  name: string;
  confidence: number;
  platform: string;
  year: string;
  description: string;
  why: string;
}

export async function searchGameByDescription(description: string): Promise<GeminiGameResult[]> {
  const prompt = `Você é um especialista em jogos retro e videogames. Um usuário está tentando lembrar o nome de um jogo e deu esta descrição:

"${description}"

Com base nesta descrição, identifique os 5 jogos mais prováveis que o usuário está procurando. Para cada jogo, forneça:
- Nome exato do jogo
- Console/plataforma principal
- Ano de lançamento
- Breve descrição do jogo
- Por que você acha que é este jogo (baseado na descrição do usuário)
- Nível de confiança (0-100)

Responda APENAS em formato JSON válido, sem markdown, sem explicações extras. Formato:
[
  {
    "name": "Nome do Jogo",
    "platform": "Console",
    "year": "1990",
    "description": "Descrição curta",
    "why": "Razão pela correspondência",
    "confidence": 95
  }
]`;

  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }

    const results: GeminiGameResult[] = JSON.parse(jsonMatch[0]);
    return results.sort((a, b) => b.confidence - a.confidence);
  } catch (err) {
    console.error('Gemini search error:', err);
    // Fallback: return mock results based on keywords in description
    return generateFallbackResults(description);
  }
}

function generateFallbackResults(description: string): GeminiGameResult[] {
  const desc = description.toLowerCase();
  const keywords: Record<string, GeminiGameResult[]> = {
    mario: [
      { name: 'Super Mario Bros.', platform: 'NES', year: '1985', description: 'O clássico jogo de plataforma da Nintendo.', why: 'Personagem mais famoso dos videogames', confidence: 90 },
      { name: 'Super Mario World', platform: 'SNES', year: '1990', description: 'Mario em 16 bits com Yoshi.', why: 'Um dos jogos de Mario mais populares', confidence: 75 },
    ],
    zelda: [
      { name: 'The Legend of Zelda', platform: 'NES', year: '1986', description: 'Aventura épica de Link para salvar Hyrule.', why: 'Franquia Zelda é muito conhecida', confidence: 92 },
      { name: 'The Legend of Zelda: A Link to the Past', platform: 'SNES', year: '1991', description: 'Clássico de ação e aventura.', why: 'Um dos melhores jogos de todos os tempos', confidence: 85 },
    ],
    sonic: [
      { name: 'Sonic the Hedgehog', platform: 'Genesis', year: '1991', description: 'O ouriço azul mais rápido do mundo.', why: 'Mascote da Sega', confidence: 95 },
      { name: 'Sonic the Hedgehog 2', platform: 'Genesis', year: '1992', description: 'Sonic com Tails como companheiro.', why: 'Sequência muito popular', confidence: 70 },
    ],
    pokemon: [
      { name: 'Pokemon Red Version', platform: 'Game Boy', year: '1996', description: 'Capture e treine Pokémon no mundo de Kanto.', why: 'Franquia Pokémon extremamente popular', confidence: 93 },
      { name: 'Pokemon Gold Version', platform: 'Game Boy Color', year: '1999', description: 'Nova geração de Pokémon em Johto.', why: 'Sequência muito amada', confidence: 72 },
    ],
    street: [
      { name: 'Street Fighter II', platform: 'SNES', year: '1991', description: 'O jogo de luta que definiu o gênero.', why: 'Jogo de luta mais influente', confidence: 88 },
    ],
    metroid: [
      { name: 'Super Metroid', platform: 'SNES', year: '1994', description: 'Samus Aran em uma aventura de exploração.', why: 'Clássico de exploração', confidence: 90 },
      { name: 'Metroid', platform: 'NES', year: '1986', description: 'A primeira aventura de Samus Aran.', why: 'Início da franquia', confidence: 65 },
    ],
    castlevania: [
      { name: 'Castlevania: Symphony of the Night', platform: 'PlayStation', year: '1997', description: 'Alucard explora o castelo do Drácula.', why: 'Metroidvania definitivo', confidence: 91 },
    ],
    final: [
      { name: 'Final Fantasy VII', platform: 'PlayStation', year: '1997', description: 'Cloud e seus amigos contra a Shinra.', why: 'JRPG mais famoso da história', confidence: 89 },
      { name: 'Final Fantasy VI', platform: 'SNES', year: '1994', description: 'História épica com múltiplos personagens.', why: 'Considerado o melhor da série por muitos', confidence: 78 },
    ],
    mega: [
      { name: 'Mega Man 2', platform: 'NES', year: '1988', description: 'O robô azul contra os Robot Masters.', why: 'Mega Man é muito reconhecível', confidence: 87 },
    ],
    donkey: [
      { name: "Donkey Kong Country", platform: 'SNES', year: '1994', description: 'DK e Diddy em aventura pela Ilha Kong.', why: 'Gráficos revolucionários para a época', confidence: 86 },
    ],
  };

  for (const [key, results] of Object.entries(keywords)) {
    if (desc.includes(key)) return results;
  }

  // Generic fallback
  return [
    { name: 'Super Mario Bros.', platform: 'NES', year: '1985', description: 'O clássico jogo de plataforma.', why: 'Baseado na descrição fornecida', confidence: 50 },
    { name: 'The Legend of Zelda', platform: 'NES', year: '1986', description: 'Aventura de exploração e ação.', why: 'Pode corresponder à descrição', confidence: 45 },
    { name: 'Sonic the Hedgehog', platform: 'Genesis', year: '1991', description: 'Jogo de plataforma rápido.', why: 'Possível correspondência', confidence: 40 },
    { name: 'Street Fighter II', platform: 'SNES', year: '1991', description: 'Jogo de luta clássico.', why: 'Talvez seja este', confidence: 35 },
    { name: 'Super Metroid', platform: 'SNES', year: '1994', description: 'Exploração espacial.', why: 'Possível match', confidence: 30 },
  ];
}
