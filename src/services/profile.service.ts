import { api } from './api';
import { type ProfileDTO } from '../models/profile.dto';

// Variables for caching the profile to avoid redundant API calls
let cachedProfile: ProfileDTO | null = null;
let profileFetchPromise: Promise<ProfileDTO | null> | null = null;

export const profileService = {
  async getActiveProfile(forceRefresh = false): Promise<ProfileDTO | null> {
    // Return cached profile if available and not forcing refresh
    if (!forceRefresh && cachedProfile) {
      return cachedProfile;
    }

    // Return the ongoing promise if a fetch is already in progress
    if (!forceRefresh && profileFetchPromise) {
      return profileFetchPromise;
    }

    profileFetchPromise = (async () => {
      try {
        const response = await api.get<ProfileDTO>('/users/profiles');
        cachedProfile = response;
        return response;
      } catch (error) {
        console.warn('Failed to fetch active profile:', error);
        return null; 
      } finally {
        profileFetchPromise = null;
      }
    })();

    return profileFetchPromise;
  },

  async updateProfile(data: Record<string, unknown>): Promise<ProfileDTO> {
     const updated = await api.put<ProfileDTO>(`/users/profiles`, data); 
     
     // Update local cache
     if (cachedProfile && (cachedProfile.id === updated.id)) {
       cachedProfile = { ...cachedProfile, ...updated };
     } else {
       cachedProfile = updated;
     }
     
     return updated;
  },

  async createProfile(data: Record<string, unknown>): Promise<ProfileDTO> {
      const created = await api.post<ProfileDTO>('/users/profiles', data);
      cachedProfile = created;
      return created;
  },

  clearCache(): void {
    cachedProfile = null;
    profileFetchPromise = null;
  }
};
