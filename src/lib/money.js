// All money is integer cents. Floats (0.1 + 0.2) are never used for prices.
const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatCents = (cents) => fmt.format(cents / 100);
