import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore.jsx';
import ProductImage from '../components/ProductImage.jsx';
import Summary from '../components/Summary.jsx';
import { formatCents } from '../lib/money.js';
import { lookupPromo, untilFreeShipping } from '../lib/cart.js';

export default function Cart() {
  const { summary, setQty, remove, promo, setPromo } = useStore();
  const [code, setCode] = useState(promo);
  const [msg, setMsg] = useState('');

  if (!summary.lines.length) {
    return (
      <section className="empty-cart">
        <h1>Your cart is empty</h1>
        <p className="muted">Add something you like and it will show up here.</p>
        <Link className="btn" to="/">Browse the shop</Link>
      </section>
    );
  }

  const applyCode = (e) => {
    e.preventDefault();
    if (!code.trim()) { setPromo(''); setMsg(''); return; }
    if (lookupPromo(code)) { setPromo(code); setMsg(''); } else { setMsg('That code is not valid.'); }
  };
  const away = untilFreeShipping(summary.subtotal - summary.discount);

  return (
    <>
      <h1 className="page-title">Your cart</h1>
      <div className="cart-layout">
        <ul className="lines">
          {summary.lines.map(({ product, qty, lineTotal }) => (
            <li key={product.id} className="line">
              <ProductImage product={product} />
              <div className="line-info">
                <Link to={`/product/${product.id}`}>{product.name}</Link>
                <span className="muted small">{formatCents(product.price)} each</span>
                <button className="link-btn" onClick={() => remove(product.id)}>Remove</button>
              </div>
              <div className="stepper" role="group" aria-label={`Quantity of ${product.name}`}>
                <button onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(product.id, qty + 1)} disabled={qty >= product.stock} aria-label="Increase">+</button>
              </div>
              <strong className="line-total">{formatCents(lineTotal)}</strong>
            </li>
          ))}
        </ul>

        <aside className="card">
          <h2>Order summary</h2>
          {away > 0 && <p className="notice">Add {formatCents(away)} more for free shipping.</p>}
          <form className="promo" onSubmit={applyCode}>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" aria-label="Promo code" />
            <button className="btn btn-outline" type="submit">Apply</button>
          </form>
          {msg && <p className="error" role="alert">{msg}</p>}
          {summary.promo && <p className="green small">Code applied: {summary.promo.label}.</p>}
          {!summary.promo && <p className="muted small">Try WELCOME10 or FREESHIP.</p>}
          <Summary summary={summary} />
          <Link className="btn btn-block" to="/checkout">Checkout</Link>
        </aside>
      </div>
    </>
  );
}
