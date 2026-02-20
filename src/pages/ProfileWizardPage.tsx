import { useState, useEffect, type FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  profileSections,
  calculateOverallCompletion
} from '../utils/profileFields';
import { api } from '../services/api';
import { profileService } from '../services/profile.service';

// Components
import {
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  MapPin
} from 'lucide-react';

// New Components
import { ProfileForm } from '../components/profile-wizard/ProfileForm';
import { ProfileWizardSidebar } from '../components/profile-wizard/ProfileWizardSidebar';
import { KnowledgeManager, type KnowledgePattern } from '../components/KnowledgeManager';
import { Sparkles } from 'lucide-react';

export const ProfileWizardPage: FC = () => {
  const { user, updateUser } = useAuth();

  // State
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [originalData, setOriginalData] = useState<Record<string, unknown>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(profileSections[0].id);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Identidad': true,
    'Ubicación': true
  });
  const [isLocating, setIsLocating] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        let initialData = { ...user };
        const profile = await profileService.getActiveProfile();
        if (profile) {
            initialData = { ...initialData, ...profile };
        }
        setFormData(initialData);
        setOriginalData(initialData);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    loadProfile();
  }, [user]);

  // Update completion percentage
  useEffect(() => {
    setCompletion(calculateOverallCompletion(formData));

    const hasChanged = () => {
        const allKeys = new Set([...Object.keys(formData), ...Object.keys(originalData)]);
        for (const key of allKeys) {
            const val1 = formData[key];
            const val2 = originalData[key];
            if (val1 === val2) continue;
            const v1 = (val1 === null || val1 === undefined) ? '' : val1;
            const v2 = (val2 === null || val2 === undefined) ? '' : val2;
            if (v1 === v2) continue;
            if (typeof v1 === 'object' && typeof v2 === 'object') {
                if (JSON.stringify(v1) !== JSON.stringify(v2)) return true;
                continue;
            }
            return true;
        }
        return false;
    };

    setHasChanges(hasChanged());
  }, [formData, originalData]);

  const handleFieldChange = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async (data: Record<string, unknown>, silent = false) => {
    if (!user?.id) return;
    if (!silent) setIsSaving(true);
    try {
      const profileId = (data.id as string) || user.id;
      await api.put(`/users/profiles/${profileId}`, data);
      updateUser(data);
      setOriginalData(data);
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
    const keyMap: Record<string, string> = {
      'nombre': 'first_name',
      'apellido': 'last_name',
      'telefono': 'phone_number',
      'profesion': 'profession',
      'empresa': 'company',
      'cargo': 'job_title',
      'universidad': 'university',
      'carrera': 'degree',
      'ciudad': 'city',
      'pais': 'country',
      'bio': 'bio',
      'skills': 'skills',
    };

    const updates: Record<string, unknown> = {};
    Object.entries(parsedData).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;
      const mappedKey = keyMap[key] || key;
      updates[mappedKey] = value;
    });

    const newData = { ...formData, ...updates };
    setFormData(newData);
    saveProfile(newData);
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          const addr = data.address;

          if (addr) {
            const updates: Record<string, string> = {};
            if (addr.country) updates.country = addr.country;
            if (addr.city || addr.town || addr.village || addr.state) updates.city = addr.city || addr.town || addr.village || addr.state;
            if (addr.suburb || addr.neighbourhood || addr.city_district) updates.district = addr.suburb || addr.neighbourhood || addr.city_district;
            if (addr.postcode) updates.postal_code = addr.postcode;
            if (addr.road) updates.address = `${addr.road} ${addr.house_number || ''}`.trim();

            const newData = { ...formData, ...updates };
            setFormData(newData);
            saveProfile(newData, true);
          }
        } catch (error) {
          console.error("Error detecting location:", error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await api.patch('/users/me', { onboarding_completed: true });
      await saveProfile(formData, false);
      updateUser({ onboarding_completed: true });
    } catch (error) {
      console.error('Error completing profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const getSidebarIcon = (id: string, isActive: boolean) => {
    const props = { className: `w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted transition-colors'}` };
    switch (id) {
      case 'identity': return <User {...props} />;
      case 'location': return <MapPin {...props} />;
      case 'experience': return <Briefcase {...props} />;
      case 'education': return <GraduationCap {...props} />;
      default: return <User {...props} />;
    }
  };

  const activeSection = profileSections.find(s => s.id === activeSectionId) || profileSections[0];

  return (
    <div>
      <div className="flex justify-end mb-4 h-6">
        {showSaveSuccess && (
          <span className="text-green-400 text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> Guardado
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProfileForm
            activeSection={activeSection}
            formData={formData}
            onFieldChange={handleFieldChange}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
            isLocating={isLocating}
            onDetectLocation={handleDetectLocation}
          />
          
          <div className="bg-bg-secondary/30 p-6 rounded-2xl border border-white/5 space-y-6 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent-cyan/50" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-cyan/10">
                <Sparkles className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Base de Conocimientos (IA)
                </h3>
                <p className="text-xs text-text-muted">Añade patrones, links o datos extras para mejorar el autocompletado.</p>
              </div>
            </div>

            <KnowledgeManager 
              value={((formData.data as Record<string, unknown>)?.knowledge_base as KnowledgePattern[]) || []}
              onChange={(val) => {
                const currentData = (formData.data as Record<string, unknown>) || {};
                handleFieldChange('data', { ...currentData, knowledge_base: val });
              }}
            />
          </div>
        </div>

        <ProfileWizardSidebar
          activeSectionId={activeSectionId}
          setActiveSectionId={setActiveSectionId}
          completion={completion}
          isSaving={isSaving}
          hasChanges={hasChanges}
          formData={formData}
          handleCVUpload={handleCVUpload}
          handleSubmit={handleSubmit}
          getSidebarIcon={getSidebarIcon}
        />
      </div>
    </div>
  );
};

