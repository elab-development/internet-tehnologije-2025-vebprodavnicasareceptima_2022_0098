import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function RequireGuest() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (token || user) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}