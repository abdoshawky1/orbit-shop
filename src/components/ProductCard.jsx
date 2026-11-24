import { Link } from 'react-router-dom';
import ProductImage from './ProductImage.jsx';
import { formatCents } from '../lib/money.js';
import { stockLabel } from '../lib/catalog.js';
import { useStore } from '../hooks/useStore.jsx';

export default function ProductCard({ product }) {
  const { add, cart } = useStore();
  const label = stockLabel(product.stock);
  const inCart = cart.find((l) => l.id === product.id)?.qty ?? 0;
  const maxed = inCart >= product.stock;
  return (
    <article className="pcard">
      <Link to={`/product/${product.id}`} className="pcard-link">
        <ProductImage product={product} />
        <h3>{product.name}</h3>
      </Link>
      <p className="muted small">{product.category}</p>
      <div className="pcard-row">
        <strong>{formatCents(product.price)}</strong>
        <span className={`stock stock-${label.tone}`}>{label.text}</span>
      </div>
      <button className="btn btn-block" disabled={maxed} onClick={() => add(product.id)}>
        {product.stock <= 0 ? 'Sold out' : maxed ? 'All in cart' : 'Add to cart'}
      </button>
    </article>
  );
}
