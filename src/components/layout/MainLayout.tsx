import { type FC, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Sidebar - Hidden on mobile, fixed on desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col min-w-0 bg-bg-primary relative overflow-y-auto overflow-x-hidden">
        
        {/* Mobile Header Placeholder (if needed in future) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-bg-secondary sticky top-0 z-30">
          <span className="font-bold text-lg text-white">AutoSolve</span>
          {/* Add Mobile Menu Toggle Here */}
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <div className="animate-fade-in space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
