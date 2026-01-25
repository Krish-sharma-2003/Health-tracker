import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Navbar from '@/components/Navbar';

const Progress = () => {
  const { user } = useAuth();
  const [workoutData, setWorkoutData] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user, timeframe]);

  const loadProgressData = async () => {
    try {
      const daysBack = timeframe === 'week' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Load workouts
      const workoutsQuery = query(
        collection(db, 'workouts'),
        where('userId', '==', user.uid),
        orderBy('date', 'asc')
      );
      const workoutsSnapshot = await getDocs(workoutsQuery);
      
      const workoutsByDate = {};
      workoutsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.date?.toDate();
        if (date && date >= startDate) {
          const dateKey = date.toISOString().split('T')[0];
          if (!workoutsByDate[dateKey]) {
            workoutsByDate[dateKey] = { date: dateKey, count: 0, duration: 0 };
          }
          workoutsByDate[dateKey].count++;
          workoutsByDate[dateKey].duration += data.duration || 0;
        }
      });

      // Load nutrition
      const nutritionQuery = query(
        collection(db, 'nutrition'),
        where('userId', '==', user.uid),
        orderBy('date', 'asc')
      );
      const nutritionSnapshot = await getDocs(nutritionQuery);
      
      const nutritionByDate = {};
      nutritionSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.date?.toDate();
        if (date && date >= startDate) {
          const dateKey = date.toISOString().split('T')[0];
          if (!nutritionByDate[dateKey]) {
            nutritionByDate[dateKey] = { date: dateKey, calories: 0 };
          }
          nutritionByDate[dateKey].calories += data.calories || 0;
        }
      });

      setWorkoutData(Object.values(workoutsByDate));
      setNutritionData(Object.values(nutritionByDate));
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-lg">
          <p className="text-[#9CA3AF] text-sm mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white font-bold">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h1 className="font-['Barlow_Condensed'] font-black text-5xl sm:text-6xl tracking-tighter mb-4">
            PROGRESS
          </h1>
          <p className="text-[#9CA3AF]">Track your journey to greatness</p>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-6 py-2 rounded-none transition-all ${
              timeframe === 'week'
                ? 'bg-[#CCFF00] text-black font-bold'
                : 'border border-white/20 text-white hover:bg-white/10'
            }`}
            data-testid="week-toggle"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-6 py-2 rounded-none transition-all ${
              timeframe === 'month'
                ? 'bg-[#CCFF00] text-black font-bold'
                : 'border border-white/20 text-white hover:bg-white/10'
            }`}
            data-testid="month-toggle"
          >
            Last 30 Days
          </button>
        </div>

        {/* Charts */}
        <div className="space-y-8">
          {/* Workout Duration Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
            data-testid="workout-chart"
          >
            <h2 className="font-['Barlow_Condensed'] font-bold text-2xl mb-6">Workout Duration (minutes)</h2>
            {workoutData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#CCFF00" 
                    strokeWidth={3}
                    dot={{ fill: '#CCFF00', r: 5 }}
                    name="Duration"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#9CA3AF]">
                No workout data available
              </div>
            )}
          </motion.div>

          {/* Workout Count Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8"
            data-testid="workout-count-chart"
          >
            <h2 className="font-['Barlow_Condensed'] font-bold text-2xl mb-6">Workout Frequency</h2>
            {workoutData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#00F0FF" 
                    radius={[8, 8, 0, 0]}
                    name="Workouts"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#9CA3AF]">
                No workout data available
              </div>
            )}
          </motion.div>

          {/* Nutrition Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
            data-testid="nutrition-chart"
          >
            <h2 className="font-['Barlow_Condensed'] font-bold text-2xl mb-6">Daily Calorie Intake</h2>
            {nutritionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#7000FF" 
                    strokeWidth={3}
                    dot={{ fill: '#7000FF', r: 5 }}
                    name="Calories"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#9CA3AF]">
                No nutrition data available
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Progress;