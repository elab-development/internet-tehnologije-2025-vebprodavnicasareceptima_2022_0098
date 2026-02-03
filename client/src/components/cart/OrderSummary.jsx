import { FiShoppingCart, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { money, pickFirstError } from '../../utils/helpers';

export default function OrderSummary({
  totalItems,
  subtotal,
  canCheckout,
  loading,
  error,
  onCheckout,
}) {
  const errText = pickFirstError(error);

  return (
    <div className='rounded-3xl bg-white/80 shadow-xl p-6 sticky top-24'>
      <h2 className='text-lg font-bold text-slate-900'>Order summary</h2>

      <div className='mt-4 space-y-2 text-slate-700'>
        <div className='flex items-center justify-between'>
          <span>Total items</span>
          <span className='font-semibold'>{totalItems.toFixed(2)}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span>Subtotal</span>
          <span className='font-semibold'>{money(subtotal)}</span>
        </div>
      </div>

      {errText && (
        <div className='mt-4 rounded-2xl bg-orange-50 shadow p-3 text-orange-700 flex items-center gap-2'>
          <FiAlertTriangle />
          <span className='text-sm'>{errText}</span>
        </div>
      )}

      <button
        onClick={onCheckout}
        disabled={!canCheckout || loading}
        className={[
          'mt-5 w-full rounded-2xl py-3 font-semibold shadow-md transition flex items-center justify-center gap-2',
          canCheckout && !loading
            ? 'bg-gradient-to-r from-green-600 to-orange-500 text-white hover:shadow-lg'
            : 'bg-slate-200 text-slate-500 cursor-not-allowed',
        ].join(' ')}
      >
        {loading ? <FiLoader className='animate-spin' /> : <FiShoppingCart />}
        {loading ? 'Creating order...' : 'Create order'}
      </button>

      {!canCheckout && (
        <p className='mt-3 text-xs text-slate-600'>
          You need items in cart and you must be logged in to checkout.
        </p>
      )}
    </div>
  );
}