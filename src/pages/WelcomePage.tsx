import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const WelcomePage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-2xl animate-slide-up">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ¡Bienvenido, <span className="gradient-text">{user?.nombre || 'Usuario'}</span>! 🎉
          </h1>
          <p className="text-xl text-text-secondary">
            Tu cuenta ha sido creada exitosamente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Active Plan Card */}
          <div className="card glass relative overflow-hidden border-accent-violet/30 shadow-glow">
            <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-green-500/20">
              ACTIVO ✅
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">⚡ Plan Free</h3>
              <div className="text-3xl font-bold mb-1">$0 <span className="text-sm text-text-muted font-normal">/mes</span></div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-400">✓</span> 20 resoluciones/día
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-400">✓</span> Sugerencias Copilot
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-400">✓</span> 1 Perfil básico
              </li>
            </ul>

            <a href="#" className="text-sm text-accent-cyan hover:text-accent-violet block text-center border-t border-white/5 pt-4">
              ¿Necesitas más? Ver planes Pro →
            </a>
          </div>

          {/* Next Steps */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <p className="text-lg">
                Para que AutoSolve pueda completar formularios por ti, necesitamos conocer un poco sobre tu experiencia.
              </p>
              <p className="text-text-secondary text-sm">
                Solo te tomará 2 minutos y podrás usar IA para completarlo automáticamente subiendo tu CV.
              </p>
            </div>

            <button 
              onClick={() => navigate('/profile')}
              className="btn btn-primary w-full text-lg group"
            >
              Completar mi perfil
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
