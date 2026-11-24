import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore.jsx';
import ProductImage from '../components/ProductImage.jsx';
import NotFound from './NotFound.jsx';
import { formatCents } from '../lib/money.js';
import { stockLabel } from '../lib/catalog.js';

export default function Product() {
  const { id } = useParams();
  const { products, add, cart } = useStore();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (!product) return <NotFound />;

  const inCart = cart.find((l) => l.id === id)?.qty ?? 0;
  const room = product.stock - inCart; // how many more can still be added
  const label = stockLabel(product.stock);
  const chosen = Math.min(qty, Math.max(room, 1));

  return (
    <>
      <p className="crumbs"><Link to="/">Shop</Link> / {product.category} / {product.name}</p>
      <div className="detail">
        <ProductImage product={product} large />
        <div>
          <h1>{product.name}</h1>
          <p className="price">{formatCents(product.price)}</p>
          <p><span className={`stock stock-${label.tone}`}>{label.text}</span></p>
          <p>{product.description}</p>
          <ul className="features">{product.features.map((f) => <li key={f}>{f}</li>)}</ul>

          {room > 0 ? (
            <div className="buy">
              <label>Qty
                <select value={chosen} onChange={(e) => setQty(Number(e.target.value))}>
                  {Array.from({ length: Math.min(room, 10) }, (_, i) => <option key={i + 1}>{i + 1}</option>)}
                </select>
              </label>
              <button className="btn" onClick={() => { add(product.id, chosen); setQty(1); setAdded(true); }}>Add to cart</button>
            </div>
          ) : (
            <p className="muted">{product.stock <= 0 ? 'This product is sold out.' : 'You have all available units in your cart.'}</p>
          )}
          {added && <p className="notice" role="status">Added. <Link to="/cart">View cart</Link></p>}
        </div>
      </div>
    </>
  );
}
