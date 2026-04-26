import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Terminal } from 'lucide-react';

export const WelcomePage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="font-mono text-[13px] animate-fade-in space-y-6">
      <header className="flex justify-between items-center bg-surface/90 p-4 border border-white/10 rounded-xl">
         <div className="flex items-center gap-3 text-dim font-bold uppercase tracking-[0.2em] text-[11px]">
            <Terminal className="w-4 h-4 text-brand-secondary" /> 
            Cognilot <span className="text-white/20">v1.0.0</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-black tracking-widest text-ghost hidden sm:inline">
              {user?.email}
            </span>
            <div className="w-7 h-7 rounded bg-brand-primary/20 flex items-center justify-center text-xs font-black text-brand-primary border border-brand-primary/30">
              {user?.display_name?.[0] || user?.given_name?.[0] || 'U'}
            </div>
         </div>
      </header>

      <div className="bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden relative">
        <div className="px-5 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2 select-none">
          <div className="flex gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          </div>
          <div className="text-white/30 text-[11px] uppercase tracking-[0.2em] font-sans font-bold">
             welcome.md
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
           <div>
              <div className="text-white/20 select-none mb-4 flex items-center gap-2">
                <span className="text-brand-primary">#</span> System_Status
              </div>
              <div className="text-green-400 font-bold flex items-center gap-2 mb-2">
                 [OK] Cognilot initialized successfully.
              </div>
              <p className="text-white/60 leading-relaxed max-w-2xl">
                 La extensión está activa y lista. Cuando visites cualquier formulario, detectará automáticamente los campos y te sugerirá las respuestas en base a tu perfil local configurado en la extensión, manteniendo completa privacidad y fricción casi nula.
              </p>
           </div>

           <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
              <button 
                onClick={() => navigate('/profile')}
                className="py-2.5 px-5 bg-white/5 hover:bg-white/10 text-white rounded transition-colors flex items-center gap-2 border border-white/10"
              >
                <span className="text-brand-primary font-bold">{'>'}</span> ./edit_profile.sh
              </button>
              <button 
                className="py-2.5 px-5 bg-brand-secondary/10 hover:bg-brand-secondary/20 text-brand-secondary rounded transition-colors flex items-center gap-2 border border-brand-secondary/20 font-bold"
                onClick={(e) => e.preventDefault()}
              >
                <span className="text-white/40">$</span> test_demo_form
              </button>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-surface/90 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
           <div className="text-white/20 select-none mb-3"><span className="text-brand-secondary">##</span> ANALYTICS</div>
           <p className="text-ghost text-[12px] leading-relaxed">
             Próximamente: Métricas sobre la cantidad de caracteres ahorrados y formularios completados.
           </p>
        </div>
        <div className="bg-surface/90 border border-white/10 rounded-xl p-6 hover:border-brand-primary/30 transition-colors group">
           <div className="text-white/20 select-none mb-3 group-hover:text-brand-primary transition-colors"><span className="text-brand-primary">##</span> UNLOCK_PRO</div>
           <p className="text-ghost text-[12px] leading-relaxed">
             Funciones avanzadas: múltiples alias comerciales y AI-Gen Cover Letters en un click.
           </p>
        </div>
      </div>
    </div>
  );
};

