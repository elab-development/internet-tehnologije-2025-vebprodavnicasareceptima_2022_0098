import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { money, toNumber } from '../../utils/helpers';

export default function CartItemRow({ item, onInc, onDec, onSet, onRemove }) {
  const price = toNumber(item?.price, 0);
  const qty = toNumber(item?.quantity, 0);
  const line = price * qty;

  return (
    <div className='rounded-2xl bg-white/80 shadow-md p-4 flex items-center justify-between gap-4'>
      <div className='min-w-0'>
        <p className='font-semibold text-slate-900 truncate'>
          {item?.name || 'Unnamed product'}
        </p>
        <p className='text-sm text-slate-600'>
          {money(price)} each • Line:{' '}
          <span className='font-semibold text-slate-900'>{money(line)}</span>
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <button
          onClick={() => onDec(item.product_id)}
          className='h-10 w-10 rounded-xl bg-white shadow hover:shadow-lg transition flex items-center justify-center text-slate-800'
          aria-label='Decrease'
        >
          <FiMinus />
        </button>

        <input
          value={String(qty)}
          onChange={(e) => onSet(item.product_id, e.target.value)}
          className='h-10 w-20 rounded-xl bg-white shadow px-3 text-center outline-none focus:ring-2 focus:ring-green-200'
          inputMode='decimal'
        />

        <button
          onClick={() => onInc(item.product_id)}
          className='h-10 w-10 rounded-xl bg-white shadow hover:shadow-lg transition flex items-center justify-center text-slate-800'
          aria-label='Increase'
        >
          <FiPlus />
        </button>

        <button
          onClick={() => onRemove(item.product_id)}
          className='h-10 w-10 rounded-xl bg-orange-500 text-white shadow hover:bg-orange-600 hover:shadow-lg transition flex items-center justify-center'
          aria-label='Remove'
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}