import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || (user && user.role !== 'ADMIN')) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
