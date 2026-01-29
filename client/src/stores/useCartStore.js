import { create } from 'zustand';

const STORAGE_KEY = 'cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
}

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export const useCartStore = create((set, get) => ({
  // item shape:
  // { product_id, name, price, quantity }
  ...loadCart(),

  // --- selectors/helpers ---
  subtotal: () => {
    const { items } = get();
    return items.reduce((sum, it) => {
      return sum + toNumber(it.price, 0) * toNumber(it.quantity, 0);
    }, 0);
  },

  totalItems: () => {
    const { items } = get();
    return items.reduce((sum, it) => sum + toNumber(it.quantity, 0), 0);
  },

  toOrderPayload: () => {
    const { items } = get();
    return {
      items: items.map((it) => ({
        product_id: it.product_id,
        quantity: Number(toNumber(it.quantity, 0).toFixed(2)),
      })),
    };
  },

  // --- actions ---
  hydrate: () => {
    const { items } = loadCart();
    set({ items });
  },

  clear: () => {
    saveCart([]);
    set({ items: [] });
  },

  removeItem: (product_id) => {
    set((state) => {
      const next = state.items.filter((it) => it.product_id !== product_id);
      saveCart(next);
      return { items: next };
    });
  },

  setQuantity: (product_id, quantity) => {
    const q = toNumber(quantity, 0);
    set((state) => {
      if (q <= 0) {
        const next = state.items.filter((it) => it.product_id !== product_id);
        saveCart(next);
        return { items: next };
      }

      const next = state.items.map((it) =>
        it.product_id === product_id
          ? { ...it, quantity: Number(q.toFixed(2)) }
          : it,
      );

      saveCart(next);
      return { items: next };
    });
  },

  increment: (product_id, step = 1) => {
    const s = toNumber(step, 1);
    const item = get().items.find((it) => it.product_id === product_id);
    const nextQty = (item ? toNumber(item.quantity, 0) : 0) + s;
    get().setQuantity(product_id, nextQty);
  },

  decrement: (product_id, step = 1) => {
    const s = toNumber(step, 1);
    const item = get().items.find((it) => it.product_id === product_id);
    const nextQty = (item ? toNumber(item.quantity, 0) : 0) - s;
    get().setQuantity(product_id, nextQty);
  },

  // dodavanje proizvoda u korpu
  addItem: (product, quantity = 1) => {
    const pid = product?.id ?? product?.product_id;
    if (!pid) return;

    const q = toNumber(quantity, 1);

    set((state) => {
      const existing = state.items.find((it) => it.product_id === pid);

      let next;
      if (existing) {
        next = state.items.map((it) =>
          it.product_id === pid
            ? {
                ...it,
                quantity: Number((toNumber(it.quantity, 0) + q).toFixed(2)),
              }
            : it,
        );
      } else {
        next = [
          ...state.items,
          {
            product_id: pid,
            name: product.name ?? '',
            price: toNumber(product.price, 0),
            quantity: Number(q.toFixed(2)),
          },
        ];
      }

      saveCart(next);
      return { items: next };
    });
  },

  // sync cena/naziv ako se promeni lista proizvoda sa servera
  // pozoveš posle fetchProducts()
  syncFromProducts: (products = []) => {
    const map = new Map(products.map((p) => [p.id, p]));
    set((state) => {
      const next = state.items.map((it) => {
        const p = map.get(it.product_id);
        if (!p) return it;
        return {
          ...it,
          name: p.name ?? it.name,
          price: toNumber(p.price, it.price),
        };
      });
      saveCart(next);
      return { items: next };
    });
  },

  // direktno kreiranje order-a (zove useOrderStore)
  checkout: async (createOrderFn) => {
    const payload = get().toOrderPayload();

    if (!payload.items.length) {
      throw new Error('Cart is empty');
    }

    // createOrderFn treba da bude funkcija koja poziva backend:
    // (payload) => useOrderStore.getState().createOrder(payload)
    const order = await createOrderFn(payload);

    // posle uspeha: očisti korpu
    get().clear();
    return order;
  },
}));