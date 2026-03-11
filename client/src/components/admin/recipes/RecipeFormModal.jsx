import { useEffect, useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiBookOpen,
  FiLoader,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';

import Modal from '../../ui/Modal';
import { useRecipeStore } from '../../../stores/useRecipeStore';
import { useProductStore } from '../../../stores/useProductStore';
import { money, pickFirstError } from '../../../utils/helpers';

function createEmptyIngredient() {
  return {
    product_id: '',
    quantity: '1',
  };
}

export default function RecipeFormModal({
  open,
  mode = 'create',
  recipe = null,
  onClose,
  onSuccess,
}) {
  const createRecipe = useRecipeStore((s) => s.createRecipe);
  const updateRecipe = useRecipeStore((s) => s.updateRecipe);
  const recipeLoading = useRecipeStore((s) => s.loading);
  const recipeError = useRecipeStore((s) => s.error);
  const clearRecipeError = useRecipeStore((s) => s.clearError);

  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([createEmptyIngredient()]);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!open) return;
    fetchProducts().catch(() => {});
  }, [open, fetchProducts]);

  useEffect(() => {
    if (!open) return;

    clearRecipeError();
    setLocalError('');

    if (mode === 'edit' && recipe) {
      setName(recipe.name ?? '');
      setDescription(recipe.description ?? '');

      const mapped =
        Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
          ? recipe.ingredients.map((ing) => ({
              product_id: String(ing.product_id ?? ing.product?.id ?? ''),
              quantity: String(ing.quantity ?? '1'),
            }))
          : [createEmptyIngredient()];

      setIngredients(mapped);
    } else {
      setName('');
      setDescription('');
      setIngredients([createEmptyIngredient()]);
    }
  }, [open, mode, recipe, clearRecipeError]);

  const errorText = useMemo(() => {
    return localError || pickFirstError(recipeError);
  }, [localError, recipeError]);

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addIngredientRow = () => {
    setIngredients((prev) => [...prev, createEmptyIngredient()]);
  };

  const removeIngredientRow = (index) => {
    setIngredients((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setLocalError('Recipe name is required.');
      return;
    }

    const normalized = ingredients.map((ing) => ({
      product_id: Number(ing.product_id),
      quantity: Number(ing.quantity),
    }));

    if (normalized.length === 0) {
      setLocalError('At least one ingredient is required.');
      return;
    }

    if (
      normalized.some(
        (ing) =>
          !Number.isInteger(ing.product_id) ||
          ing.product_id <= 0 ||
          !Number.isFinite(ing.quantity) ||
          ing.quantity <= 0,
      )
    ) {
      setLocalError('Each ingredient must have a valid product and quantity.');
      return;
    }

    const uniqueIds = new Set(normalized.map((ing) => ing.product_id));
    if (uniqueIds.size !== normalized.length) {
      setLocalError(
        'The same product cannot appear multiple times in one recipe.',
      );
      return;
    }

    const payload = {
      name: trimmedName,
      description: trimmedDescription || null,
      ingredients: normalized.map((ing) => ({
        product_id: ing.product_id,
        quantity: Number(ing.quantity.toFixed(2)),
      })),
    };

    try {
      if (mode === 'edit' && recipe) {
        await updateRecipe(recipe.id, payload);
      } else {
        await createRecipe(payload);
      }

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
      title={mode === 'edit' ? 'Edit recipe' : 'Create recipe'}
      widthClass='max-w-3xl'
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid gap-4'>
          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-2'>
              Recipe name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter recipe name'
              className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-2'>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder='Enter recipe description'
              className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200 resize-none'
            />
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h4 className='text-lg font-bold text-slate-900'>Ingredients</h4>
              <p className='text-sm text-slate-600'>
                Select products and quantities for this recipe.
              </p>
            </div>

            <button
              type='button'
              onClick={addIngredientRow}
              className='rounded-2xl bg-white shadow-sm hover:shadow-md px-4 py-2 font-semibold text-slate-700 transition inline-flex items-center gap-2'
            >
              <FiPlus />
              Add ingredient
            </button>
          </div>

          {products.length === 0 && (
            <div className='rounded-2xl bg-orange-50 px-4 py-3 text-orange-700 shadow-sm'>
              You need at least one product in the system before creating a
              recipe.
            </div>
          )}

          <div className='space-y-3'>
            {ingredients.map((ingredient, index) => {
              const selectedProduct = products.find(
                (p) => p.id === Number(ingredient.product_id),
              );

              return (
                <div
                  key={index}
                  className='grid grid-cols-1 md:grid-cols-[1.5fr_0.8fr_auto] gap-3 rounded-2xl bg-slate-50 p-4'
                >
                  <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-2'>
                      Product
                    </label>
                    <select
                      value={ingredient.product_id}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          'product_id',
                          e.target.value,
                        )
                      }
                      className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200'
                    >
                      <option value=''>Select product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({money(product.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-2'>
                      Quantity
                    </label>
                    <input
                      type='number'
                      min='0.01'
                      step='0.01'
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          'quantity',
                          e.target.value,
                        )
                      }
                      className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-200'
                    />
                  </div>

                  <div className='flex items-end'>
                    <button
                      type='button'
                      onClick={() => removeIngredientRow(index)}
                      disabled={ingredients.length === 1}
                      className='w-full md:w-auto rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2'
                    >
                      <FiTrash2 />
                      Remove
                    </button>
                  </div>

                  {selectedProduct && (
                    <div className='md:col-span-3 text-sm text-slate-600'>
                      Selected:{' '}
                      <span className='font-semibold'>
                        {selectedProduct.name}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
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
            disabled={recipeLoading || products.length === 0}
            className='rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white px-5 py-3 font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70'
          >
            <span className='inline-flex items-center gap-2'>
              {recipeLoading ? (
                <FiLoader className='animate-spin' />
              ) : (
                <FiBookOpen />
              )}
              {recipeLoading
                ? mode === 'edit'
                  ? 'Saving...'
                  : 'Creating...'
                : mode === 'edit'
                  ? 'Save changes'
                  : 'Create recipe'}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
}