import { useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

export const AuthPage: FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Handle automatic redirection when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, determining destination...');
      if (user.onboarding_completed) {
        console.log('Onboarding completed, navigating to /welcome');
        navigate('/welcome', { replace: true });
      } else {
        console.log('Onboarding pending, navigating to /profile');
        navigate('/profile', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSuccess = async (credential: string) => {
    console.log('Google Sign-In Success! Credential received.');
    try {
      await login(credential);
      // Redirection is handled by the useEffect above
      console.log('Login backend exchange successful');
    } catch (error) {
      console.error('Login failed during backend exchange:', error);
      if (typeof error === 'object' && error !== null) {
        console.error('Detailed Error:', JSON.stringify(error, null, 2));
        // @ts-expect-error - Error type is unknown but likely contains message
        if (error.message) console.error('Error Message:', error.message);
        // @ts-expect-error - Error type is unknown buf likely contains status
        if (error.status) console.error('Error Status:', error.status);
      }
    }
  };

  const handleError = () => {
    console.error('Google Sign-In Error');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-primary relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)] animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent-violet opacity-20 blur-[100px] rounded-full animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent-cyan opacity-20 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="card glass z-10 w-full max-w-sm mx-4 text-center p-6 backdrop-blur-md border border-white/5">
        <div className="mb-6 relative">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent-gradient flex items-center justify-center shadow-glow">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">
            Auto<span className="gradient-text">Solve</span>
          </h1>
          <p className="text-text-secondary text-sm">
            Tu asistente de formularios ya está instalado.
            <br />
            <span className="text-[10px] opacity-80 uppercase tracking-widest font-black">Solo falta un paso.</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <GoogleSignInButton onSuccess={handleSuccess} onError={handleError} />
          </div>

          <p className="text-xs text-text-muted mt-8">
            Al continuar, aceptas nuestros{' '}
            <a href="#" className="hover:text-accent-cyan transition-colors">Términos de Servicio</a>
            {' '}y{' '}
            <a href="#" className="hover:text-accent-cyan transition-colors">Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
};
