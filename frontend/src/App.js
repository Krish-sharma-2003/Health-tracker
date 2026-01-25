import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Workouts from '@/pages/Workouts';
import Nutrition from '@/pages/Nutrition';
import Progress from '@/pages/Progress';
import Profile from '@/pages/Profile';
import '@/App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <Workouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <Nutrition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;