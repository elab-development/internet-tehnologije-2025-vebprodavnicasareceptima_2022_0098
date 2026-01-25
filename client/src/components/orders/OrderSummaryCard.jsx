import { FiInfo, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { money, pickFirstError, formatDateTime } from '../../utils/helpers';

export default function OrderSummaryCard({ order, loading, error }) {
  const errText = pickFirstError(error);

  return (
    <div className='rounded-3xl bg-white/80 shadow-xl p-6 sticky top-24'>
      <h2 className='text-lg font-bold text-slate-900 flex items-center gap-2'>
        <FiInfo />
        Order summary
      </h2>

      {loading && (
        <div className='mt-4 flex items-center gap-2 text-slate-700'>
          <FiLoader className='animate-spin' />
          Loading order...
        </div>
      )}

      {errText && !loading && (
        <div className='mt-4 rounded-2xl bg-orange-50 shadow p-3 text-orange-700 flex items-center gap-2'>
          <FiAlertTriangle />
          <span className='text-sm'>{errText}</span>
        </div>
      )}

      {!loading && !errText && order && (
        <div className='mt-4 space-y-2 text-slate-700'>
          <div className='flex items-center justify-between'>
            <span>Order ID</span>
            <span className='font-semibold'>#{order.id}</span>
          </div>

          <div className='flex items-center justify-between'>
            <span>Status</span>
            <span className='font-semibold'>{order.status}</span>
          </div>

          <div className='flex items-center justify-between'>
            <span>Total</span>
            <span className='font-bold text-slate-900'>
              {money(order.total_amount)}
            </span>
          </div>

          {order?.created_at && (
            <div className='flex items-center justify-between'>
              <span>Created</span>
              <span className='text-sm'>
                {formatDateTime(order.created_at)}
              </span>
            </div>
          )}

          {order?.user && (
            <div className='pt-3 mt-3 border-t border-white/60'>
              <p className='text-sm font-semibold text-slate-900'>Customer</p>
              <p className='text-sm text-slate-700'>{order.user.name}</p>
              <p className='text-xs text-slate-500'>{order.user.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}