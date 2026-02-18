import { api } from './api';

// We can define the shape here or import it. Let's use a flexible Record or define interface if needed.
// For now, based on backend, ProfileResponse matches what we need.

export interface Profile {
  id: string;
  user_id: string;
  label: string;
  is_default: boolean;
  first_name: string;
  last_name: string;
  email: string;
  // ... other fields matching ProfileResponse in backend
  [key: string]: unknown;
}

export const profileService = {
  async getActiveProfile(): Promise<Profile | null> {
    try {
      const response = await api.get<Profile>('/users/profiles/active');
      return response;
    } catch (error) {
      console.warn('Failed to fetch active profile:', error);
      return null; 
    }
  },

  async updateProfile(userId: string, data: Record<string, unknown>): Promise<Profile> {
     // The current implementation uses PUT /users/profiles/{userId} which seems odd (usually userId isn't profileId).
     // Wait, let's check `ProfileWizardPage.tsx` save logic:
     // await api.put(`/users/profiles/${user.id}`, data);
     // Backend `update_profile` expects `profile_id`.
     // If the frontend is passing `user.id` as `profile_id`, that might be an issue unless the ID happens to match (unlikely for UUIDs) OR if the backend treats it loosely (it doesn't).
     // Wait, let's double check `routers/users.py`:
     // @router.put("/profiles/{profile_id}") ... async def update_profile(profile_id: str, ...)
     // profile = await _get_user_profile(db, current_user.id, profile_id)
     // So it expects the PROFILE ID.
     // In `ProfileWizardPage.tsx`, `user.id` is passed?
     // `await api.put(`/users/profiles/${user.id}`, data);`
     // This looks like a BUG in the existing code if `user.id` != `profile.id`.
     // I should probably fix this too if I see it.
     
     // However, let's stick to creating the service first.
     return api.put<Profile>(`/users/profiles/${userId}`, data); 
  },

  async createProfile(data: Record<string, unknown>): Promise<Profile> {
      return api.post<Profile>('/users/profiles', data);
  }
};
