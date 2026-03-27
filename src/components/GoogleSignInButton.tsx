import { GoogleLogin } from '@react-oauth/google';

export const GoogleSignInButton = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleManualRedirect = () => {
    // Usamos el origen exacto que suele estar autorizado en la consola de Google
    const redirectUri = window.location.origin; 
    const scope = encodeURIComponent('openid email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&ux_mode=redirect`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="google-btn-wrapper" onClick={handleManualRedirect}>
      {/* Usamos el diseño oficial de Google pero lo cubrimos con un div para manejar la redirección manual */}
      <div style={{ pointerEvents: 'none' }}>
        <GoogleLogin
          onSuccess={() => {}}
          onError={() => {}}
          theme="filled_black"
          shape="pill"
          size="large"
          text="continue_with"
          width="300"
        />
      </div>
    </div>
  );
};

