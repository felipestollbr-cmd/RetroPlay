import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Enquanto carrega a sessão, mostra um indicador (evita piscar a tela)
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    // Redireciona para o login, guardando a página que o usuário tentou acessar
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}