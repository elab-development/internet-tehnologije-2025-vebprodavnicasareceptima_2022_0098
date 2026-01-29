import { create } from 'zustand';
import { apiFetch } from '../lib/api';

export const useIngredientStore = create((set) => ({
  ingredients: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchForRecipe: async (recipeId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/recipes/${recipeId}/ingredients`);
      set({ ingredients: data.ingredients, loading: false });
      return data.ingredients;
    } catch (e) {
      set({ error: e.data || e.message, loading: false, ingredients: [] });
      throw e;
    }
  },

  addToRecipe: async (recipeId, { product_id, quantity }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/recipes/${recipeId}/ingredients`, {
        method: 'POST',
        auth: true,
        body: { product_id, quantity },
      });
      set((s) => ({
        ingredients: [...s.ingredients, data.ingredient],
        loading: false,
      }));
      return data.ingredient;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  updateIngredient: async (ingredientId, patch) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/ingredients/${ingredientId}`, {
        method: 'PUT',
        auth: true,
        body: patch, // product_id?, quantity?
      });
      set((s) => ({
        ingredients: s.ingredients.map((i) =>
          i.id === ingredientId ? data.ingredient : i,
        ),
        loading: false,
      }));
      return data.ingredient;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  deleteIngredient: async (ingredientId) => {
    set({ loading: true, error: null });
    try {
      await apiFetch(`/ingredients/${ingredientId}`, {
        method: 'DELETE',
        auth: true,
      });
      set((s) => ({
        ingredients: s.ingredients.filter((i) => i.id !== ingredientId),
        loading: false,
      }));
      return true;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },
}));