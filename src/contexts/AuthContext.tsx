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

  const login = async (credential: string) => {
    console.log('AuthContext: starting login process...');
    setIsLoading(true);
    try {
      console.log('AuthContext: calling authService.loginWithGoogle...');
      const response = await authService.loginWithGoogle(credential);
      console.log('AuthContext: login successful, user:', response.user.email);
      setUser(response.user);
      extensionBridge.syncTokens(response.access_token, response.refresh_token, response.user);
    } catch (error) {
      console.error('AuthContext: login failed:', error);
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

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      console.log('AuthContext: initializing...');
      
      // 1. Check if we are returning from a Google redirect
      const hash = window.location.hash;
      console.log('AuthContext: current hash:', hash ? 'present' : 'empty');
      
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
          console.log('AuthContext: Redirect token detected! Attempting login...');
          try {
            await login(accessToken);
            console.log('AuthContext: Redirect login success. Cleaning URL...');
            window.history.replaceState(null, '', window.location.pathname);
            setIsLoading(false);
            return;
          } catch (error) {
            console.error('AuthContext: Failed to login with redirect token:', error);
          }
        }
      }

      // 2. Otherwise, check existing session
      console.log('AuthContext: checking existing session...');
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          console.log('AuthContext: session found for:', userData.email);
          setUser(userData);
          // Sync tokens with extension if present
          const accessToken = authService.getAccessToken();
          const refreshToken = localStorage.getItem('refresh_token');
          if (accessToken && refreshToken) {
            extensionBridge.syncTokens(accessToken, refreshToken, userData);
          }
        } catch (error) {
          console.error('AuthContext: Failed to fetch user from session:', error);
          authService.logout();
          setUser(null);
        }
      } else {
        console.log('AuthContext: no existing session.');
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

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
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
          <div className="w-12 h-12 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
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
