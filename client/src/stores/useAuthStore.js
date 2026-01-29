import { create } from 'zustand';
import { apiFetch, setToken, getToken } from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: getToken(),
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  register: async ({ name, email, password }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/register', {
        method: 'POST',
        body: { name, email, password },
      });

      setToken(data.access_token);
      set({ token: data.access_token, user: data.data, loading: false });
      return data;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: { email, password },
      });

      setToken(data.access_token);
      set({ token: data.access_token, loading: false });

      // odmah povuci user
      await get().me();
      return data;
    } catch (e) {
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  me: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/me', { auth: true });
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      // ako token ne važi, očisti
      if (e.status === 401) {
        setToken(null);
        set({ token: null, user: null });
      }
      set({ error: e.data || e.message, loading: false });
      throw e;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await apiFetch('/logout', { method: 'POST', auth: true });
    } finally {
      setToken(null);
      set({ token: null, user: null, loading: false });
    }
  },
}));