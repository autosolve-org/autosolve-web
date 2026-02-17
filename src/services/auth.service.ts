// Google OAuth and JWT token management

import { api } from './api';

export interface User {
  id: string;
  email: string;
  nombre?: string;
  apellido?: string;
  picture?: string;
  onboarding_completed: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    console.log('Sending login request to:', '/auth/google');
    console.log('Payload:', { google_token: credential.substring(0, 10) + '...' });
    const response = await api.post<AuthResponse>('/auth/google', {
      google_token: credential,
    });

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
};
