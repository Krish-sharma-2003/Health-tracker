import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, LogOut, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-['Barlow_Condensed'] font-black text-5xl sm:text-6xl tracking-tighter mb-12">
            PROFILE
          </h1>

          {/* Profile Card */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center gap-6 mb-8">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-2 border-[#CCFF00]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#CCFF00]/20 flex items-center justify-center">
                  <User className="w-12 h-12 text-[#CCFF00]" />
                </div>
              )}
              <div>
                <h2 className="font-['Barlow_Condensed'] font-bold text-3xl mb-2">
                  {user?.displayName || 'Athlete'}
                </h2>
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="font-['Barlow_Condensed'] font-bold text-xl mb-4">Account Information</h3>
              <div className="space-y-3 text-[#9CA3AF]">
                <div className="flex justify-between">
                  <span>Member Since</span>
                  <span className="text-white">
                    {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sign In</span>
                  <span className="text-white">
                    {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>User ID</span>
                  <span className="text-white font-mono text-xs">{user?.uid}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="glass-card p-8">
            <h3 className="font-['Barlow_Condensed'] font-bold text-xl mb-6">Settings</h3>
            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-3 bg-[#FF3B30]/20 text-[#FF3B30] font-bold uppercase tracking-wider px-6 py-4 hover:bg-[#FF3B30]/30 transition-all rounded-lg"
                data-testid="sign-out-button"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 glass-card p-8"
          >
            <h3 className="font-['Barlow_Condensed'] font-bold text-xl mb-6">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="font-['Barlow_Condensed'] font-black text-4xl text-[#CCFF00] mb-2">--</div>
                <div className="text-[#9CA3AF] text-sm">Total Workouts</div>
              </div>
              <div className="text-center">
                <div className="font-['Barlow_Condensed'] font-black text-4xl text-[#00F0FF] mb-2">--</div>
                <div className="text-[#9CA3AF] text-sm">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="font-['Barlow_Condensed'] font-black text-4xl text-[#7000FF] mb-2">--</div>
                <div className="text-[#9CA3AF] text-sm">Meals Logged</div>
              </div>
              <div className="text-center">
                <div className="font-['Barlow_Condensed'] font-black text-4xl text-white mb-2">--</div>
                <div className="text-[#9CA3AF] text-sm">Days Active</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;