import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'clinic_admin' | 'receptionist' | 'technician';
}

export function ProtectedRoute({ children, requiredRole = 'clinic_admin' }: ProtectedRouteProps) {
    const { user, role, loading, isClinicAdmin } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <p>Authenticating...</p>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check for clinic_admin access
    if (requiredRole === 'clinic_admin' && !isClinicAdmin) {
        // Receptionist or other roles get redirected to Big Green Heart
        return <Navigate to="/station" replace />;
    }

    // Check for specific role if required
    if (requiredRole && role !== requiredRole && role !== 'clinic_admin') {
        return <Navigate to="/station" replace />;
    }

    return <>{children}</>;
}
