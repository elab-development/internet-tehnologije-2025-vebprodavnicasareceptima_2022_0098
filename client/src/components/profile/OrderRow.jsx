import { Link } from 'react-router-dom';
import { FiChevronRight, FiPackage } from 'react-icons/fi';
import { money, formatDateTime, statusBadgeClass } from '../../utils/helpers';

export default function OrderRow({ order }) {
  const itemsCount = Array.isArray(order?.items) ? order.items.length : null;

  return (
    <Link
      to={`/order/${order.id}`}
      className='block rounded-2xl bg-white/80 shadow-md hover:shadow-lg transition p-4'
    >
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='h-10 w-10 rounded-2xl bg-green-50 shadow flex items-center justify-center text-green-700'>
            <FiPackage />
          </div>

          <div className='min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <p className='font-bold text-slate-900'>Order #{order.id}</p>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full shadow-sm ${statusBadgeClass(
                  order.status,
                )}`}
              >
                {order.status}
              </span>
            </div>

            <p className='text-sm text-slate-600'>
              Total:{' '}
              <span className='font-semibold'>{money(order.total_amount)}</span>
              {itemsCount !== null ? ` • Items: ${itemsCount}` : ''}
              {order?.created_at
                ? ` • ${formatDateTime(order.created_at)}`
                : ''}
            </p>
          </div>
        </div>

        <div className='text-slate-500'>
          <FiChevronRight />
        </div>
      </div>
    </Link>
  );
}