import { useEffect } from 'react';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { pickFirstError } from '../../utils/helpers';
import OrderRow from './OrderRow';

export default function UserOrdersPanel({ user, orderStore }) {
  const { orders, loading, error, fetchOrders, clearError } = orderStore;

  useEffect(() => {
    if (!user?.id) return;
    clearError();
    fetchOrders();
  }, [user?.id, fetchOrders, clearError]);

  const errText = pickFirstError(error);

  return (
    <div className='rounded-3xl bg-white/80 shadow-xl p-6'>
      <h2 className='text-lg font-bold text-slate-900'>My orders</h2>

      {loading && (
        <div className='mt-4 flex items-center gap-2 text-slate-700'>
          <FiLoader className='animate-spin' />
          Loading orders...
        </div>
      )}

      {errText && !loading && (
        <div className='mt-4 rounded-2xl bg-orange-50 shadow p-3 text-orange-700 flex items-center gap-2'>
          <FiAlertTriangle />
          <span className='text-sm'>{errText}</span>
        </div>
      )}

      {!loading && !errText && (
        <div className='mt-4 space-y-3'>
          {orders.length === 0 ? (
            <div className='rounded-2xl bg-green-50/60 shadow p-4 text-slate-700'>
              You don’t have any orders yet.
            </div>
          ) : (
            orders.map((o) => <OrderRow key={o.id} order={o} />)
          )}
        </div>
      )}
    </div>
  );
}