import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Activity, Flame, TrendingUp, Utensils } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    streak: 0,
    workoutsThisWeek: 0,
    caloriesLogged: 0,
    totalWorkouts: 0
  });
  const [quote] = useState(getRandomQuote());

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const workoutsRef = collection(db, 'workouts');
      const q = query(workoutsRef, where('userId', '==', user.uid), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      let workoutsThisWeek = 0;
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.date && data.date.toDate() > weekAgo) {
          workoutsThisWeek++;
        }
      });

      const nutritionRef = collection(db, 'nutrition');
      const nq = query(nutritionRef, where('userId', '==', user.uid), limit(7));
      const nutritionSnapshot = await getDocs(nq);
      
      let totalCalories = 0;
      nutritionSnapshot.docs.forEach(doc => {
        totalCalories += doc.data().calories || 0;
      });

      setStats({
        streak: calculateStreak(snapshot.docs),
        workoutsThisWeek,
        caloriesLogged: Math.round(totalCalories),
        totalWorkouts: snapshot.size
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const calculateStreak = (docs) => {
    if (docs.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let doc of docs) {
      const workoutDate = doc.data().date?.toDate();
      if (workoutDate) {
        workoutDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === streak) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-['Barlow_Condensed'] font-black text-5xl sm:text-6xl tracking-tighter mb-4">
            WELCOME BACK, <span className="text-[#CCFF00]">{user?.displayName?.split(' ')[0] || 'ATHLETE'}</span>
          </h1>
          <p className="text-[#9CA3AF] text-lg">Let's make today count</p>
        </motion.div>

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Streak Card - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 glass-card p-8 stat-card"
            data-testid="streak-card"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-[#9CA3AF] text-sm uppercase tracking-wider mb-2">Current Streak</div>
                <div className="font-['Barlow_Condensed'] font-black text-7xl text-[#CCFF00]">{stats.streak}</div>
              </div>
              <Flame className="w-16 h-16 text-[#CCFF00]" />
            </div>
            <div className="text-[#9CA3AF]">Consecutive days of tracking</div>
          </motion.div>

          {/* Workouts This Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 stat-card"
            data-testid="workouts-week-card"
          >
            <Activity className="w-10 h-10 text-[#00F0FF] mb-4" />
            <div className="font-['Barlow_Condensed'] font-black text-5xl mb-2">{stats.workoutsThisWeek}</div>
            <div className="text-[#9CA3AF] text-sm">Workouts This Week</div>
          </motion.div>

          {/* Total Workouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 stat-card"
            data-testid="total-workouts-card"
          >
            <TrendingUp className="w-10 h-10 text-[#7000FF] mb-4" />
            <div className="font-['Barlow_Condensed'] font-black text-5xl mb-2">{stats.totalWorkouts}</div>
            <div className="text-[#9CA3AF] text-sm">Total Workouts</div>
          </motion.div>

          {/* Motivational Quote - Takes full width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 glass-card p-12 text-center"
            data-testid="quote-card"
          >
            <div className="text-[#CCFF00] text-2xl font-['Barlow_Condensed'] font-bold mb-4">"{quote.text}"</div>
            <div className="text-[#9CA3AF]">— {quote.author}</div>
          </motion.div>

          {/* Calories Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 glass-card p-8 stat-card"
            data-testid="calories-card"
          >
            <Utensils className="w-10 h-10 text-[#CCFF00] mb-4" />
            <div className="font-['Barlow_Condensed'] font-black text-5xl mb-2">{stats.caloriesLogged}</div>
            <div className="text-[#9CA3AF] text-sm">Calories Logged (Last 7 Days)</div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-2 glass-card p-8"
          >
            <div className="text-[#9CA3AF] text-sm uppercase tracking-wider mb-6">Quick Actions</div>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/workouts'}
                className="w-full bg-[#CCFF00] text-black font-bold uppercase tracking-wider px-6 py-3 hover:bg-[#b3e600] transition-all rounded-none text-sm"
                data-testid="log-workout-button"
              >
                Log Workout
              </button>
              <button
                onClick={() => window.location.href = '/nutrition'}
                className="w-full border border-white/20 text-white px-6 py-3 hover:bg-white/10 transition-all rounded-none text-sm"
                data-testid="log-meal-button"
              >
                Log Meal
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const getRandomQuote = () => {
  const quotes = [
    { text: "The only bad workout is the one that didn't happen", author: "Unknown" },
    { text: "Strength does not come from physical capacity. It comes from an indomitable will", author: "Mahatma Gandhi" },
    { text: "Your body can stand almost anything. It's your mind you have to convince", author: "Unknown" },
    { text: "Success isn't always about greatness. It's about consistency", author: "Dwayne Johnson" },
    { text: "The pain you feel today will be the strength you feel tomorrow", author: "Unknown" },
    { text: "Champions are made from something they have deep inside them", author: "Ali" },
    { text: "Push yourself because no one else is going to do it for you", author: "Unknown" },
    { text: "Great things never come from comfort zones", author: "Unknown" }
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export default Dashboard;