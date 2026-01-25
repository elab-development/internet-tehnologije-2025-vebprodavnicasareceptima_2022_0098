import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiClipboard, FiLoader } from 'react-icons/fi';

import { useOrderStore } from '../stores/useOrderStore';
import { money } from '../utils/helpers';

import OrderItemRow from '../components/orders/OrderItemRow';
import OrderSummaryCard from '../components/orders/OrderSummaryCard';

export default function OrderDetails() {
  const { orderId } = useParams();

  const order = useOrderStore((s) => s.order);
  const loading = useOrderStore((s) => s.loading);
  const error = useOrderStore((s) => s.error);
  const fetchOrder = useOrderStore((s) => s.fetchOrder);
  const clearError = useOrderStore((s) => s.clearError);

  useEffect(() => {
    if (!orderId) return;
    clearError();
    fetchOrder(orderId);
  }, [orderId, fetchOrder, clearError]);

  const items = order?.items || [];

  const computedTotal = useMemo(() => {
    const sum = items.reduce((acc, it) => {
      const price = Number(it?.price || 0);
      const qty = Number(it?.quantity || 0);
      return acc + price * qty;
    }, 0);
    return sum;
  }, [items]);

  return (
    <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-50 via-white to-orange-50'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between gap-3 mb-6'>
          <Link
            to='/'
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
          {/* Items */}
          <div className='lg:col-span-2 space-y-3'>
            {loading && (
              <div className='rounded-3xl bg-white/80 shadow-xl p-6 text-slate-700 flex items-center gap-2'>
                <FiLoader className='animate-spin' />
                Loading items...
              </div>
            )}

            {!loading && order && (
              <>
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

          {/* Summary */}
          <div className='lg:col-span-1'>
            <OrderSummaryCard order={order} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}