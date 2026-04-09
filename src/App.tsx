import { type FC, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { AuthPage } from './pages/AuthPage';
import { ProfileWizardPage } from './pages/ProfileWizardPage';
import { WelcomePage } from './pages/WelcomePage';
import { PlansPage } from './pages/PlansPage';

// Protected Route Component
const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-12 h-12 border-4 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App: FC = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-red-500 p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Error de Configuración</h1>
          <p>Falta la variable de entorno VITE_GOOGLE_CLIENT_ID.</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfileWizardPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/welcome"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <WelcomePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/plan"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PlansPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/profile" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" expand={false} richColors closeButton />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
