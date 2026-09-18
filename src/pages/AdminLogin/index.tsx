import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../services/firebase/config";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      
      if (err.code === 'auth/popup-blocked') {
        setError("Sign-in popup was blocked by your browser. Please allow popups for this site.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in was cancelled.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("Multiple popup requests were cancelled.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Network error. Please check your connection.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for Firebase Auth.");
      } else {
        setError("Authentication failed or unauthorized access.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] pb-24">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-medium mb-2">Restricted Access</h1>
          <p className="text-text-secondary">Administrative login.</p>
        </div>
        
        <div className="glass-card p-8 rounded-2xl flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <p className="text-sm text-text-secondary text-center">
            Sign in with your authorized Google account to access the dashboard.
          </p>

          <button 
            onClick={handleGoogleLogin}
            className="glass-button w-full py-4 rounded-lg font-medium tracking-wide mt-2 flex items-center justify-center gap-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20.94c5.05 0 9.14-4.1 9.14-9.14 0-.66-.06-1.3-.17-1.93H12v3.66h5.2a4.47 4.47 0 0 1-1.92 2.94 4.8 4.8 0 0 1-5.28-.46 4.6 4.6 0 0 1-1.9-3.7A4.6 4.6 0 0 1 10.02 8.6a4.8 4.8 0 0 1 5.28-.46l2.6-2.6a8.4 8.4 0 0 0-5.9-2.48c-5.05 0-9.14 4.1-9.14 9.14s4.1 9.14 9.14 9.14Z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}