import test from 'node:test';
import assert from 'node:assert/strict';
import { addItem, setQty, removeItem, itemCount, totals, reconcile, applyPurchase, untilFreeShipping, lookupPromo } from './cart.js';
import { products, stock } from './fixtures.js';

test('addItem adds a new line and merges repeated adds', () => {
  let cart = addItem([], 'a', 1, stock);
  cart = addItem(cart, 'a', 2, stock);
  assert.deepEqual(cart, [{ id: 'a', qty: 3 }]);
});

test('addItem never goes above stock', () => {
  const cart = addItem([{ id: 'b', qty: 1 }], 'b', 5, stock);
  assert.equal(cart[0].qty, 2);
});

test('addItem ignores out-of-stock and unknown products', () => {
  assert.deepEqual(addItem([], 'c', 1, stock), []);
  assert.deepEqual(addItem([], 'zzz', 1, stock), []);
});

test('setQty clamps to stock, removes at zero, handles junk input', () => {
  const cart = [{ id: 'a', qty: 1 }];
  assert.equal(setQty(cart, 'a', 99, stock)[0].qty, 5);
  assert.deepEqual(setQty(cart, 'a', 0, stock), []);
  assert.deepEqual(setQty(cart, 'a', -3, stock), []);
  assert.deepEqual(setQty(cart, 'a', NaN, stock), []);
  assert.equal(setQty(cart, 'a', 2.9, stock)[0].qty, 2);
});

test('removeItem and itemCount', () => {
  const cart = [{ id: 'a', qty: 2 }, { id: 'b', qty: 1 }];
  assert.equal(itemCount(cart), 3);
  assert.deepEqual(removeItem(cart, 'a'), [{ id: 'b', qty: 1 }]);
});

test('totals: shipping fee under the free-shipping line, VAT on the total', () => {
  const t = totals([{ id: 'b', qty: 1 }], products, '');
  assert.equal(t.subtotal, 2500);
  assert.equal(t.shipping, 600);
  assert.equal(t.tax, 350); // 14% of 2500
  assert.equal(t.total, 2500 + 600 + 350);
});

test('totals: free shipping at 75.00 and above', () => {
  const t = totals([{ id: 'a', qty: 1 }], products, '');
  assert.equal(t.shipping, 0);
  assert.equal(t.total, 10000 + 1400);
});

test('totals: 10% promo is applied before tax and can unlock free shipping check', () => {
  const t = totals([{ id: 'a', qty: 1 }], products, 'welcome10 ');
  assert.equal(t.discount, 1000);
  assert.equal(t.tax, 1260); // 14% of 9000
  assert.equal(t.total, 9000 + 1260);
  const small = totals([{ id: 'a', qty: 1 }, ], products, 'WELCOME10');
  assert.equal(small.shipping, 0); // 90.00 after discount is still over 75.00
});

test('totals: FREESHIP removes the shipping fee', () => {
  assert.equal(totals([{ id: 'b', qty: 1 }], products, 'FREESHIP').shipping, 0);
});

test('totals: unknown promo does nothing, empty cart is all zeros', () => {
  assert.equal(totals([{ id: 'b', qty: 1 }], products, 'NOPE').discount, 0);
  const e = totals([], products, 'WELCOME10');
  assert.deepEqual([e.subtotal, e.shipping, e.tax, e.total], [0, 0, 0, 0]);
});

test('totals are whole cents', () => {
  const t = totals([{ id: 'c', qty: 3 }], products, 'WELCOME10');
  for (const v of [t.subtotal, t.discount, t.shipping, t.tax, t.total]) assert.ok(Number.isInteger(v));
});

test('untilFreeShipping', () => {
  assert.equal(untilFreeShipping(2500), 5000);
  assert.equal(untilFreeShipping(8000), 0);
  assert.equal(untilFreeShipping(0), 0);
});

test('reconcile trims lines to current stock', () => {
  const cart = [{ id: 'a', qty: 9 }, { id: 'c', qty: 1 }];
  assert.deepEqual(reconcile(cart, stock), [{ id: 'a', qty: 5 }]);
});

test('applyPurchase reduces stock, or refuses when short', () => {
  assert.deepEqual(applyPurchase([{ id: 'a', qty: 2 }], stock), { a: 3, b: 2, c: 0 });
  assert.equal(applyPurchase([{ id: 'b', qty: 3 }], stock), null);
  assert.equal(stock.a, 5); // original not mutated
});

test('lookupPromo is case-insensitive', () => {
  assert.ok(lookupPromo('freeship'));
  assert.equal(lookupPromo(''), null);
});
