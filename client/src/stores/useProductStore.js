import { create } from 'zustand';
import { apiFetch } from '../lib/api';

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchProducts: async ({ search = '' } = {}) => {
    set({ loading: true, error: null });
    try {
      const qs = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await apiFetch(`/products${qs}`);
      set({ products: data.products, loading: false });
      return data.products;
    } catch (e) {
      set({ error: e.data || e.message, loading: false, products: [] });
      throw e;
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/products/${id}`);
      set({ product: data.product, loading: false });
      return data.product;
    } catch (e) {
      set({ error: e.data || e.message, loading: false, product: null });
      throw e;
    }
  },

  createProduct: async ({ name, description, price }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/products', {
        method: 'POST',
        auth: true,
        body: { name, description, price },
      });
      set((s) => ({ products: [data.product, ...s.products], loading: false }));
      return data.product;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  updateProduct: async (id, patch) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/products/${id}`, {
        method: 'PUT',
        auth: true,
        body: patch,
      });
      set((s) => ({
        products: s.products.map((p) => (p.id === id ? data.product : p)),
        product: s.product?.id === id ? data.product : s.product,
        loading: false,
      }));
      return data.product;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE', auth: true });
      set((s) => ({
        products: s.products.filter((p) => p.id !== id),
        product: s.product?.id === id ? null : s.product,
        loading: false,
      }));
      return true;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },
}));