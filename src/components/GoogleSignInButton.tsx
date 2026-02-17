import { GoogleLogin } from '@react-oauth/google';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError: () => void;
}

export const GoogleSignInButton = ({ onSuccess, onError }: GoogleSignInButtonProps) => {
  return (
    <div className="google-btn-wrapper">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
          } else {
            onError();
          }
        }}
        onError={onError}
        theme="filled_black"
        shape="pill"
        size="large"
        text="continue_with"
        width="300"
      />
    </div>
  );
};
