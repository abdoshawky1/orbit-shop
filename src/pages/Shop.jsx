import { useSearchParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore.jsx';
import { CATEGORIES } from '../data/products.js';
import { searchProducts } from '../lib/catalog.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Shop() {
  const { products } = useStore();
  // Filters live in the URL so a filtered view can be shared or refreshed.
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const category = CATEGORIES.includes(params.get('category')) ? params.get('category') : 'all';
  const sort = params.get('sort') ?? 'featured';
  const inStockOnly = params.get('instock') === '1';

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    value && value !== 'all' && value !== 'featured' ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  };
  const shown = searchProducts(products, { query, category, sort, inStockOnly });

  return (
    <>
      <section className="hero">
        <h1>Everyday tech and carry</h1>
        <p>Eight products we would actually use. Free shipping over $75.</p>
      </section>

      <div className="toolbar">
        <input type="search" placeholder="Search products" value={query} onChange={(e) => set('q', e.target.value)} aria-label="Search products" />
        <select value={sort} onChange={(e) => set('sort', e.target.value)} aria-label="Sort">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name</option>
        </select>
      </div>
      <div className="chips" role="group" aria-label="Category">
        {['all', ...CATEGORIES].map((c) => (
          <button key={c} className={`chip ${c === category ? 'on' : ''}`} onClick={() => set('category', c)}>{c === 'all' ? 'All' : c}</button>
        ))}
        <label className="check"><input type="checkbox" checked={inStockOnly} onChange={(e) => set('instock', e.target.checked ? '1' : '')} /> In stock only</label>
      </div>

      {shown.length ? (
        <div className="grid">{shown.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <p className="empty">No products match. Try a different search or category.</p>
      )}
    </>
  );
}
