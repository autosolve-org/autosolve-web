import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';

export const GoogleSignInButton = () => {
  const { login } = useAuth();

  return (
    <div className="google-btn-wrapper">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            console.log("Google Button Login success");
            login(credentialResponse.credential);
          }
        }}
        onError={() => {
          console.error('Google Login Error');
        }}
        theme="filled_black"
        shape="pill"
        size="large"
        text="continue_with"
        width="300"
      />
    </div>
  );
};

