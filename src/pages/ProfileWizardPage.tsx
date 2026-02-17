import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  profileSections, 
  calculateOverallCompletion, 
  calculateSectionCompletion, 
  areRequiredFieldsComplete 
} from '../utils/profileFields';
import { api } from '../services/api';

// Components
import { ProgressBar } from '../components/ProgressBar';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { CVUploader } from '../components/CVUploader';
import { MotivationalMessage } from '../components/MotivationalMessage';

export const ProfileWizardPage: FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [openSectionId, setOpenSectionId] = useState<string>(profileSections[0].id);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [completion, setCompletion] = useState(0);

  // Load initial data
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        // In a real app we would fetch the full profile here
        // For now we'll just use user data if available
        const initialData = { ...user };
        setFormData(initialData);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    loadProfile();
  }, [user]);

  // Update completion percentage whenever form data changes
  useEffect(() => {
    setCompletion(calculateOverallCompletion(formData));
  }, [formData]);

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Debounce save (simplified for this implementation)
      // in production use lodash.debounce or similar
      const win = window as unknown as { saveTimeout: number | undefined };
      if (win.saveTimeout) clearTimeout(win.saveTimeout);
      win.saveTimeout = window.setTimeout(() => {
        saveProfile(newData);
      }, 1000);
      
      return newData;
    });
  };

  const saveProfile = async (data: Record<string, unknown>) => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await api.put(`/users/profiles/${user.id}`, data);
      updateUser(data);
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCVUpload = (parsedData: Record<string, unknown>) => {
    // Merge parsed data with existing form data
    const newData = { ...formData, ...parsedData };
    setFormData(newData);
    saveProfile(newData);
    
    // Show success feedback logic could go here
    setOpenSectionId('personal'); // Reset to first section to review
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    
    try {
      // Mark onboarding as completed
      await api.patch('/users/me', { onboarding_completed: true });
      updateUser({ onboarding_completed: true });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Hubo un error al finalizar. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <div className="container max-w-3xl pt-8">
        
        {/* Header */}
        <div className="mb-8 sticky top-0 bg-bg-primary/95 backdrop-blur z-20 py-4 border-b border-white/5">
          <div className="flex justify-between items-end mb-4">
            <h1 className="text-2xl font-bold m-0">
              Completa tu perfil
            </h1>
            <div className="text-xs text-text-muted">
              {isSaving ? 'Guardando...' : 'Guardado automático'}
            </div>
          </div>
          <ProgressBar progress={completion} />
        </div>

        {/* CV Uploader Banner */}
        <div className="mb-8">
          <CVUploader onUploadSuccess={handleCVUpload} />
          <MotivationalMessage />
        </div>

        {/* Wizard Sections */}
        <div className="space-y-4">
          {profileSections.map((section) => (
            <CollapsibleSection
              key={section.id}
              section={section}
              isOpen={openSectionId === section.id}
              onToggle={() => setOpenSectionId(openSectionId === section.id ? '' : section.id)}
              completion={calculateSectionCompletion(section, formData)}
            >
              <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="label">
                      {field.label} {field.required && <span className="text-accent-cyan">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="input min-h-[100px] resize-y"
                        placeholder={field.placeholder}
                        value={(formData[field.name] as string) || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className="input"
                        placeholder={field.placeholder}
                        value={(formData[field.name] as string) || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-bg-secondary border-t border-white/10 z-30">
          <div className="container max-w-3xl flex justify-between items-center">
            <span className="text-sm text-text-muted hidden md:inline">
              Podrás editar esto más tarde
            </span>
            <button
              onClick={handleSubmit}
              disabled={!areRequiredFieldsComplete(formData)}
              className="btn btn-primary w-full md:w-auto"
            >
              ¡Listo, vámonos! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
