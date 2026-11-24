import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="empty-cart">
      <h1>Page not found</h1>
      <p className="muted">That page or product does not exist.</p>
      <Link className="btn" to="/">Back to the shop</Link>
    </section>
  );
}
