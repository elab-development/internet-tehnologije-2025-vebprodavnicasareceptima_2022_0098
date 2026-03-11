import { useEffect, useMemo, useState } from 'react';
import {
  FiBookOpen,
  FiEdit2,
  FiLoader,
  FiAlertTriangle,
  FiPlus,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';

import { useRecipeStore } from '../../stores/useRecipeStore';
import { pickFirstError } from '../../utils/helpers';

import RecipeFormModal from './recipes/RecipeFormModal';
import DeleteRecipeModal from './recipes/DeleteRecipeModal';

export default function AdminRecipesTab() {
  const recipes = useRecipeStore((s) => s.recipes);
  const meta = useRecipeStore((s) => s.meta);
  const loading = useRecipeStore((s) => s.loading);
  const error = useRecipeStore((s) => s.error);
  const fetchRecipes = useRecipeStore((s) => s.fetchRecipes);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);
  const [deleteRecipe, setDeleteRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes({
      search,
      page,
      per_page: 10,
      sort: 'name',
    }).catch(() => {});
  }, [fetchRecipes, search, page]);

  const reload = () => {
    fetchRecipes({
      search,
      page,
      per_page: 10,
      sort: 'name',
    }).catch(() => {});
  };

  const errorText = useMemo(() => pickFirstError(error), [error]);

  return (
    <>
      <div className='rounded-3xl bg-white/80 shadow-xl p-6 space-y-5'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h2 className='text-xl font-bold text-slate-900'>Recipes</h2>
            <p className='text-slate-600 mt-1'>
              Pregled recepata i njihovih sastojaka.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
            <div className='relative w-full sm:w-80'>
              <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder='Search recipes...'
                className='w-full rounded-2xl bg-white shadow-sm border border-slate-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-200'
              />
            </div>

            <button
              onClick={() => setCreateOpen(true)}
              className='rounded-2xl bg-gradient-to-r from-green-600 to-orange-500 text-white px-4 py-3 font-semibold shadow-md hover:shadow-lg transition inline-flex items-center justify-center gap-2'
            >
              <FiPlus />
              Create recipe
            </button>
          </div>
        </div>

        {loading && (
          <div className='rounded-2xl bg-white shadow-md px-4 py-3 flex items-center gap-3 text-slate-700'>
            <FiLoader className='animate-spin' />
            Loading recipes...
          </div>
        )}

        {!loading && errorText && (
          <div className='rounded-2xl bg-orange-50 shadow-md px-4 py-3 flex items-center gap-3 text-orange-700'>
            <FiAlertTriangle />
            {errorText}
          </div>
        )}

        {!loading && !errorText && (
          <>
            <div className='rounded-2xl bg-green-50/70 px-4 py-3 text-sm text-slate-700 shadow-sm'>
              Total recipes:{' '}
              <span className='font-semibold'>
                {meta?.total ?? recipes.length}
              </span>
            </div>

            <div className='overflow-x-auto rounded-2xl shadow-md'>
              <table className='min-w-full bg-white'>
                <thead className='bg-slate-100 text-slate-700'>
                  <tr>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      ID
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Name
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Description
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Ingredients
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Created
                    </th>
                    <th className='px-4 py-3 text-left text-sm font-semibold'>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recipes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='px-4 py-10 text-center text-slate-500'
                      >
                        No recipes found.
                      </td>
                    </tr>
                  ) : (
                    recipes.map((recipe) => {
                      const ingredientsCount = Array.isArray(recipe.ingredients)
                        ? recipe.ingredients.length
                        : (recipe.ingredients_count ?? 0);

                      return (
                        <tr
                          key={recipe.id}
                          className='border-t border-slate-100 hover:bg-slate-50/80 transition'
                        >
                          <td className='px-4 py-3 text-sm font-semibold text-slate-800'>
                            #{recipe.id}
                          </td>

                          <td className='px-4 py-3'>
                            <div className='flex items-center gap-3 min-w-0'>
                              <div className='h-10 w-10 rounded-2xl bg-green-50 shadow flex items-center justify-center text-green-700'>
                                <FiBookOpen />
                              </div>
                              <div className='min-w-0'>
                                <p className='font-semibold text-slate-900 truncate'>
                                  {recipe.name}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className='px-4 py-3 text-sm text-slate-600 max-w-[360px]'>
                            <div className='truncate'>
                              {recipe.description || 'No description'}
                            </div>
                          </td>

                          <td className='px-4 py-3 text-sm font-semibold text-slate-900'>
                            {ingredientsCount}
                          </td>

                          <td className='px-4 py-3 text-sm text-slate-600'>
                            {recipe.created_at
                              ? new Date(recipe.created_at).toLocaleString()
                              : '-'}
                          </td>

                          <td className='px-4 py-3'>
                            <div className='flex items-center gap-2'>
                              <button
                                onClick={() => setEditRecipe(recipe)}
                                className='rounded-xl bg-white shadow-sm hover:shadow-md px-3 py-2 text-slate-700 transition inline-flex items-center gap-2'
                              >
                                <FiEdit2 />
                                Edit
                              </button>

                              <button
                                onClick={() => setDeleteRecipe(recipe)}
                                className='rounded-xl bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 transition inline-flex items-center gap-2'
                              >
                                <FiTrash2 />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className='flex items-center justify-between gap-3'>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className='rounded-2xl px-4 py-2 shadow-sm bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Previous
              </button>

              <div className='text-sm text-slate-600'>
                Page <span className='font-semibold'>{meta?.page ?? page}</span>
                {' / '}
                <span className='font-semibold'>{meta?.last_page ?? 1}</span>
              </div>

              <button
                onClick={() =>
                  setPage((p) =>
                    meta?.last_page ? Math.min(meta.last_page, p + 1) : p + 1,
                  )
                }
                disabled={meta?.last_page ? page >= meta.last_page : false}
                className='rounded-2xl px-4 py-2 shadow-sm bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <RecipeFormModal
        open={createOpen}
        mode='create'
        onClose={() => setCreateOpen(false)}
        onSuccess={reload}
      />

      <RecipeFormModal
        open={Boolean(editRecipe)}
        mode='edit'
        recipe={editRecipe}
        onClose={() => setEditRecipe(null)}
        onSuccess={reload}
      />

      <DeleteRecipeModal
        open={Boolean(deleteRecipe)}
        recipe={deleteRecipe}
        onClose={() => setDeleteRecipe(null)}
        onSuccess={reload}
      />
    </>
  );
}