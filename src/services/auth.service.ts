// Google OAuth and JWT token management

import { api } from './api';
import { profileService } from './profile.service';

export interface User {
  id: string;
  email: string;
  display_name?: string;
  given_name?: string;
  family_name?: string;
  avatar_url?: string;
  onboarding_completed: boolean;
  plan: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    console.log('authService: loginWithGoogle triggered');
    console.log('authService: endpoint:', '/auth/google');
    // Log safe version of credential
    console.log('authService: token prefix:', credential.substring(0, 10) + '...');
    
    const response = await api.post<AuthResponse>('/auth/google', {
      google_token: credential,
    });
    
    console.log('authService: login request completed successfully');

    // Store tokens
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);

    return response;
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    // Update tokens
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);

    return response;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Clear profile cache on logout
    profileService.clearCache();
    
    // Clear extension storage if available
    if (window.chrome?.runtime?.id) {
      try {
        window.postMessage({ type: 'AUTOSOLVE_LOGOUT' }, '*');
      } catch (error) {
        console.warn('Failed to sync logout with extension:', error);
      }
    }
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  async updateCurrentUser(updates: Partial<User>): Promise<User> {
    return api.patch<User>('/users/me', updates);
  },
};
