import test from 'node:test';
import assert from 'node:assert/strict';
import { searchProducts, stockLabel } from './catalog.js';
import { products } from './fixtures.js';

test('search by name or description, case-insensitive', () => {
  assert.deepEqual(searchProducts(products, { query: 'ALPHA' }).map((p) => p.id), ['a']);
  assert.deepEqual(searchProducts(products, { query: 'cold' }).map((p) => p.id), ['b']);
});
test('category and in-stock filters', () => {
  assert.deepEqual(searchProducts(products, { category: 'Desk' }).map((p) => p.id), ['c']);
  assert.equal(searchProducts(products, { inStockOnly: true }).length, 2);
});
test('sorting does not mutate the input', () => {
  const copy = [...products];
  assert.deepEqual(searchProducts(products, { sort: 'price-asc' }).map((p) => p.id), ['c', 'b', 'a']);
  assert.deepEqual(searchProducts(products, { sort: 'price-desc' }).map((p) => p.id), ['a', 'b', 'c']);
  assert.deepEqual(products, copy);
});
test('stock labels', () => {
  assert.equal(stockLabel(0).tone, 'out');
  assert.equal(stockLabel(3).text, 'Only 3 left');
  assert.equal(stockLabel(20).tone, 'ok');
});
