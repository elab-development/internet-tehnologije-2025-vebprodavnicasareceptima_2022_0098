import { create } from 'zustand';
import { apiFetch } from '../lib/api';

export const useOrderStore = create((set) => ({
  orders: [],
  order: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/orders', { auth: true });
      set({ orders: data.orders, loading: false });
      return data.orders;
    } catch (e) {
      set({ error: e.data || e.message, loading: false, orders: [] });
      throw e;
    }
  },

  fetchOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/orders/${id}`, { auth: true });
      set({ order: data.order, loading: false });
      return data.order;
    } catch (e) {
      set({ error: e.data || e.message, loading: false, order: null });
      throw e;
    }
  },

  fetchOrdersForUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/users/${userId}/orders`, { auth: true });
      set({ orders: data.orders, loading: false });
      return data;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  createOrder: async ({ items }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/orders', {
        method: 'POST',
        auth: true,
        body: { items }, // [{product_id, quantity}]
      });
      set((s) => ({ orders: [data.order, ...s.orders], loading: false }));
      return data.order;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  createOrderFromRecipes: async ({
    recipe_ids,
    include_product_ids,
    exclude_product_ids,
  }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/orders/from-recipes', {
        method: 'POST',
        auth: true,
        body: { recipe_ids, include_product_ids, exclude_product_ids },
      });
      set((s) => ({ orders: [data.order, ...s.orders], loading: false }));
      return data.order;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch(`/orders/${orderId}`, {
        method: 'PUT',
        auth: true,
        body: { status },
      });
      set((s) => ({
        orders: s.orders.map((o) => (o.id === orderId ? data.order : o)),
        order: s.order?.id === orderId ? data.order : s.order,
        loading: false,
      }));
      return data.order;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },
}));