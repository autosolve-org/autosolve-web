import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const WelcomePage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="text-lg font-bold">AutoSolve</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-black tracking-widest text-text-muted">
              {user?.email}
            </span>
            <div className="w-7 h-7 rounded-lg bg-accent-gradient flex items-center justify-center text-xs font-black shadow-glow">
              {user?.nombre?.[0] || 'U'}
            </div>
          </div>
        </header>

        <main className="animate-slide-up">
          <div className="card glass text-center py-12 mb-6 border-accent-violet/20 shadow-glow">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold mb-2">
              ¡Todo listo! AutoSolve está configurado
            </h1>
            <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
              Ya puedes ir a cualquier formulario de postulación y verás la magia en acción.
              La extensión detectará los campos y te sugerirá las mejores respuestas.
            </p>
            
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => navigate('/profile')}
                className="btn btn-secondary px-4"
              >
                Editar mi perfil
              </button>
              <a 
                href="#" 
                className="btn btn-primary px-4"
                onClick={(e) => e.preventDefault()}
              >
                Probar en un formulario
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card border-transparent hover:border-white/10 p-5">
              <h3 className="text-sm font-bold mb-1 opacity-80 uppercase tracking-wider">📊 Estadísticas</h3>
              <p className="text-text-muted text-[11px] leading-relaxed">
                Pronto podrás ver cuántos formularios has completado y cuánto tiempo has ahorrado.
              </p>
            </div>
            <div className="card border-transparent hover:border-white/10 p-5">
              <h3 className="text-sm font-bold mb-1 opacity-80 uppercase tracking-wider">⭐ Actualizar a Pro</h3>
              <p className="text-text-muted text-[11px] leading-relaxed">
                Funciones avanzadas como múltiples perfiles y cartas de presentación personalizadas.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
