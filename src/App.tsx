import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Discovery from './pages/Discovery';
import GameDetail from './pages/GameDetail';
import SearchPage from './pages/Search';
import AISearchPage from './pages/AISearchPage';
import UploadRom from './pages/UploadRom';
import Plans from './pages/Plans';
import ConsoleGames from './pages/ConsoleGames';
import GamePlay from './pages/GamePlay';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Discovery />} />
          <Route path="/game/:gameId" element={<GameDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/ai-search" element={<AISearchPage />} />
          <Route path="/upload" element={<UploadRom />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/console/:consoleId" element={<ConsoleGames />} />
          <Route path="/play/:consoleId/:gameSlug" element={<GamePlay />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
