import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Github } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Sign in failed. Please check Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error('GitHub sign in error:', error);
      toast.error('Sign in failed. Please check Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-12">
          {/* Logo */}
          <div className="text-center mb-12">
            <h1 className="font-['Barlow_Condensed'] font-black text-5xl tracking-tighter text-[#CCFF00] mb-3">
              FITPRO
            </h1>
            <p className="text-[#9CA3AF]">Sign in to track your fitness journey</p>
          </div>

          {/* Auth Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full glass border border-white/20 text-white px-6 py-4 hover:bg-white/10 transition-all rounded-lg flex items-center justify-center gap-3 disabled:opacity-50"
              data-testid="google-signin-button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleGithubSignIn}
              disabled={loading}
              className="w-full glass border border-white/20 text-white px-6 py-4 hover:bg-white/10 transition-all rounded-lg flex items-center justify-center gap-3 disabled:opacity-50"
              data-testid="github-signin-button"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-[#525252]">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-[#9CA3AF] hover:text-white transition-colors"
            data-testid="back-to-home-button"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;