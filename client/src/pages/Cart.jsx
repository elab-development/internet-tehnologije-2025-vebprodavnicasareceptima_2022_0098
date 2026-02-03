import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';
import { useOrderStore } from '../stores/useOrderStore';
import { money } from '../utils/helpers';

import CartItemRow from '../components/cart/CartItemRow';
import OrderSummary from '../components/cart/OrderSummary';

export default function Cart() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const items = useCartStore((s) => s.items);
  const inc = useCartStore((s) => s.increment);
  const dec = useCartStore((s) => s.decrement);
  const setQty = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.removeItem);
  const subtotalFn = useCartStore((s) => s.subtotal);
  const totalItemsFn = useCartStore((s) => s.totalItems);
  const toOrderPayload = useCartStore((s) => s.toOrderPayload);
  const clearCart = useCartStore((s) => s.clear);

  const createOrder = useOrderStore((s) => s.createOrder);
  const loading = useOrderStore((s) => s.loading);
  const error = useOrderStore((s) => s.error);
  const clearOrderError = useOrderStore((s) => s.clearError);

  const [toast, setToast] = useState(null);

  const subtotal = useMemo(() => subtotalFn(), [items, subtotalFn]);
  const totalItems = useMemo(() => totalItemsFn(), [items, totalItemsFn]);

  const canCheckout = Boolean(user) && items.length > 0;

  const onCheckout = async () => {
    if (!canCheckout) return;
    clearOrderError();

    try {
      const payload = toOrderPayload();
      const order = await createOrder(payload);

      clearCart();
      setToast('Order created!');
      setTimeout(() => setToast(null), 1200);

      navigate(`/order/${order.id}`);
    } catch {}
  };

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
            <FiShoppingBag />
            <span className='font-semibold'>Cart</span>
            <span className='text-slate-500'>
              ({totalItems.toFixed(2)} items)
            </span>
          </div>
        </div>

        {toast && (
          <div className='mb-4 rounded-2xl bg-white/90 shadow-lg px-4 py-3 text-slate-800'>
            {toast}
          </div>
        )}

        {/* Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Items */}
          <div className='lg:col-span-2 space-y-3'>
            {items.length === 0 ? (
              <div className='rounded-3xl bg-white/80 shadow-xl p-6 text-slate-700'>
                <p className='font-semibold text-slate-900'>
                  Your cart is empty.
                </p>
                <p className='mt-1 text-slate-600'>
                  Go back to recipes and add ingredients/products.
                </p>
                <Link
                  to='/'
                  className='inline-flex mt-4 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white px-4 py-2 font-semibold shadow hover:shadow-lg transition'
                >
                  Browse recipes
                </Link>
              </div>
            ) : (
              <>
                {items.map((it) => (
                  <CartItemRow
                    key={it.product_id}
                    item={it}
                    onInc={(pid) => inc(pid, 1)}
                    onDec={(pid) => dec(pid, 1)}
                    onSet={(pid, value) => setQty(pid, value)}
                    onRemove={(pid) => remove(pid)}
                  />
                ))}

                <div className='rounded-2xl bg-white/70 shadow-md p-4 flex items-center justify-between'>
                  <span className='text-slate-700'>Subtotal</span>
                  <span className='text-lg font-bold text-slate-900'>
                    {money(subtotal)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <div className='lg:col-span-1'>
            <OrderSummary
              totalItems={totalItems}
              subtotal={subtotal}
              canCheckout={canCheckout}
              loading={loading}
              error={error}
              onCheckout={onCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}