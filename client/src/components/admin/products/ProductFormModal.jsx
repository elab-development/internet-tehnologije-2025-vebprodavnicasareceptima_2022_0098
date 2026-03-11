import { useEffect, useMemo, useState } from 'react';
import { FiLoader, FiPackage, FiAlertTriangle } from 'react-icons/fi';

import Modal from '../../ui/Modal';
import { useProductStore } from '../../../stores/useProductStore';
import { pickFirstError } from '../../../utils/helpers';

const initialState = {
  name: '',
  description: '',
  price: '',
};

export default function ProductFormModal({
  open,
  mode = 'create', // create | edit
  product = null,
  onClose,
  onSuccess,
}) {
  const createProduct = useProductStore((s) => s.createProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const loading = useProductStore((s) => s.loading);
  const storeError = useProductStore((s) => s.error);
  const clearError = useProductStore((s) => s.clearError);

  const [form, setForm] = useState(initialState);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!open) return;

    clearError();
    setLocalError('');

    if (mode === 'edit' && product) {
      setForm({
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price ?? '',
      });
    } else {
      setForm(initialState);
    }
  }, [open, mode, product, clearError]);

  const errorText = useMemo(() => {
    return localError || pickFirstError(storeError);
  }, [localError, storeError]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!name) {
      setLocalError('Name is required.');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setLocalError('Price must be a valid number greater than or equal to 0.');
      return;
    }

    const payload = {
      name,
      description: description || null,
      price: Number(price.toFixed(2)),
    };

    try {
      if (mode === 'edit' && product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      onSuccess?.();
      onClose?.();
    } catch {
      // store already handles error
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit product' : 'Create product'}
      widthClass='max-w-xl'
    >
      <form onSubmit={handleSubmit} className='space-y-5'>
        <div className='grid gap-4'>
          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-2'>
              Name
            </label>
            <input
              type='text'
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder='Enter product name'
              className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-2'>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder='Enter product description'
              rows={4}
              className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200 resize-none'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-2'>
              Price
            </label>
            <input
              type='number'
              step='0.01'
              min='0'
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder='0.00'
              className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200'
            />
          </div>
        </div>

        {errorText && (
          <div className='rounded-2xl bg-orange-50 text-orange-700 px-4 py-3 shadow-sm flex items-start gap-2'>
            <FiAlertTriangle className='mt-0.5 shrink-0' />
            <span className='text-sm'>{errorText}</span>
          </div>
        )}

        <div className='flex items-center justify-end gap-3 pt-2'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 font-semibold transition'
          >
            Cancel
          </button>

          <button
            type='submit'
            disabled={loading}
            className='rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white px-5 py-3 font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70'
          >
            <span className='inline-flex items-center gap-2'>
              {loading ? <FiLoader className='animate-spin' /> : <FiPackage />}
              {loading
                ? mode === 'edit'
                  ? 'Saving...'
                  : 'Creating...'
                : mode === 'edit'
                  ? 'Save changes'
                  : 'Create product'}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
}