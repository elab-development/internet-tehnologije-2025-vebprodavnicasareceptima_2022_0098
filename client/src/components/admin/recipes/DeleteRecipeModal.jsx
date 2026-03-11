import { FiAlertTriangle, FiLoader, FiTrash2 } from 'react-icons/fi';

import Modal from '../../ui/Modal';
import { useRecipeStore } from '../../../stores/useRecipeStore';

export default function DeleteRecipeModal({
  open,
  recipe,
  onClose,
  onSuccess,
}) {
  const deleteRecipe = useRecipeStore((s) => s.deleteRecipe);
  const loading = useRecipeStore((s) => s.loading);

  const handleDelete = async () => {
    if (!recipe) return;

    try {
      await deleteRecipe(recipe.id);
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
      title='Delete recipe'
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
                {recipe?.name || 'this recipe'}
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