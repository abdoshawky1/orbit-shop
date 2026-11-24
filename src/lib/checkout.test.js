import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone, validateCheckout, orderReference } from './checkout.js';

test('phone formats normalise to 01XXXXXXXXX', () => {
  for (const p of ['01012345678', '010 1234 5678', '+20 10 1234 5678', '0020 10-1234-5678']) assert.equal(normalizePhone(p), '01012345678');
});
test('bad phones are rejected', () => {
  for (const p of ['', '12345', '01312345678', '0101234567', 'abc']) assert.equal(normalizePhone(p), null);
});
const good = { name: 'Omar Hassan', email: 'omar@example.com', phone: '01012345678', address: '12 Nile St', city: 'Cairo' };
test('valid form has no errors', () => assert.deepEqual(validateCheckout(good), {}));
test('each invalid field is reported', () => {
  const e = validateCheckout({ name: '', email: 'x', phone: '1', address: '', city: ' ' });
  assert.deepEqual(Object.keys(e).sort(), ['address', 'city', 'email', 'name', 'phone']);
});
test('order reference has a fixed shape and avoids look-alike characters', () => {
  for (let i = 0; i < 50; i++) assert.match(orderReference(), /^OS-[A-HJKMNP-TV-Z2-9]{6}$/);
});
