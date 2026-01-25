import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, Utensils, TrendingUp, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/workouts', icon: Activity, label: 'Workouts' },
    { path: '/nutrition', icon: Utensils, label: 'Nutrition' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="font-['Barlow_Condensed'] font-black text-2xl tracking-tighter text-[#CCFF00] cursor-pointer"
          >
            FITPRO
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#CCFF00]/20 text-[#CCFF00]'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                  }`}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#CCFF00]/20 text-[#CCFF00]'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                  }`}
                  data-testid={`nav-mobile-${link.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;