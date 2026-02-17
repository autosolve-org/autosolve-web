import { type FC, type ReactNode } from 'react';
import type { ProfileSection } from '../utils/profileFields';

interface CollapsibleSectionProps {
  section: ProfileSection;
  isOpen: boolean;
  onToggle: () => void;
  completion: { completed: number; total: number };
  children: ReactNode;
}

export const CollapsibleSection: FC<CollapsibleSectionProps> = ({
  section,
  isOpen,
  onToggle,
  completion,
  children
}) => {
  return (
    <div className={`card mb-4 transition-all duration-300 ${isOpen ? 'border-l-4 border-accent-violet' : 'border-l-4 border-transparent'}`}>
      <div 
        className="flex items-center justify-between cursor-pointer py-2"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <div>
            <h3 className="text-lg font-semibold m-0">{section.title}</h3>
            {!isOpen && (
              <p className="text-xs text-text-secondary m-0">
                Click para editar
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            completion.completed === completion.total 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-bg-tertiary text-text-secondary'
          }`}>
            {completion.completed}/{completion.total}
          </div>
          <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-2 pb-1 border-t border-bg-tertiary">
          {children}
        </div>
      </div>
    </div>
  );
};
