
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthSession } from '@supabase/supabase-js';

interface AuthCallbackProps {
  onSuccess?: (session: AuthSession) => void;
  onError?: (error: Error) => void;
}

export const AuthCallback = ({ onSuccess, onError }: AuthCallbackProps): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          const session = { access_token: accessToken } as AuthSession;
          onSuccess?.(session);
          navigate('/');
        }
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error('Authentication failed'));
      }
    };

    handleCallback();
  }, [navigate, onSuccess, onError]);

  return <div>Processing authentication...</div>;
};
