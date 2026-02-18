import { type FC } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MapPin 
} from 'lucide-react';
import { ProfileField } from './ProfileField';
import { 
  type ProfileSection, 
  type ProfileField as ProfileFieldType 
} from '../../utils/profileFields';

interface ProfileFormProps {
  activeSection: ProfileSection;
  formData: Record<string, unknown>;
  onFieldChange: (name: string, value: unknown) => void;
  expandedGroups: Record<string, boolean>;
  onToggleGroup: (group: string) => void;
  isLocating: boolean;
  onDetectLocation: () => Promise<void>;
}

export const ProfileForm: FC<ProfileFormProps> = ({
  activeSection,
  formData,
  onFieldChange,
  expandedGroups,
  onToggleGroup,
  isLocating,
  onDetectLocation,
}) => {
  // Group fields if section has groups
  const groupedFields: Record<string, ProfileFieldType[]> = {};
  activeSection.fields.forEach(field => {
    const groupName = field.group || 'General';
    if (!groupedFields[groupName]) groupedFields[groupName] = [];
    groupedFields[groupName].push(field);
  });

  const groupKeys = Object.keys(groupedFields);
  const hasMultipleGroups = groupKeys.length > 1;

  return (
    <section className="card bg-bg-primary p-0 rounded-xl border border-white/10 animate-scale-in overflow-hidden shadow-2xl shadow-black/20">
      {/* Form Header with background */}
      <div className="p-6 border-b border-white/5 bg-white/5">
        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 select-none mb-4">
          Datos del Usuario
        </h1>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-violet/10 flex items-center justify-center border border-accent-violet/20 text-2xl shadow-inner shadow-accent-violet/5">
            {activeSection.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{activeSection.title}</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {activeSection.required ? 'Información necesaria para tu perfil profesional.' : 'Completa estos campos para mejorar tu perfil.'}
            </p>
          </div>
          {activeSection.required && (
            <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20 font-black ml-auto tracking-widest">
              Requerido
            </span>
          )}
        </div>
      </div>

      {/* Form Body: Transparent & Seamless Groups */}
      <div className="space-y-0">
        {groupKeys.map((groupName, idx) => {
          const fields = groupedFields[groupName];
          const isExpanded = expandedGroups[groupName] ?? true;
          const isLast = idx === groupKeys.length - 1;

          return (
            <div key={groupName} className={`${hasMultipleGroups ? `${!isLast ? 'border-b' : ''} border-white/5 bg-transparent` : ''}`}>
              {hasMultipleGroups && (
                <button 
                  onClick={() => onToggleGroup(groupName)}
                  className={`w-full px-6 py-4 flex items-center justify-between transition-all group/btn ${isExpanded ? 'bg-white/5' : 'hover:bg-white/10'}`}
                >
                  <h3 className="text-xs font-bold text-white tracking-[0.2em] flex items-center gap-3">
                     <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isExpanded ? 'bg-accent-violet shadow-[0_0_8px_rgba(139,92,246,0.6)]' : 'bg-white/10'}`} />
                     {groupName}
                  </h3>
                  <div className={`p-1 rounded-md transition-colors ${isExpanded ? 'bg-accent-violet/10 text-accent-violet' : 'text-text-muted group-hover/btn:text-white'}`}>
                     {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
              )}
              {(isExpanded || !hasMultipleGroups) && (
                <div className={`p-6 animate-fade-in ${(idx > 0 && isExpanded && hasMultipleGroups) ? 'border-t border-white/5' : ''} grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 relative`}>
                  
                  {/* Auto-Location Button - Only show in relevant sections/groups */}
                  {(groupName === 'Ubicación' || activeSection.id === 'location') && (
                     <div className="md:col-span-2 flex justify-end mb-2">
                        <button 
                          type="button"
                          onClick={onDetectLocation}
                          disabled={isLocating}
                          className="text-[10px] flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/20 rounded-lg transition-all"
                        >
                          {isLocating ? (
                              <Sparkles className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                              <MapPin className="w-3.5 h-3.5" />
                          )}
                          {isLocating ? 'Detectando...' : 'Detectar Ubicación Actual'}
                        </button>
                     </div>
                  )}
                  
                  {fields.map((field) => (
                    <ProfileField 
                      key={field.name}
                      field={field}
                      value={formData[field.name]}
                      onChange={onFieldChange}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
