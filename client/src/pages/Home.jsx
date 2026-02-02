import { useEffect } from 'react';
import { FiLoader, FiAlertTriangle, FiBook } from 'react-icons/fi';
import { useRecipeStore } from '../stores/useRecipeStore';
import RecipeCard from '../components/RecipeCard';
import { pickFirstError } from '../utils/helpers';

export default function Home() {
  const recipes = useRecipeStore((s) => s.recipes);
  const loading = useRecipeStore((s) => s.loading);
  const error = useRecipeStore((s) => s.error);
  const fetchRecipes = useRecipeStore((s) => s.fetchRecipes);

  useEffect(() => {
    fetchRecipes().catch(() => {});
  }, [fetchRecipes]);

  const errorText = pickFirstError(error);

  return (
    <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-50 via-white to-orange-50'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white flex items-center justify-center shadow'>
            <FiBook size={20} />
          </div>

          <div>
            <h1 className='text-2xl font-bold text-slate-900'>Recipes</h1>
            <p className='text-sm text-slate-600'>Browse available recipes</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className='flex items-center gap-3 text-slate-700 bg-white/70 shadow-md rounded-2xl px-4 py-3'>
            <FiLoader className='animate-spin' />
            Loading recipes...
          </div>
        )}

        {/* Error */}
        {!loading && errorText && (
          <div className='flex items-center gap-3 text-orange-700 bg-orange-50 shadow-md rounded-2xl px-4 py-3'>
            <FiAlertTriangle />
            {errorText}
          </div>
        )}

        {/* Empty */}
        {!loading && !errorText && recipes.length === 0 && (
          <div className='text-slate-600 bg-white/70 shadow-md rounded-2xl px-4 py-6 text-center'>
            No recipes available.
          </div>
        )}

        {/* Grid */}
        {!loading && recipes.length > 0 && (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}