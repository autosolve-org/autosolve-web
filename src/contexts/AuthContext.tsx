import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../services/auth.service';
import { authService } from '../services/auth.service';
import { extensionBridge } from '../utils/extensionBridge';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credential: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          // Sync tokens with extension if present
          const accessToken = authService.getAccessToken();
          const refreshToken = localStorage.getItem('refresh_token');
          if (accessToken && refreshToken) {
            extensionBridge.syncTokens(accessToken, refreshToken);
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          authService.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const login = async (credential: string) => {
    setIsLoading(true);
    try {
      const response = await authService.loginWithGoogle(credential);
      setUser(response.user);
      extensionBridge.syncTokens(response.access_token, response.refresh_token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    extensionBridge.clearTokens();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
