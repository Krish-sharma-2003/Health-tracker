import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Nutrition = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mealName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    try {
      const q = query(
        collection(db, 'nutrition'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const entriesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
      }));
      setEntries(entriesList);
    } catch (error) {
      console.error('Error loading nutrition:', error);
      toast.error('Failed to load nutrition data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.mealName || !formData.calories) {
      toast.error('Please fill meal name and calories');
      return;
    }

    try {
      const entryData = {
        userId: user.uid,
        mealName: formData.mealName,
        calories: parseInt(formData.calories),
        protein: formData.protein ? parseInt(formData.protein) : 0,
        carbs: formData.carbs ? parseInt(formData.carbs) : 0,
        fats: formData.fats ? parseInt(formData.fats) : 0,
        date: Timestamp.fromDate(new Date(formData.date))
      };

      await addDoc(collection(db, 'nutrition'), entryData);
      toast.success('Meal logged!');

      setFormData({
        mealName: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      loadEntries();
    } catch (error) {
      console.error('Error saving nutrition:', error);
      toast.error('Failed to log meal');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    
    try {
      await deleteDoc(doc(db, 'nutrition', id));
      toast.success('Entry deleted');
      loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const todayTotal = entries
    .filter(e => e.date.toDateString() === new Date().toDateString())
    .reduce((sum, e) => sum + e.calories, 0);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="font-['Barlow_Condensed'] font-black text-5xl sm:text-6xl tracking-tighter mb-2">
              NUTRITION
            </h1>
            <p className="text-[#9CA3AF]">Fuel your performance</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#CCFF00] text-black font-bold uppercase tracking-wider px-6 py-3 hover:bg-[#b3e600] transition-all rounded-none flex items-center gap-2"
            data-testid="add-meal-button"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Meal'}
          </button>
        </div>

        {/* Today's Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8"
          data-testid="today-summary-card"
        >
          <div className="text-[#9CA3AF] text-sm uppercase tracking-wider mb-4">Today's Total</div>
          <div className="font-['Barlow_Condensed'] font-black text-6xl text-[#CCFF00]">{todayTotal}</div>
          <div className="text-[#9CA3AF]">Calories</div>
        </motion.div>

        {/* Add Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 mb-8"
          >
            <h2 className="font-['Barlow_Condensed'] font-bold text-2xl mb-6">Log Meal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Meal Name *</label>
                  <input
                    type="text"
                    value={formData.mealName}
                    onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
                    placeholder="e.g., Breakfast, Lunch"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="meal-name-input"
                  />
                </div>
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Calories *</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="500"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="calories-input"
                  />
                </div>
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    placeholder="25"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="protein-input"
                  />
                </div>
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    placeholder="50"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="carbs-input"
                  />
                </div>
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Fats (g)</label>
                  <input
                    type="number"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    placeholder="15"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="fats-input"
                  />
                </div>
                <div>
                  <label className="block text-[#9CA3AF] text-sm mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#CCFF00] focus:outline-none"
                    data-testid="meal-date-input"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#CCFF00] text-black font-bold uppercase tracking-wider px-8 py-3 hover:bg-[#b3e600] transition-all rounded-none"
                data-testid="submit-meal-button"
              >
                Log Meal
              </button>
            </form>
          </motion.div>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-[#9CA3AF]">No meals logged yet. Start tracking!</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 workout-entry"
                data-testid={`nutrition-entry-${index}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-['Barlow_Condensed'] font-bold text-2xl mb-2">{entry.mealName}</h3>
                    <div className="flex gap-6 text-[#9CA3AF] text-sm">
                      <span className="text-[#CCFF00] font-bold">{entry.calories} cal</span>
                      {entry.protein > 0 && <span>P: {entry.protein}g</span>}
                      {entry.carbs > 0 && <span>C: {entry.carbs}g</span>}
                      {entry.fats > 0 && <span>F: {entry.fats}g</span>}
                      <span>{entry.date.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-[#FF3B30] hover:bg-white/5 rounded-lg transition-colors"
                    data-testid={`delete-nutrition-${index}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;