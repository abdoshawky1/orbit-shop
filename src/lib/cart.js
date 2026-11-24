// A cart is an array of { id, qty }. Product data (price, stock) is looked up
// at calculation time so the cart can never hold a stale price.

export const FREE_SHIPPING_FROM = 7500; // cents
export const SHIPPING_FEE = 600;
export const TAX_RATE = 0.14; // 14% VAT, applied after discount

export const PROMOS = {
  WELCOME10: { label: '10% off your order', percent: 10 },
  FREESHIP: { label: 'Free shipping', freeShipping: true },
};

export const stockOf = (stock, id) => stock[id] ?? 0;

// Add `qty` of a product, never going above stock. Returns the new cart.
export function addItem(cart, id, qty, stock) {
  const available = stockOf(stock, id);
  const existing = cart.find((l) => l.id === id);
  const wanted = Math.min((existing?.qty ?? 0) + qty, available);
  if (wanted <= 0) return cart;
  if (existing) return cart.map((l) => (l.id === id ? { ...l, qty: wanted } : l));
  return [...cart, { id, qty: wanted }];
}

// Set an exact quantity, clamped to 0..stock. 0 removes the line.
export function setQty(cart, id, qty, stock) {
  const clamped = Math.max(0, Math.min(Math.floor(qty) || 0, stockOf(stock, id)));
  if (clamped === 0) return cart.filter((l) => l.id !== id);
  return cart.map((l) => (l.id === id ? { ...l, qty: clamped } : l));
}

export const removeItem = (cart, id) => cart.filter((l) => l.id !== id);
export const itemCount = (cart) => cart.reduce((n, l) => n + l.qty, 0);

export function lookupPromo(code) {
  return PROMOS[String(code ?? '').trim().toUpperCase()] ?? null;
}

// Drop or reduce lines that exceed current stock (stock can change after a purchase).
export function reconcile(cart, stock) {
  return cart
    .map((l) => ({ ...l, qty: Math.min(l.qty, stockOf(stock, l.id)) }))
    .filter((l) => l.qty > 0);
}

export function totals(cart, products, promoCode) {
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = cart
    .filter((l) => byId.has(l.id))
    .map((l) => ({ ...l, product: byId.get(l.id), lineTotal: byId.get(l.id).price * l.qty }));
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const promo = lookupPromo(promoCode);
  const discount = promo?.percent ? Math.round((subtotal * promo.percent) / 100) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = lines.length === 0 || promo?.freeShipping || afterDiscount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  const tax = Math.round(afterDiscount * TAX_RATE);
  return { lines, subtotal, discount, shipping, tax, total: afterDiscount + shipping + tax, promo };
}

// How much more to spend for free shipping (0 when already free or cart is empty).
export function untilFreeShipping(subtotalAfterDiscount) {
  if (subtotalAfterDiscount <= 0) return 0;
  return Math.max(0, FREE_SHIPPING_FROM - subtotalAfterDiscount);
}

// Take purchased quantities out of stock. Returns new stock, or null if any line is short.
export function applyPurchase(cart, stock) {
  for (const l of cart) if (l.qty > stockOf(stock, l.id)) return null;
  const next = { ...stock };
  for (const l of cart) next[l.id] -= l.qty;
  return next;
}
