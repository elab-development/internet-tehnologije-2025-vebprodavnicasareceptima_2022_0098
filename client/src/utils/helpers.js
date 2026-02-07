export function classNames(...xs) {
  return xs.filter(Boolean).join(' ');
}

export function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

export function pickFirstError(err) {
  if (!err) return null;

  if (typeof err === 'string') return err;

  if (isObject(err)) {
    if (typeof err.message === 'string') return err.message;

    const firstKey = Object.keys(err)[0];
    if (firstKey) {
      const val = err[firstKey];
      if (Array.isArray(val) && val[0]) return val[0];
      if (typeof val === 'string') return val;
    }
  }

  return 'Something went wrong. Please try again.';
}

export function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function ingredientToCartProduct(ingredient) {
  const p = ingredient?.product;
  return {
    id: p?.id ?? ingredient?.product_id,
    name: p?.name ?? '',
    price: toNumber(p?.price, 0),
  };
}

export function ingredientQuantity(ingredient, fallback = 1) {
  return toNumber(ingredient?.quantity, fallback);
}

export function money(n) {
  const x = Number(n);
  const safe = Number.isFinite(x) ? x : 0;
  return safe.toFixed(2);
}

export function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString();
}

export function statusBadgeClass(status = '') {
  const s = String(status).toLowerCase();
  if (s === 'paid') return 'bg-green-100 text-green-700';
  if (s === 'fulfilled') return 'bg-green-100 text-green-700';
  if (s === 'cancelled') return 'bg-orange-100 text-orange-700';
  if (s === 'pending') return 'bg-orange-100 text-orange-700';
  return 'bg-slate-100 text-slate-700';
}