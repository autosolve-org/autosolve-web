import { type FC, type ReactNode } from 'react';
import { ChevronDown, Save, Sparkles } from 'lucide-react';
import { 
  profileSections, 
  areRequiredFieldsComplete 
} from '../../utils/profileFields';
import { CVUploader } from '../CVUploader';

interface ProfileWizardSidebarProps {
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  completion: number;
  isSaving: boolean;
  hasChanges: boolean;
  formData: Record<string, unknown>;
  handleCVUpload: (data: Record<string, unknown>) => void;
  handleSubmit: () => void;
  getSidebarIcon: (id: string, isActive: boolean) => ReactNode;
}

export const ProfileWizardSidebar: FC<ProfileWizardSidebarProps> = ({
  activeSectionId,
  setActiveSectionId,
  completion,
  isSaving,
  hasChanges,
  formData,
  handleCVUpload,
  handleSubmit,
}) => {
  return (
    <div className="space-y-6 lg:sticky lg:top-8 h-fit font-mono text-[13px] animate-fade-in">
      
      {/* Main Navigation Panel */}
      <div className="bg-bg-primary/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden relative">
        <div className="p-6 md:p-8">

           {/* Navigation Links */}
           <div className="mb-4">
              <div className="text-white/20 select-none mb-8 flex items-center justify-between">
                <div className="text-white/30 text-[11px] font-sans font-bold uppercase tracking-widest flex items-center gap-1 select-none">
                  <ChevronDown className="w-3.5 h-3.5" /> SECTIONS
                </div>
                <div className={`${completion === 100 ? 'text-green-400' : 'text-accent-cyan'} font-bold`}>
                  [{completion}%]
                </div>
              </div>
              <div className="space-y-1">
                {profileSections.map((section) => {
                   const isActive = section.id === activeSectionId;
                   return (
                     <button
                       key={section.id}
                       onClick={() => setActiveSectionId(section.id)}
                       className={`w-full text-left px-3 py-2.5 rounded flex items-center gap-3 transition-colors group
                         ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}
                       `}
                     >
                       <div className="flex-1 flex gap-2 items-center">
                          <span className={isActive ? 'text-white' : ''}>
                             <span className={isActive ? "text-accent-violet/50 mr-1" : "text-white/20 mr-1"}>#</span>
                             {section.id}
                          </span>
                       </div>
                       {section.required && (
                         <span className="text-[10px] opacity-30 text-red-400 pointer-events-none group-hover:opacity-60 transition-opacity">
                           *req
                         </span>
                       )}
                     </button>
                   );
                })}
              </div>
           </div>

           {/* Action Buttons */}
           <div className="pt-6 border-t border-white/5">
              <button
                onClick={handleSubmit}
                disabled={isSaving || !hasChanges || !areRequiredFieldsComplete(formData)}
                className="w-full py-3 px-4 bg-accent-violet/10 hover:bg-accent-violet/20 text-accent-violet text-xs font-sans font-bold uppercase tracking-widest rounded-lg border border-accent-violet/20 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group/save shadow-lg shadow-accent-violet/5"
              >
                <Save className="w-4 h-4 group-hover/save:scale-110 transition-transform" />
                {isSaving ? 'Guardando...' : './save_changes.sh'}
              </button>
              
              {!hasChanges && <div className="text-center mt-3 text-white/20 text-[10px] italic">No detected changes</div>}
           </div>
        </div>
      </div>

      {/* Magic Upload Terminal Block */}
      <div className="bg-bg-primary/90 backdrop-blur-2xl border border-dashed border-accent-cyan/20 rounded-xl p-6 relative group hover:border-accent-cyan/50 transition-colors">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Sparkles className="w-20 h-20 text-accent-cyan transform rotate-12" />
         </div>

         <div className="text-accent-cyan mb-2 flex items-center gap-2 font-bold">
            <span className="text-white/30">$</span> ./auto-fill-cv.sh
         </div>
         <p className="text-white/40 text-[11px] mb-6 leading-relaxed">
           ¿Tienes prisa? Sube tu CV y nuestra IA extraerá tus datos automáticamente en segundos.
         </p>

         <div className="grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100 relative z-10">
           <CVUploader onUploadSuccess={handleCVUpload} />
         </div>
      </div>

    </div>
  );
};
