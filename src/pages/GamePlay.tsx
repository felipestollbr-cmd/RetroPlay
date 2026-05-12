import { useParams } from 'react-router-dom';
import EmulatorPlayer from '../components/EmulatorPlayer';

export default function GamePlay() {
  const { consoleId, gameSlug } = useParams<{ consoleId: string; gameSlug: string }>();

  if (!consoleId || !gameSlug) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <p className="text-white/60">Jogo não encontrado</p>
      </div>
    );
  }

  const gameName = gameSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <EmulatorPlayer consoleId={consoleId} gameSlug={gameSlug} gameName={gameName} />
  );
}
