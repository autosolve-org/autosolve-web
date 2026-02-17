import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const DashboardPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold">AutoSolve</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {user?.email}
            </span>
            <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center font-bold">
              {user?.nombre?.[0] || 'U'}
            </div>
          </div>
        </header>

        <main className="animate-slide-up">
          <div className="card glass text-center py-16 mb-8 border-accent-violet/20 shadow-glow">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-4">
              ¡Todo listo! AutoSolve está configurado
            </h1>
            <p className="text-xl text-text-secondary max-w-xl mx-auto mb-8">
              Ya puedes ir a cualquier formulario de postulación y verás la magia en acción.
              La extensión detectará los campos y te sugerirá las mejores respuestas.
            </p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate('/profile')}
                className="btn btn-secondary"
              >
                Editar mi perfil
              </button>
              <a 
                href="#" 
                className="btn btn-primary"
                onClick={(e) => e.preventDefault()}
              >
                Probar en un formulario
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card border-transparent hover:border-white/10">
              <h3 className="text-lg font-bold mb-2">📊 Estadísticas (Pronto)</h3>
              <p className="text-text-muted text-sm">
                Pronto podrás ver cuántos formularios has completado y cuánto tiempo has ahorrado.
              </p>
            </div>
            <div className="card border-transparent hover:border-white/10">
              <h3 className="text-lg font-bold mb-2">⭐ Actualizar a Pro (Pronto)</h3>
              <p className="text-text-muted text-sm">
                Funciones avanzadas como múltiples perfiles y cartas de presentación personalizadas.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
