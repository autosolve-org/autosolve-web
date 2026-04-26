import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, MapPin, FileText, Brain, CheckCircle2, Circle, X } from 'lucide-react';
import { profileService } from '../services/profile.service';
import { profileSections } from '../utils/profileFields';
import { ProgressBar } from './ProgressBar';

export const OnboardingGuide: FC = () => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(
    localStorage.getItem('cognilot_hide_onboarding') === 'true'
  );
  const [profileData, setProfileData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fullProfile = await profileService.getActiveProfile();
        // Flatten learned data for easy checking
        const flatLearned: Record<string, unknown> = {};
        if (fullProfile.data_learned) {
          Object.entries(fullProfile.data_learned).forEach(([k, v]) => {
            flatLearned[k] = v?.[0] || '';
          });
        }
        setProfileData({ ...fullProfile, ...flatLearned });
      } catch (error) {
        console.error('Error loading profile for onboarding guide:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!isDismissed) {
      loadData();
    }
  }, [isDismissed]);

  if (isDismissed || isLoading) return null;

  // Calculate standard fields list
  const standardFields = new Set<string>();
  profileSections.forEach(section => {
    section.fields.forEach(f => standardFields.add(f.name));
  });

  // Calculate steps completion
  const isLocationDone = !!profileData.country || !!profileData.city;
  const isExperienceDone = !!profileData.current_company || !!profileData.current_role || !!profileData.degree || !!profileData.university;
  
  // Check for manual memory (any learned key not in standard fields)
  const isManualMemoryDone = Object.keys(profileData).some(key => {
    const configKeys = ['preferences', 'data_learned', 'id', 'user_id', 'created_at', 'updated_at', 'onboarding_completed', 'avatar_url', 'display_name', 'google_id', 'is_active', 'last_login', 'plan', 'provider', 'cv_url', 'email', 'given_name', 'family_name'];
    
    if (standardFields.has(key) || configKeys.includes(key)) return false;
    
    const value = profileData[key];
    return value !== undefined && value !== null && value !== '';
  });

  const steps = [
    {
      id: 'location',
      title: 'Configurar Localización',
      description: 'Activa tu ubicación para autocompletar formularios.',
      icon: <MapPin className="w-4 h-4" />,
      completed: isLocationDone,
      focus: 'location'
    },
    {
      id: 'experience',
      title: 'Cargar Experiencia (CV)',
      description: 'Sube tu currículum para que la IA extraiga el historial.',
      icon: <FileText className="w-4 h-4" />,
      completed: isExperienceDone,
      focus: 'experience'
    },
    {
      id: 'manual',
      title: 'Entrenar Memoria Manual',
      description: 'Añade datos personalizados (ej. "Disponibilidad").',
      icon: <Brain className="w-4 h-4" />,
      completed: isManualMemoryDone,
      focus: 'custom'
    }
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  // Calculate a fake "AI Capacity" percentage that looks cool
  const baseCapacity = 20; // Starts at 20% just by logging in
  const aiCapacity = Math.min(100, Math.round(baseCapacity + (completedSteps / totalSteps) * (100 - baseCapacity)));

  if (completedSteps === totalSteps) {
    return null; // All done!
  }

  const handleDismiss = () => {
    localStorage.setItem('cognilot_hide_onboarding', 'true');
    setIsDismissed(true);
  };

  const handleStepClick = (focus: string) => {
    if (focus === 'custom') {
      navigate('/profile?focus=custom');
    } else {
      navigate(`/profile?focus=${focus}`);
    }
  };

  return (
    <div className="bg-surface/90 backdrop-blur-2xl border border-brand-secondary/30 rounded-xl shadow-2xl shadow-brand-secondary/5 overflow-hidden relative mb-8 animate-scale-in">
      <button 
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
        aria-label="Cerrar guía"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="flex-1">
             <div className="text-brand-secondary mb-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[11px]">
               <Terminal className="w-4 h-4" /> AI_CAPACITY_METER
             </div>
             <h2 className="text-xl font-bold text-white mb-2">Desbloquea el 100% de tu Asistente</h2>
             <p className="text-ghost text-sm leading-relaxed max-w-xl">
               Completa estos pasos para que Cognilot pueda autocompletar cualquier formulario con precisión milimétrica.
             </p>
          </div>
          
          <div className="w-full md:w-64 bg-black/40 p-4 rounded-lg border border-white/5">
             <ProgressBar progress={aiCapacity} />
             <div className="text-right mt-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
               {completedSteps} / {totalSteps} módulos cargados
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.focus)}
              className={`text-left p-4 rounded-lg border transition-all group relative overflow-hidden ${
                step.completed 
                  ? 'bg-success/5 border-success/20 hover:border-success/40' 
                  : 'bg-white/5 border-white/10 hover:border-brand-secondary/40 hover:bg-white/10'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/0 to-brand-secondary/0 group-hover:to-brand-secondary/5 transition-all" />
              
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className={`p-2 rounded-lg ${step.completed ? 'bg-success/20 text-success' : 'bg-white/10 text-white/60 group-hover:text-brand-secondary transition-colors'}`}>
                  {step.icon}
                </div>
                <div>
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/20 group-hover:text-brand-secondary/50 transition-colors" />
                  )}
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className={`font-bold mb-1 ${step.completed ? 'text-success' : 'text-white'}`}>
                  {step.title}
                </h3>
                <p className="text-[11px] text-ghost leading-relaxed">
                  {step.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
