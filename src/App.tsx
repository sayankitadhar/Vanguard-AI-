import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClinicAdminDashboard } from './pages/ClinicAdminDashboard';
import { BigGreenHeart } from './pages/BigGreenHeart';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - redirect to station view */}
        <Route path="/" element={<Navigate to="/station" replace />} />

        {/* Big Green Heart - Single station view (accessible to all) */}
        <Route path="/station" element={<BigGreenHeart />} />

        {/* Admin Dashboard - Protected for clinic_admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="clinic_admin">
              <ClinicAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Login placeholder - implement actual auth UI */}
        <Route
          path="/login"
          element={
            <div className="login-placeholder">
              <h1>Login Required</h1>
              <p>Please sign in to access the admin dashboard.</p>
            </div>
          }
        />

        {/* Catch all - redirect to station */}
        <Route path="*" element={<Navigate to="/station" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
