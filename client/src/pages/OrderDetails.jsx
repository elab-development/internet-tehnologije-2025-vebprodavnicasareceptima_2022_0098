import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiClipboard,
  FiLoader,
  FiSave,
  FiAlertTriangle,
} from 'react-icons/fi';

import { useOrderStore } from '../stores/useOrderStore';
import { useAuthStore } from '../stores/useAuthStore';
import { money, pickFirstError, statusBadgeClass } from '../utils/helpers';

import OrderItemRow from '../components/orders/OrderItemRow';
import OrderSummaryCard from '../components/orders/OrderSummaryCard';

const ORDER_STATUSES = ['pending', 'paid', 'fulfilled', 'cancelled'];

export default function OrderDetails() {
  const { orderId } = useParams();

  const user = useAuthStore((s) => s.user);

  const order = useOrderStore((s) => s.order);
  const loading = useOrderStore((s) => s.loading);
  const error = useOrderStore((s) => s.error);
  const fetchOrder = useOrderStore((s) => s.fetchOrder);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const clearError = useOrderStore((s) => s.clearError);

  const [status, setStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!orderId) return;
    clearError();
    fetchOrder(orderId).catch(() => {});
  }, [orderId, fetchOrder, clearError]);

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
  }, [order]);

  const items = order?.items || [];

  const computedTotal = useMemo(() => {
    const sum = items.reduce((acc, it) => {
      const price = Number(it?.price || 0);
      const qty = Number(it?.quantity || 0);
      return acc + price * qty;
    }, 0);
    return sum;
  }, [items]);

  const errorText = useMemo(() => pickFirstError(error), [error]);

  const handleStatusUpdate = async () => {
    if (!order?.id || !status) return;

    try {
      setSuccessMessage('');
      await updateOrderStatus(order.id, status);
      setSuccessMessage('Order status updated successfully.');
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch {
      // error handled in store
    }
  };

  return (
    <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-50 via-white to-orange-50'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='flex items-center justify-between gap-3 mb-6'>
          <Link
            to={isAdmin ? '/admin' : '/profile'}
            className='inline-flex items-center gap-2 rounded-xl bg-white/80 shadow-md px-3 py-2 text-slate-800 hover:shadow-lg transition'
          >
            <FiArrowLeft />
            Back
          </Link>

          <div className='inline-flex items-center gap-2 rounded-2xl bg-white/80 shadow-md px-4 py-2 text-slate-800'>
            <FiClipboard />
            <span className='font-semibold'>Order details</span>
            {order?.id && <span className='text-slate-500'>#{order.id}</span>}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-3'>
            {loading && (
              <div className='rounded-3xl bg-white/80 shadow-xl p-6 text-slate-700 flex items-center gap-2'>
                <FiLoader className='animate-spin' />
                Loading items...
              </div>
            )}

            {!loading && errorText && (
              <div className='rounded-3xl bg-orange-50 shadow-xl p-6 text-orange-700 flex items-center gap-2'>
                <FiAlertTriangle />
                {errorText}
              </div>
            )}

            {!loading && order && (
              <>
              <div className='rounded-3xl bg-white/80 shadow-xl p-6 space-y-4'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div>
                      <h1 className='text-2xl font-bold text-slate-900'>
                        Order #{order.id}
                      </h1>
                      <p className='mt-2 text-slate-600'>
                        Customer:{' '}
                        <span className='font-semibold text-slate-800'>
                          {order?.user?.name || 'Unknown user'}
                        </span>
                        {order?.user?.email ? ` • ${order.user.email}` : ''}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-semibold px-3 py-2 rounded-full shadow-sm w-fit ${statusBadgeClass(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {isAdmin && (
                    <div className='rounded-2xl bg-slate-50 p-4 border border-slate-100'>
                      <div className='flex flex-col md:flex-row md:items-end gap-3'>
                        <div className='flex-1'>
                          <label className='block text-sm font-semibold text-slate-700 mb-2'>
                            Update order status
                          </label>

                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200'
                          >
                            {ORDER_STATUSES.map((statusOption) => (
                              <option key={statusOption} value={statusOption}>
                                {statusOption}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={handleStatusUpdate}
                          disabled={
                            loading || !order || status === order.status
                          }
                          className={[
                            'rounded-2xl px-5 py-3 font-semibold shadow-md transition inline-flex items-center justify-center gap-2',
                            loading || !order || status === order.status
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-600 to-orange-500 text-white hover:shadow-lg',
                          ].join(' ')}
                        >
                          {loading ? (
                            <FiLoader className='animate-spin' />
                          ) : (
                            <FiSave />
                          )}
                          {loading ? 'Saving...' : 'Save status'}
                        </button>
                      </div>

                      {successMessage && (
                        <div className='mt-3 rounded-2xl bg-green-50 text-green-700 px-4 py-3 text-sm shadow-sm'>
                          {successMessage}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className='rounded-3xl bg-white/80 shadow-xl p-6 text-slate-700'>
                    No items found for this order.
                  </div>
                ) : (
                  <>
                    {items.map((it) => (
                      <OrderItemRow
                        key={it.id ?? `${it.product_id}`}
                        item={it}
                      />
                    ))}

                    <div className='rounded-2xl bg-white/70 shadow-md p-4 flex items-center justify-between'>
                      <span className='text-slate-700'>Total</span>
                      <span className='text-lg font-bold text-slate-900'>
                        {money(order.total_amount ?? computedTotal)}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className='lg:col-span-1'>
            <OrderSummaryCard order={order} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}