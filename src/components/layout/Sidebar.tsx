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
import { Button } from '../ui/button';

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const SidebarContent: FC = () => {
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
    <>
      {/* Brand Logo */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-linear-to-br from-accent-violet to-accent-cyan flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent tracking-tight">
            AutoSolve
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-accent-violet/10 text-accent-violet shadow-lg shadow-accent-violet/5' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="font-semibold text-xs">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section: Profile, Plan & Status */}
      <div className="p-3 mt-auto border-t border-white/5 space-y-3">
        
        {/* Profile Card */}
        <div className="bg-bg-primary border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          {/* User Header */}
          <div 
            onClick={() => navigate('/profile')}
            className="p-2.5 flex items-center gap-2.5 hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="relative">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.nombre || 'Usuario'} 
                  className="w-8 h-8 rounded-lg border-2 border-accent-violet/20 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-accent-violet/10 flex items-center justify-center border-2 border-accent-violet/20 shadow-glow text-accent-violet font-semibold text-base">
                  {user?.nombre?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {user?.nombre || 'Usuario'}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-white transition-colors" />
          </div>

          {/* Plan Section */}
          <div className="px-2.5 pb-3 bg-linear-to-b from-transparent to-white/2">
            <div className="flex items-center justify-between mb-2 mt-1">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider opacity-60">Hobby Plan</span>
              <span className="text-[9px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Free</span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-3">
              Get the full experience. Upgrade to access all features.
            </p>

            <Button 
              className="w-full bg-text-primary text-bg-primary font-bold hover:bg-white text-xs"
              size="sm"
            >
              Upgrade
            </Button>
          </div>
        </div>

        {/* Action Links */}
        <div className="space-y-1.5">
          <Button
            variant="ghost"
            className="w-full justify-between px-2.5 h-8 text-text-secondary border border-white/5 hover:bg-white/5 hover:text-white group text-[11px] font-semibold"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Documentación</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-white" />
          </Button>

          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-between px-2.5 h-8 text-text-secondary border border-white/5 hover:bg-red-500/5 hover:text-red-400 group text-[11px] font-semibold"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 text-text-muted group-hover:text-red-400" />
              <span>Cerrar Sesión</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-red-400" />
          </Button>
        </div>
      </div>
    </>
  );
};

export const Sidebar: FC = () => {
  return (
    <aside className="hidden lg:flex flex-col w-56 h-screen fixed left-0 top-0 bg-bg-secondary border-r border-white/5 shadow-xl z-50">
      <SidebarContent />
    </aside>
  );
};

export const MobileSidebar: FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 -ml-2">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-bg-secondary border-r border-white/10 text-white" showCloseButton={false}>
         <SheetTitle className="sr-only">Menu de Navegación</SheetTitle>
         <SheetDescription className="sr-only">Barra lateral de navegación principal</SheetDescription>
         <div className="flex flex-col h-full bg-bg-secondary">
            <SidebarContent />
         </div>
      </SheetContent>
    </Sheet>
  );
};
