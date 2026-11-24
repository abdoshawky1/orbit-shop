import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore.jsx';
import Summary from '../components/Summary.jsx';
import { normalizePhone, orderReference, validateCheckout } from '../lib/checkout.js';

const FIELDS = [
  ['name', 'Full name', 'text', 'name'],
  ['email', 'Email', 'email', 'email'],
  ['phone', 'Mobile number', 'tel', 'tel'],
  ['address', 'Street address', 'text', 'street-address'],
  ['city', 'City', 'text', 'address-level2'],
];

export default function Checkout() {
  const { summary, placeOrder } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '' });
  const [errors, setErrors] = useState({});
  const [stockError, setStockError] = useState(false);
  // Placing an order empties the cart. Without this flag the empty-cart redirect
  // below would fire before the move to the confirmation page.
  const placed = useRef(false);

  if (!summary.lines.length && !placed.current) return <Navigate to="/cart" replace />;

  const submit = (e) => {
    e.preventDefault();
    const found = validateCheckout(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`f-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    const order = placeOrder({ ...form, phone: normalizePhone(form.phone) }, orderReference());
    if (!order) { setStockError(true); return; }
    placed.current = true;
    navigate(`/order/${order.reference}`);
  };

  return (
    <>
      <h1 className="page-title">Checkout</h1>
      <div className="cart-layout">
        <form className="card form" onSubmit={submit} noValidate>
          <h2>Delivery details</h2>
          {FIELDS.map(([key, label, type, auto]) => (
            <label key={key}>{label}
              <input id={`f-${key}`} type={type} autoComplete={auto} value={form[key]} aria-invalid={Boolean(errors[key])}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              {errors[key] && <span className="error" role="alert">{errors[key]}</span>}
            </label>
          ))}
          <h2>Payment</h2>
          <p className="pay"><strong>Cash on delivery.</strong> Pay the courier when your order arrives. This demo never asks for card details.</p>
          {stockError && <p className="error" role="alert">Some items just sold out. <Link to="/cart">Review your cart</Link>.</p>}
          <button className="btn btn-block" type="submit">Place order</button>
        </form>
        <aside className="card">
          <h2>Your order</h2>
          <ul className="mini">
            {summary.lines.map((l) => <li key={l.id}><span>{l.qty} × {l.product.name}</span></li>)}
          </ul>
          <Summary summary={summary} />
          <Link to="/cart" className="small">Edit cart</Link>
        </aside>
      </div>
    </>
  );
}
