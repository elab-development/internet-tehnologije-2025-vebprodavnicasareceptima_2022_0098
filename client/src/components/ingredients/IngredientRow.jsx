import { FiPlus } from 'react-icons/fi';

export default function IngredientRow({ ingredient, canAdd, onAdd }) {
  const name = ingredient?.product?.name ?? 'Unknown';
  const price = Number(ingredient?.product?.price ?? 0);
  const qty = Number(ingredient?.quantity ?? 0);

  return (
    <div className='rounded-2xl bg-white/80 shadow-md p-4 flex items-center justify-between gap-3'>
      <div className='min-w-0'>
        <p className='font-semibold text-slate-900 truncate'>{name}</p>
        <p className='text-sm text-slate-600'>
          Qty: <span className='font-medium'>{qty}</span>
          {Number.isFinite(price) && price > 0 ? (
            <>
              {' '}
              • Price: <span className='font-medium'>{price.toFixed(2)}</span>
            </>
          ) : null}
        </p>
      </div>

      {canAdd && (
        <button
          onClick={() => onAdd?.(ingredient)}
          className='shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-orange-500 text-white px-3 py-2 text-sm font-semibold shadow hover:shadow-lg transition'
        >
          <FiPlus />
          Add
        </button>
      )}
    </div>
  );
}