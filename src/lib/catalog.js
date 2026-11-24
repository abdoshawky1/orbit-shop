export function searchProducts(products, { query = '', category = 'all', inStockOnly = false, sort = 'featured' } = {}) {
  const q = query.trim().toLowerCase();
  const out = products.filter((p) => {
    if (category !== 'all' && p.category !== category) return false;
    if (inStockOnly && p.stock <= 0) return false;
    return !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return sorters[sort] ? [...out].sort(sorters[sort]) : out;
}

export function stockLabel(stock) {
  if (stock <= 0) return { text: 'Out of stock', tone: 'out' };
  if (stock <= 5) return { text: `Only ${stock} left`, tone: 'low' };
  return { text: 'In stock', tone: 'ok' };
}
