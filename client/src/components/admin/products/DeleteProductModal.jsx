import { FiAlertTriangle, FiLoader, FiTrash2 } from 'react-icons/fi';

import Modal from '../../ui/Modal';
import { useProductStore } from '../../../stores/useProductStore';

export default function DeleteProductModal({
  open,
  product,
  onClose,
  onSuccess,
}) {
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const loading = useProductStore((s) => s.loading);

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product.id);
      onSuccess?.();
      onClose?.();
    } catch {
      // handled in store
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Delete product'
      widthClass='max-w-lg'
    >
      <div className='space-y-5'>
        <div className='rounded-2xl bg-orange-50 px-4 py-4 text-orange-700 shadow-sm flex items-start gap-3'>
          <FiAlertTriangle className='mt-0.5 shrink-0' />
          <div>
            <p className='font-semibold'>Are you sure?</p>
            <p className='text-sm mt-1'>
              You are about to delete{' '}
              <span className='font-semibold'>
                {product?.name || 'this product'}
              </span>
              .
            </p>
          </div>
        </div>

        <div className='flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 font-semibold transition'
          >
            Cancel
          </button>

          <button
            type='button'
            onClick={handleDelete}
            disabled={loading}
            className='rounded-2xl bg-red-500 hover:bg-red-600 text-white px-5 py-3 font-semibold shadow-md transition disabled:opacity-70'
          >
            <span className='inline-flex items-center gap-2'>
              {loading ? <FiLoader className='animate-spin' /> : <FiTrash2 />}
              {loading ? 'Deleting...' : 'Delete'}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}