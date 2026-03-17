import { useState, useEffect, type FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  profileSections,
  calculateOverallCompletion
} from '../utils/profileFields';
import { flattenDataLearned, normalizeDataLearned, promoteLearnedValue } from '../utils/dataLearned';
import { api } from '../services/api';
import { profileService } from '../services/profile.service';
import { extensionBridge } from '../utils/extensionBridge';

// Components
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin
} from 'lucide-react';

// New Components
import { ProfileForm } from '../components/profile-wizard/ProfileForm';
import { ProfileWizardSidebar } from '../components/profile-wizard/ProfileWizardSidebar';

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
    'Identidad': true
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
          const flatLearned = flattenDataLearned(profile.data_learned);
          initialData = { ...initialData, ...profile, ...flatLearned };
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
    setFormData(prev => {
        const newData = { ...prev };
        if (value === undefined) {
            delete newData[name];
        } else {
            newData[name] = value;
        }
        return newData;
    });
  };

  const saveProfile = async (data: Record<string, unknown>, silent = false) => {
    if (!user?.id) return;
    if (!silent) setIsSaving(true);
    try {
        const strictSQLKeys = ['id', 'user_id', 'cv_url', 'data_learned', 'preferences', 'created_at', 'updated_at', 'onboarding_completed', 'avatar_url', 'display_name', 'google_id', 'is_active', 'last_login', 'plan', 'provider', 'email'];
      const learnedPayload = normalizeDataLearned(data.data_learned);
      const payload: Record<string, unknown> = {
          data_learned: learnedPayload
      };

      for (const [key, value] of Object.entries(data)) {
          if (strictSQLKeys.includes(key)) {
              payload[key] = value;
          } else {
            const stringValue = String(value ?? '').trim();
            if (!stringValue) {
              delete learnedPayload[key];
            } else {
              Object.assign(learnedPayload, promoteLearnedValue(learnedPayload, key, stringValue));
            }
          }
      }

      await profileService.updateProfile(payload);
      updateUser(data);
      setOriginalData(data);
      
      // Tell the extension to fetch the newest profile version
      extensionBridge.refreshProfileCache();
      
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

  const handleCVUpload = async () => {
    // The backend already updated the database with the CV data during the parse_cv request.
    // So we just need to re-fetch the latest profile data from the server.
    try {
      const updatedProfile = await profileService.getActiveProfile(true); // force refresh
      if (updatedProfile && user?.id) {
        const mergedProfile = {
          ...updatedProfile,
          ...flattenDataLearned(updatedProfile.data_learned)
        };
        setFormData(prev => ({ ...prev, ...mergedProfile }));
        setOriginalData(prev => ({ ...prev, ...mergedProfile }));
        updateUser(updatedProfile);
        extensionBridge.refreshProfileCache();
      }
    } catch (error) {
      console.error('Error fetching updated profile after CV upload:', error);
    }
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

            let currentLearned = normalizeDataLearned(formData.data_learned);
            Object.entries(updates).forEach(([key, value]) => {
              currentLearned = promoteLearnedValue(currentLearned, key, value);
            });

            const newData = {
              ...formData,
              ...updates,
              data_learned: currentLearned,
            };
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
            isSaving={isSaving}
            showSaveSuccess={showSaveSuccess}
          />
          
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

