import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function RequireAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token) {
    return <Navigate to='/login' />;
  }

  if (!user) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-10'>
        <div className='rounded-2xl bg-white/80 shadow-lg p-6'>
          <p className='text-slate-700'>Loading user...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}