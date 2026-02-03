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