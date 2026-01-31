import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';
import Navbar from '../components/Navbar';

export default function AppLayout() {
  const token = useAuthStore((s) => s.token);
  const me = useAuthStore((s) => s.me);

  const hydrateCart = useCartStore((s) => s.hydrate);

  useEffect(() => {
    hydrateCart();
    if (token) {
      me().catch(() => {});
    }
  }, [token, me, hydrateCart]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50'>
      <Navbar />
      <main className='max-w-6xl mx-auto px-4 py-6'>
        <Outlet />
      </main>
    </div>
  );
}