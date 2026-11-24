// Egyptian mobile numbers: 010/011/012/015 + 8 digits, also +20 or 0020 prefixed.
export function normalizePhone(input) {
  let s = String(input ?? '').replace(/[\s\-()]/g, '');
  if (s.startsWith('+20')) s = '0' + s.slice(3);
  else if (s.startsWith('0020')) s = '0' + s.slice(4);
  return /^01[0125]\d{8}$/.test(s) ? s : null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns an object of field -> message. Empty object means valid.
export function validateCheckout(f) {
  const errors = {};
  if (!f.name?.trim() || f.name.trim().length < 2) errors.name = 'Enter your full name.';
  if (!EMAIL.test(f.email?.trim() ?? '')) errors.email = 'Enter a valid email address.';
  if (!normalizePhone(f.phone)) errors.phone = 'Enter an Egyptian mobile number, like 010 1234 5678.';
  if (!f.address?.trim() || f.address.trim().length < 6) errors.address = 'Enter your street address.';
  if (!f.city?.trim()) errors.city = 'Enter your city.';
  return errors;
}

const ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789'; // no 0/O/1/I/L
export function orderReference(rand = Math.random) {
  let s = '';
  for (let i = 0; i < 6; i++) s += ALPHABET[Math.floor(rand() * ALPHABET.length)];
  return `OS-${s}`;
}
