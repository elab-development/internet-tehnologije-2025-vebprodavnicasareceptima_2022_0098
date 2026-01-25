import { money, toNumber } from '../../utils/helpers';
import { FiBox } from 'react-icons/fi';

export default function OrderItemRow({ item }) {
  const name =
    item?.product?.name || item?.name || `Product #${item?.product_id ?? '?'}`;

  const price = toNumber(item?.price, 0);
  const qty = toNumber(item?.quantity, 0);
  const line = price * qty;

  return (
    <div className='rounded-2xl bg-white/80 shadow-md p-4 flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3 min-w-0'>
        <div className='h-10 w-10 rounded-2xl bg-green-50 shadow flex items-center justify-center text-green-700'>
          <FiBox />
        </div>
        <div className='min-w-0'>
          <p className='font-semibold text-slate-900 truncate'>{name}</p>
          <p className='text-sm text-slate-600'>
            {money(price)} each • Qty:{' '}
            <span className='font-semibold'>{money(qty)}</span>
          </p>
        </div>
      </div>

      <div className='text-right'>
        <p className='text-sm text-slate-600'>Line total</p>
        <p className='text-lg font-bold text-slate-900'>{money(line)}</p>
      </div>
    </div>
  );
}