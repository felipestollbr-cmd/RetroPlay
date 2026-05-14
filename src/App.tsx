import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AuthConfirm from './pages/AuthConfirm';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas (apenas para não autenticados) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          {/* Rota de confirmação de e-mail (pública, sem redirecionamento) */}
          <Route path="/auth/confirm" element={<AuthConfirm />} />

          {/* Rotas protegidas (exigem login) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* Adicione outras rotas protegidas aqui, ex: /multiplayer/:gameId */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;