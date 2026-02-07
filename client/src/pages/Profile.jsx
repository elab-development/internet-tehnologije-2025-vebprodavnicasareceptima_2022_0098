import ProfileHeader from '../components/profile/ProfileHeader';
import AdminPlaceholder from '../components/profile/AdminPlaceholder';
import UserOrdersPanel from '../components/profile/UserOrdersPanel';

import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  const orderStore = {
    orders: useOrderStore((s) => s.orders),
    loading: useOrderStore((s) => s.loading),
    error: useOrderStore((s) => s.error),
    fetchOrders: useOrderStore((s) => s.fetchOrders),
    clearError: useOrderStore((s) => s.clearError),
  };

  const isAdmin = (user?.role || '').toLowerCase() === 'admin';

  return (
    <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-50 via-white to-orange-50'>
      <div className='max-w-6xl mx-auto px-4 py-8 space-y-6'>
        <ProfileHeader user={user} />

        {isAdmin ? (
          <AdminPlaceholder />
        ) : (
          <UserOrdersPanel user={user} orderStore={orderStore} />
        )}
      </div>
    </div>
  );
}