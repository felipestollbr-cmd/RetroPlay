import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Confirmando seu e-mail...');

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (token_hash && type === 'signup') {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'signup',
        });
        if (error) {
          setMessage('Erro ao confirmar e-mail. Tente novamente.');
          console.error(error);
        } else {
          setMessage('E-mail confirmado! Redirecionando para o login...');
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        setMessage('Link inválido.');
      }
    };
    confirmEmail();
  }, [searchParams, navigate]);

  return <div>{message}</div>;
}