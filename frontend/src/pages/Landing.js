import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, TrendingUp, Target, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Activity,
      title: 'Track Workouts',
      description: 'Log every rep, every set, every session with precision'
    },
    {
      icon: TrendingUp,
      title: 'Monitor Progress',
      description: 'Visualize your gains with powerful analytics and charts'
    },
    {
      icon: Target,
      title: 'Hit Your Goals',
      description: 'Set targets and stay accountable with streak tracking'
    },
    {
      icon: Zap,
      title: 'Stay Consistent',
      description: 'Build discipline through daily tracking and motivation'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1700784795176-7ff886439d79?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwyfHxhdGhsZXRlJTIwbmVvbiUyMGRhcmslMjBneW18ZW58MHx8fHwxNzY5MjY0NTc1fDA&ixlib=rb-4.1.0&q=85"
            alt="Fitness background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-[#050505]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-8">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[#CCFF00] font-['Barlow_Condensed'] text-2xl font-black tracking-tighter"
            >
              FITPRO
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="px-6 py-2 border border-white/20 text-white hover:bg-white/10 transition-all rounded-none skew-button"
              data-testid="nav-cta-button"
            >
              <span>{user ? 'Dashboard' : 'Sign In'}</span>
            </motion.button>
          </nav>

          {/* Hero Content - Tetris Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-7xl mx-auto mt-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-7 space-y-8"
            >
              <h1 className="font-['Barlow_Condensed'] font-black text-6xl sm:text-7xl lg:text-8xl tracking-tighter leading-[0.9]">
                YOUR BODY.
                <br />
                <span className="text-[#CCFF00]">YOUR RULES.</span>
                <br />
                YOUR DATA.
              </h1>
              <p className="text-[#9CA3AF] text-lg max-w-xl">
                Elite fitness tracking for those who demand precision. Track workouts, monitor nutrition, and visualize progress like a pro athlete.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-[#CCFF00] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-[#b3e600] transition-all rounded-none skew-button text-sm"
                  data-testid="hero-get-started-button"
                >
                  <span>Get Started</span>
                </button>
                <button
                  className="bg-transparent border border-white/20 text-white px-8 py-4 hover:bg-white/10 transition-all rounded-none skew-button text-sm"
                  data-testid="hero-learn-more-button"
                >
                  <span>Learn More</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-5 flex items-center"
            >
              <div className="glass-card p-8 space-y-6 w-full">
                <div className="text-[#00F0FF] text-sm font-bold uppercase tracking-wider">Live Stats</div>
                <div className="space-y-4">
                  <div>
                    <div className="text-5xl font-['Barlow_Condensed'] font-black text-[#CCFF00]">2.4K+</div>
                    <div className="text-[#9CA3AF] text-sm">Active Users</div>
                  </div>
                  <div>
                    <div className="text-5xl font-['Barlow_Condensed'] font-black text-white">15M+</div>
                    <div className="text-[#9CA3AF] text-sm">Workouts Logged</div>
                  </div>
                  <div>
                    <div className="text-5xl font-['Barlow_Condensed'] font-black text-[#7000FF]">98%</div>
                    <div className="text-[#9CA3AF] text-sm">Goal Achievement</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-['Barlow_Condensed'] font-black text-5xl sm:text-6xl tracking-tighter mb-4">
              BUILT FOR <span className="text-[#CCFF00]">PERFORMANCE</span>
            </h2>
            <p className="text-[#9CA3AF] text-lg">Every feature designed for serious athletes</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 stat-card"
                data-testid={`feature-card-${index}`}
              >
                <feature.icon className="w-12 h-12 text-[#CCFF00] mb-6 stroke-[1.5]" />
                <h3 className="font-['Barlow_Condensed'] font-bold text-2xl mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center glass-card p-16"
        >
          <h2 className="font-['Barlow_Condensed'] font-black text-5xl sm:text-6xl tracking-tighter mb-6">
            READY TO <span className="text-[#CCFF00]">DOMINATE</span>?
          </h2>
          <p className="text-[#9CA3AF] text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of athletes who track every workout, every meal, every win.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-[#CCFF00] text-black font-bold uppercase tracking-wider px-12 py-5 hover:bg-[#b3e600] transition-all rounded-none skew-button text-base"
            data-testid="cta-start-button"
          >
            <span>Start Tracking Now</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;