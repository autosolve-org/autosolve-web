import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  profileSections, 
  calculateOverallCompletion, 
  areRequiredFieldsComplete,
  type ProfileField
} from '../utils/profileFields';
import { api } from '../services/api';

// Components
import { CVUploader } from '../components/CVUploader';
import { Sparkles, Save, CheckCircle2, ChevronDown, ChevronUp, User, Briefcase, GraduationCap } from 'lucide-react';

export const ProfileWizardPage: FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(profileSections[0].id);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Datos Identitarios': true,
    'Contacto y Redes': false
  });

  // Load initial data
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const initialData = { ...user };
        setFormData(initialData);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    loadProfile();
  }, [user]);

  // Update completion percentage
  useEffect(() => {
    setCompletion(calculateOverallCompletion(formData));
  }, [formData]);

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-save logic (debounced)
      const win = window as unknown as { saveTimeout: number | undefined };
      if (win.saveTimeout) clearTimeout(win.saveTimeout);
      win.saveTimeout = window.setTimeout(() => {
        saveProfile(newData, true);
      }, 2000);
      
      return newData;
    });
  };

  const saveProfile = async (data: Record<string, unknown>, silent = false) => {
    if (!user?.id) return;
    if (!silent) setIsSaving(true);
    
    try {
      await api.put(`/users/profiles/${user.id}`, data);
      updateUser(data);
      if (!silent) {
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      if (!silent) setIsSaving(false);
    }
  };

  const handleCVUpload = (parsedData: Record<string, unknown>) => {
    const newData = { ...formData, ...parsedData };
    setFormData(newData);
    saveProfile(newData);
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    
    try {
      await api.patch('/users/me', { onboarding_completed: true });
      await saveProfile(formData, true);
      updateUser({ onboarding_completed: true });
      navigate('/welcome');
    } catch (error) {
      console.error('Error completing profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const activeSection = profileSections.find(s => s.id === activeSectionId) || profileSections[0];

  // Group fields if section has groups
  const groupedFields: Record<string, ProfileField[]> = {};
  activeSection.fields.forEach(field => {
    const groupName = field.group || 'General';
    if (!groupedFields[groupName]) groupedFields[groupName] = [];
    groupedFields[groupName].push(field);
  });

  // Map icon strings to components for the sidebar navigation
  const getSidebarIcon = (id: string, isActive: boolean) => {
    const props = { className: `w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted transition-colors'}` };
    switch (id) {
      case 'personal_info': return <User {...props} />;
      case 'experience': return <Briefcase {...props} />;
      case 'education': return <GraduationCap {...props} />;
      default: return <User {...props} />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="flex justify-end mb-4">
        {showSaveSuccess && (
          <span className="text-green-400 text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> Guardado
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Content */}
        <div className="lg:col-span-2 space-y-6">
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
              {Object.entries(groupedFields).map(([groupName, fields], idx, arr) => {
                const isExpanded = expandedGroups[groupName] ?? true;
                const hasGroups = Object.keys(groupedFields).length > 1;
                const isLast = idx === arr.length - 1;

                return (
                  <div key={groupName} className={`${hasGroups ? `${!isLast ? 'border-b' : ''} border-white/5 bg-transparent` : ''}`}>
                    {hasGroups && (idx === 0 || expandedGroups[groupName] !== undefined) && (
                      <button 
                        onClick={() => toggleGroup(groupName)}
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
                    
                    {(isExpanded || !hasGroups) && (
                      <div className={`p-6 animate-fade-in ${(idx > 0 && isExpanded && hasGroups) ? 'border-t border-white/5' : ''} grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5`}>
                        {fields.map((field) => (
                          <div key={field.name} className={`${field.type === 'textarea' ? 'md:col-span-2' : ''} group/field`}>
                            <label className="block mb-1.5 text-[10px] font-bold tracking-wider text-text-muted group-focus-within/field:text-accent-violet transition-colors">
                              {field.label} {field.required && <span className="text-accent-cyan">*</span>}
                            </label>
                            {field.type === 'textarea' ? (
                              <textarea
                                className="w-full bg-bg-tertiary/50 border border-white/5 rounded-lg p-3 text-white placeholder-text-muted focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/20 outline-none transition-all min-h-[120px] resize-y shadow-inner text-sm leading-relaxed"
                                placeholder={field.placeholder}
                                value={(formData[field.name] as string) || ''}
                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              />
                            ) : (
                              <input
                                type={field.type}
                                className="w-full bg-bg-tertiary/50 border border-white/5 rounded-lg p-3 text-white placeholder-text-muted focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/20 outline-none transition-all shadow-inner text-sm"
                                placeholder={field.placeholder}
                                value={(formData[field.name] as string) || ''}
                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Only Navigation Mode */}
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
                    <div key={section.id} className="flex gap-4 relative group/step">
                        <div className="flex flex-col items-center">
                            <button 
                              onClick={() => setActiveSectionId(section.id)}
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
                        <div className="flex-1 pb-3 border-b border-white/5">
                            <div className="flex justify-between items-start mt-1">
                                <button
                                  onClick={() => setActiveSectionId(section.id)}
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
                <div className="relative z-10">
                     <button
                      onClick={handleSubmit}
                      disabled={isSaving || !areRequiredFieldsComplete(formData)}
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
      </div>
    </div>
  );
};
