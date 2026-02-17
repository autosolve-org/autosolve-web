import { type FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  LogOut,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Bienvenida', path: '/welcome' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-bg-secondary border-r border-white/5 shadow-xl z-50">
      {/* Brand Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent-violet to-accent-cyan flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
            AutoSolve
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-accent-violet/10 text-accent-violet shadow-lg shadow-accent-violet/5' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium text-sm">{item.label}</span>
            
            {/* Active Indicator */}
            <div className="absolute left-0 w-1 h-8 bg-accent-violet rounded-r-full opacity-0 transition-opacity duration-200" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section: Profile, Plan & Status */}
      <div className="p-4 mt-auto border-t border-white/5 space-y-4">
        
        {/* Profile Card */}
        <div className="bg-bg-primary border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          {/* User Header */}
          <div 
            onClick={() => navigate('/profile')}
            className="p-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="relative">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.nombre || 'Usuario'} 
                  className="w-10 h-10 rounded-lg border-2 border-accent-violet/20 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-accent-violet/10 flex items-center justify-center border-2 border-accent-violet/20 shadow-glow text-accent-violet font-semibold text-lg">
                  {user?.nombre?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {user?.nombre || 'Usuario'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
          </div>

          {/* Plan Section */}
          <div className="px-3 pb-4 pt-1 border-t border-white/5 bg-linear-to-b from-transparent to-white/2">
            <div className="flex items-center justify-between mb-3 mt-2">
              <span className="text-sm font-medium text-white">Hobby Plan</span>
              <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Free</span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-3">
              Get the full experience. Upgrade to access all features.
            </p>

            <button className="w-full py-2 bg-text-primary text-bg-primary text-xs font-bold rounded-lg hover:bg-white transition-all transform active:scale-95">
              Upgrade
            </button>
          </div>
        </div>

        {/* Action Links */}
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-text-secondary border border-white/5 hover:bg-white/5 hover:text-white transition-all group text-sm font-medium">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Docs and resources</span>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-white" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-text-secondary border border-white/5 hover:bg-red-500/5 hover:text-red-400 transition-all group text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-text-muted group-hover:text-red-400" />
              <span>Cerrar Sesión</span>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-red-400" />
          </button>
        </div>
      </div>
    </aside>
  );
};
