import { Link, useParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore.jsx';
import Summary from '../components/Summary.jsx';
import NotFound from './NotFound.jsx';
import { formatCents } from '../lib/money.js';

export default function Confirmation() {
  const { reference } = useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.reference === reference);
  if (!order) return <NotFound />;

  const summary = { ...order, promo: order.promo ? { label: order.promo } : null };
  return (
    <section className="confirm">
      <p className="tick" aria-hidden="true">✓</p>
      <h1>Thank you, {order.customer.name.split(' ')[0]}!</h1>
      <p>Your order <strong>{order.reference}</strong> is placed. Pay {formatCents(order.total)} in cash on delivery.</p>
      <div className="card left">
        <h2>Delivering to</h2>
        <p>{order.customer.name}<br />{order.customer.address}, {order.customer.city}<br />{order.customer.phone}</p>
        <h2>Items</h2>
        <ul className="mini">{order.lines.map((l) => <li key={l.id}><span>{l.qty} × {l.name}</span><span>{formatCents(l.qty * l.price)}</span></li>)}</ul>
        <Summary summary={summary} />
      </div>
      <Link className="btn" to="/">Keep shopping</Link>
    </section>
  );
}
