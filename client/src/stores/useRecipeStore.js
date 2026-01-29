import { create } from 'zustand';
import { apiFetch } from '../lib/api';

export const useRecipeStore = create((set) => ({
  recipes: [],
  meta: null,
  recipe: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchRecipes: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const {
        search = '',
        products_any = '',
        products_all = '',
        products_exclude = '',
        sort = 'name',
        page = 1,
        per_page = 15,
      } = params;

      const qs = new URLSearchParams();
      if (search) qs.set('search', search);
      if (products_any) qs.set('products_any', products_any);
      if (products_all) qs.set('products_all', products_all);
      if (products_exclude) qs.set('products_exclude', products_exclude);
      if (sort) qs.set('sort', sort);
      qs.set('page', String(page));
      qs.set('per_page', String(per_page));

      const data = await apiFetch(`/recipes?${qs.toString()}`);
      set({ recipes: data.recipes, meta: data.meta, loading: false });
      return data;
    } catch (e) {
      set({
        error: e.data || e.message,
        loading: false,
        recipes: [],
        meta: null,
      });
      throw e;
    }
  },

  fetchRecipe: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/recipes/${id}`);
      set({ recipe: data.recipe, loading: false });
      return data.recipe;
    } catch (e) {
      set({ error: e.data || e.message, loading: false, recipe: null });
      throw e;
    }
  },

  createRecipe: async ({ name, description, ingredients }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/recipes', {
        method: 'POST',
        auth: true,
        body: { name, description, ingredients }, // [{product_id, quantity}]
      });
      set((s) => ({ recipes: [data.recipe, ...s.recipes], loading: false }));
      return data.recipe;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  updateRecipe: async (id, patch) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/recipes/${id}`, {
        method: 'PUT',
        auth: true,
        body: patch, // name/description/ingredients
      });
      set((s) => ({
        recipes: s.recipes.map((r) => (r.id === id ? data.recipe : r)),
        recipe: s.recipe?.id === id ? data.recipe : s.recipe,
        loading: false,
      }));
      return data.recipe;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  deleteRecipe: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiFetch(`/recipes/${id}`, { method: 'DELETE', auth: true });
      set((s) => ({
        recipes: s.recipes.filter((r) => r.id !== id),
        recipe: s.recipe?.id === id ? null : s.recipe,
        loading: false,
      }));
      return true;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },
}));