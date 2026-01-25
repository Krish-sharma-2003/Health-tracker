import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Workouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    intensity: 'medium',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = async () => {
    try {
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const workoutsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
      }));
      setWorkouts(workoutsList);
    } catch (error) {
      console.error('Error loading workouts:', error);
      toast.error('Failed to load workouts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.duration) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const workoutData = {
        userId: user.uid,
        type: formData.type,
        duration: parseInt(formData.duration),
        intensity: formData.intensity,
        date: Timestamp.fromDate(new Date(formData.date))
      };

      if (editingId) {
        await updateDoc(doc(db, 'workouts', editingId), workoutData);
        toast.success('Workout updated!');
      } else {
        await addDoc(collection(db, 'workouts'), workoutData);
        toast.success('Workout logged!');
      }

      setFormData({
        type: '',
        duration: '',
        intensity: 'medium',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      setEditingId(null);
      loadWorkouts();
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Failed to save workout');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    
    try {
      await deleteDoc(doc(db, 'workouts', id));
      toast.success('Workout deleted');
      loadWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
    }
  };

  const handleEdit = (workout) => {
    setFormData({
      type: workout.type,
      duration: workout.duration.toString(),
      intensity: workout.intensity,
      date: workout.date.toISOString().split('T')[0]
    });
    setEditingId(workout.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-['Barlow_Condensed'] font-black text-5xl sm:text-6xl tracking-tighter mb-2">
              WORKOUTS
            </h1>
            <p className="text-[#9CA3AF]">Track every session, every rep</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
                setFormData({
                  type: '',
                  duration: '',
                  intensity: 'medium',
                  date: new Date().toISOString().split('T')[0]
                });
              }
            }}
            className="bg-[#CCFF00] text-black font-bold uppercase tracking-wider px-6 py-3 hover:bg-[#b3e600] transition-all rounded-none flex items-center gap-2"
            data-testid="add-workout-button"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Workout'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 mb-8"
          >
            <h2 className="font-['Barlow_Condensed'] font-bold text-2xl mb-6">
              {editingId ? 'Edit Workout' : 'New Workout'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Workout Type *</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Running, Weightlifting, Yoga"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="workout-type-input"
                  />
                </div>
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="30"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="workout-duration-input"
                  />
                </div>
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Intensity</label>
                  <select
                    value={formData.intensity}
                    onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="workout-intensity-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="workout-date-input"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#CCFF00] text-black font-bold uppercase tracking-wider px-8 py-3 hover:bg-[#b3e600] transition-all rounded-none"
                data-testid="submit-workout-button"
              >
                {editingId ? 'Update Workout' : 'Log Workout'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Workouts List */}
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-[#9CA3AF]">No workouts logged yet. Start tracking!</p>
            </div>
          ) : (
            workouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 workout-entry"
                data-testid={`workout-entry-${index}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-['Barlow_Condensed'] font-bold text-2xl">{workout.type}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        workout.intensity === 'high' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                        workout.intensity === 'medium' ? 'bg-[#FFD60A]/20 text-[#FFD60A]' :
                        'bg-[#00F0FF]/20 text-[#00F0FF]'
                      }`}>
                        {workout.intensity}
                      </span>
                    </div>
                    <div className="flex gap-6 text-[#9CA3AF] text-sm">
                      <span>{workout.duration} minutes</span>
                      <span>{workout.date.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="p-2 text-[#00F0FF] hover:bg-white/5 rounded-lg transition-colors"
                      data-testid={`edit-workout-${index}`}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="p-2 text-[#FF3B30] hover:bg-white/5 rounded-lg transition-colors"
                      data-testid={`delete-workout-${index}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Workouts;