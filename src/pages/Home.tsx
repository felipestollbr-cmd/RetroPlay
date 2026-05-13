import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();
  return (
    <div>
      <h1>Bem-vindo ao RetroPlay, {user?.email}!</h1>
      <button onClick={signOut}>Sair</button>
    </div>
  );
}