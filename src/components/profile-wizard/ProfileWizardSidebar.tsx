import { type FC, type ReactNode } from 'react';
import { Save, Sparkles } from 'lucide-react';
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
  getSidebarIcon,
}) => {
  return (
    <div className="space-y-6 lg:sticky lg:top-8 h-fit">
      <div className="card bg-bg-primary p-0 rounded-xl border border-white/5 overflow-hidden shadow-2xl shadow-black/40">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
           <h3 className="font-semibold text-white text-[10px] tracking-[0.2em] opacity-70">Progreso de Formularios</h3>
           <div className="flex items-center gap-2 bg-bg-elevated/50 px-2 py-1 rounded-full border border-white/5">
              <span className={`text-[10px] font-mono font-bold ${completion === 100 ? 'text-green-400' : 'text-accent-cyan'}`}>
                {completion}%
              </span>
           </div>
        </div>
        <div className="p-4 space-y-0 relative">
            {profileSections.map((section, idx) => {
              const isLast = idx === profileSections.length - 1;
              const isActive = section.id === activeSectionId;
              return (
                <div key={section.id} className="flex gap-4 relative group/step" onClick={() => setActiveSectionId(section.id)}>
                    <div className="flex flex-col items-center">
                        <button 
                          className={`w-9 h-9 rounded-xl border transition-all z-10 cursor-pointer flex items-center justify-center
                            ${isActive 
                              ? 'bg-accent-violet border-accent-violet text-white shadow-glow scale-105' 
                              : 'bg-bg-elevated border-white/10 text-text-muted hover:border-accent-violet/40 hover:bg-accent-violet/5'
                            }
                          `}
                        >
                            {getSidebarIcon(section.id, isActive)}
                        </button>
                        {!isLast && <div className={`w-0.5 h-full -my-1 transition-colors duration-500 ${isActive ? 'bg-accent-violet/40' : 'bg-white/5'}`} />}
                    </div>
                    <div className="flex-1 pb-3 border-b border-white/5 cursor-pointer">
                        <div className="flex justify-between items-start mt-1">
                            <button
                              className={`text-sm font-bold transition-all text-left tracking-tight
                                ${isActive ? 'text-white translate-x-1' : 'text-text-secondary group-hover/step:text-white'}
                              `}
                            >
                              {section.title}
                            </button>
                        </div>
                        <p className={`text-[10px] mt-1 leading-relaxed transition-opacity duration-300 ${isActive ? 'opacity-100 text-accent-violet font-medium' : 'opacity-60 text-text-muted'}`}>
                          {section.required ? 'Campos Requeridos' : 'Información Opcional'}
                        </p>
                    </div>
                </div>
              );
            })}

            {/* Finalize Button Area */}
            <div className="relative z-10 pt-2">
                 <button
                  onClick={handleSubmit}
                  disabled={isSaving || !hasChanges || !areRequiredFieldsComplete(formData)}
                  className="w-full py-3 px-4 bg-accent-violet hover:bg-accent-violet/90 text-white text-xs font-black rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed tracking-widest group/save active:scale-95 shadow-lg shadow-accent-violet/20"
                >
                  <Save className="w-5 h-5 group-hover/save:scale-110 transition-transform" />
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
      </div>

      {/* CV Import Card */}
      <div className="card bg-bg-secondary p-5 rounded-xl border border-white/10 border-dashed relative overflow-hidden group hover:border-accent-cyan/40 transition-all duration-500 shadow-lg">
        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sparkles className="w-24 h-24 text-accent-cyan transform rotate-12" />
        </div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20">
                   <Sparkles className="w-4 h-4 text-accent-cyan" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">IA Autocomplete</h3>
                <p className="text-[10px] text-accent-cyan font-medium tracking-tighter">Magic Feature</p>
              </div>
            </div>
            <p className="text-xs text-text-secondary mb-5 leading-relaxed">
              ¿Tienes prisa? Sube tu CV y nuestra IA lo completará por ti en segundos.
            </p>
            <CVUploader onUploadSuccess={handleCVUpload} />
        </div>
      </div>
    </div>
  );
};
