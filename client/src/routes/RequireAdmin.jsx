import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function RequireAdmin() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (!user) {
    return null;
  }

  if (user.role !== 'admin') {
    return <Navigate to='/profile' replace />;
  }

  return <Outlet />;
}