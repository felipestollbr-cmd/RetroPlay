// src/pages/Home.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CONSOLES, ConsoleInfo } from '../lib/consoles';
import { NES_GAMES, SNES_GAMES, GameEntry } from '../lib/gamesDb'; // Importe as listas de jogos de outros consoles também

export default function Home() {
  const { user, signOut } = useAuth();
  // Estado para controlar qual console está selecionado
  const [selectedConsole, setSelectedConsole] = useState<ConsoleInfo | null>(null);

  // Função para buscar os jogos do console selecionado (lógica de exemplo)
  const getGamesForConsole = (consoleId: string): GameEntry[] => {
    switch (consoleId) {
      case 'nes': return NES_GAMES;
      case 'snes': return SNES_GAMES;
      // Adicione cases para os outros consoles (gba, gb, etc.)
      default: return [];
    }
  };

  const games = selectedConsole ? getGamesForConsole(selectedConsole.id) : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header da aplicação - igual ao que você já tem */}
      <header className="flex justify-between p-4 bg-gray-800">
        <h1 className="text-2xl font-bold">🎮 RetroPlay</h1>
        <div>
          <span className="mr-4">{user?.email}</span>
          <button onClick={signOut} className="bg-red-500 px-4 py-2 rounded">Sair</button>
        </div>
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Escolha um Console</h2>
        
        {/* Grid de Consoles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {CONSOLES.map((console) => (
            <div
              key={console.id}
              onClick={() => setSelectedConsole(console)}
              className={`cursor-pointer bg-gray-800 p-4 rounded-lg text-center transition-all hover:scale-105 ${selectedConsole?.id === console.id ? 'ring-4 ring-purple-500' : ''}`}
            >
              <img src={console.imageUrl} alt={console.name} className="w-full h-32 object-contain mb-3" />
              <h3 className="font-bold">{console.name}</h3>
              <p className="text-sm text-gray-400">{console.manufacturer} ({console.year})</p>
            </div>
          ))}
        </div>

        {/* Lista de Jogos do Console Selecionado */}
        {selectedConsole && (
          <div>
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
              Jogos de {selectedConsole.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game) => (
                <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <img src={game.coverUrl} alt={game.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-1">{game.title}</h4>
                    <p className="text-sm text-gray-400 mb-2">{game.developer} ({game.year})</p>
                    <p className="text-xs text-gray-500 mb-3">{game.genre} • {game.players} jogadores</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">
                      Jogar Agora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}