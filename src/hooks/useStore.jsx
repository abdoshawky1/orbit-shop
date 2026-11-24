import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products.js';
import { addItem, applyPurchase, itemCount, reconcile, removeItem, setQty, totals } from '../lib/cart.js';

const KEY = 'orbit-shop-v1';
const Ctx = createContext(null);
const initialStock = () => Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]));

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && Array.isArray(s.cart) && s.stock && Array.isArray(s.orders)) return s;
  } catch {
    // corrupted storage: start fresh
  }
  return { cart: [], stock: initialStock(), orders: [], promo: '' };
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => {
    const s = load();
    return { ...s, promo: s.promo ?? '', cart: reconcile(s.cart, s.stock) };
  });
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    // Products with live stock, so every page shows the same numbers.
    const products = PRODUCTS.map((p) => ({ ...p, stock: state.stock[p.id] ?? 0 }));
    return {
      products,
      cart: state.cart,
      promo: state.promo,
      orders: state.orders,
      count: itemCount(state.cart),
      summary: totals(state.cart, products, state.promo),
      add: (id, qty = 1) => setState((s) => ({ ...s, cart: addItem(s.cart, id, qty, s.stock) })),
      setQty: (id, qty) => setState((s) => ({ ...s, cart: setQty(s.cart, id, qty, s.stock) })),
      remove: (id) => setState((s) => ({ ...s, cart: removeItem(s.cart, id) })),
      setPromo: (promo) => setState((s) => ({ ...s, promo })),
      // Returns the placed order, or null if stock changed under us.
      placeOrder: (customer, reference) => {
        const prods = PRODUCTS.map((p) => ({ ...p, stock: state.stock[p.id] ?? 0 }));
        const nextStock = applyPurchase(state.cart, state.stock);
        if (!nextStock) return null;
        const summary = totals(state.cart, prods, state.promo);
        const order = {
          reference, customer, placedAt: new Date().toISOString(), promo: summary.promo ? state.promo.trim().toUpperCase() : null,
          lines: summary.lines.map((l) => ({ id: l.id, name: l.product.name, price: l.product.price, qty: l.qty })),
          subtotal: summary.subtotal, discount: summary.discount, shipping: summary.shipping, tax: summary.tax, total: summary.total,
        };
        setState((s) => ({ ...s, cart: [], promo: '', stock: nextStock, orders: [order, ...s.orders] }));
        return order;
      },
      resetDemo: () => setState({ cart: [], stock: initialStock(), orders: [], promo: '' }),
    };
  }, [state]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
