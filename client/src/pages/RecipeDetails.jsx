import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiAlertTriangle,
  FiLoader,
  FiShoppingCart,
} from 'react-icons/fi';

import { useAuthStore } from '../stores/useAuthStore';
import { useRecipeStore } from '../stores/useRecipeStore';
import { useIngredientStore } from '../stores/useIngredientStore';
import { useCartStore } from '../stores/useCartStore';

import IngredientsList from '../components/ingredients/IngredientsList';
import {
  pickFirstError,
  ingredientToCartProduct,
  ingredientQuantity,
} from '../utils/helpers';

export default function RecipeDetails() {
  const { recipeId } = useParams();

  const user = useAuthStore((s) => s.user);

  const recipe = useRecipeStore((s) => s.recipe);
  const recipeLoading = useRecipeStore((s) => s.loading);
  const recipeError = useRecipeStore((s) => s.error);
  const fetchRecipe = useRecipeStore((s) => s.fetchRecipe);

  const ingredients = useIngredientStore((s) => s.ingredients);
  const ingLoading = useIngredientStore((s) => s.loading);
  const ingError = useIngredientStore((s) => s.error);
  const fetchForRecipe = useIngredientStore((s) => s.fetchForRecipe);

  const addItem = useCartStore((s) => s.addItem);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!recipeId) return;

    // recipe + ingredients
    fetchRecipe(recipeId).catch(() => {});
    fetchForRecipe(recipeId).catch(() => {});
  }, [recipeId, fetchRecipe, fetchForRecipe]);

  const loading = recipeLoading || ingLoading;

  const errorText = useMemo(() => {
    return pickFirstError(recipeError) || pickFirstError(ingError);
  }, [recipeError, ingError]);

  const canAdd = Boolean(user);

  const onAddOne = (ingredient) => {
    if (!canAdd) return;

    const product = ingredientToCartProduct(ingredient);
    const qty = ingredientQuantity(ingredient, 1);

    addItem(product, qty);
    setToast(`Added ${product.name || 'item'} to cart`);
    setTimeout(() => setToast(null), 1800);
  };

  const onAddAll = () => {
    if (!canAdd) return;
    if (!ingredients.length) return;

    ingredients.forEach((ing) => onAddOne(ing));
    setToast('Added all ingredients to cart');
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-50 via-white to-orange-50'>
      <div className='max-w-5xl mx-auto px-4 py-8'>
        {/* Top bar */}
        <div className='flex items-center justify-between gap-3 mb-6'>
          <Link
            to='/'
            className='inline-flex items-center gap-2 rounded-xl bg-white/80 shadow-md px-3 py-2 text-slate-800 hover:shadow-lg transition'
          >
            <FiArrowLeft />
            Back
          </Link>

          {canAdd && (
            <Link
              to='/cart'
              className='inline-flex items-center gap-2 rounded-xl bg-white/80 shadow-md px-3 py-2 text-slate-800 hover:shadow-lg transition'
            >
              <FiShoppingCart />
              Cart
            </Link>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className='mb-4 rounded-2xl bg-white/90 shadow-lg px-4 py-3 text-slate-800'>
            {toast}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className='flex items-center gap-3 text-slate-700 bg-white/70 shadow-md rounded-2xl px-4 py-3'>
            <FiLoader className='animate-spin' />
            Loading recipe...
          </div>
        )}

        {/* Error */}
        {!loading && errorText && (
          <div className='flex items-center gap-3 text-orange-700 bg-orange-50 shadow-md rounded-2xl px-4 py-3'>
            <FiAlertTriangle />
            {errorText}
          </div>
        )}

        {/* Content */}
        {!loading && !errorText && recipe && (
          <div className='space-y-6'>
            {/* Recipe info */}
            <div className='rounded-3xl bg-white/80 shadow-xl p-6'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <h1 className='text-2xl font-bold text-slate-900 truncate'>
                    {recipe.name}
                  </h1>
                  {recipe.description ? (
                    <p className='mt-2 text-slate-700'>{recipe.description}</p>
                  ) : (
                    <p className='mt-2 text-slate-600'>
                      No description provided.
                    </p>
                  )}
                </div>

                <div className='shrink-0 rounded-2xl px-4 py-2 bg-gradient-to-r from-green-600 to-orange-500 text-white shadow-md'>
                  <p className='text-xs opacity-90'>Ingredients</p>
                  <p className='text-lg font-bold'>{ingredients.length}</p>
                </div>
              </div>

              {!canAdd && (
                <div className='mt-4 rounded-2xl bg-green-50/70 p-4 text-slate-700'>
                  Log in to add ingredients to your cart.
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between gap-3'>
                <h2 className='text-xl font-bold text-slate-900'>
                  Ingredients
                </h2>

                {canAdd && ingredients.length > 0 && (
                  <button
                    onClick={onAddAll}
                    className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-orange-500 text-white px-4 py-2 text-sm font-semibold shadow hover:shadow-lg transition'
                  >
                    <FiShoppingCart />
                    Add all to cart
                  </button>
                )}
              </div>

              <IngredientsList
                ingredients={ingredients}
                canAdd={canAdd}
                onAddOne={onAddOne}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}