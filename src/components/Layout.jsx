import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../hooks/useStore.jsx';

export default function Layout() {
  const { count, resetDemo } = useStore();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand"><span className="brand-mark">O</span> Orbit Shop</Link>
          <nav>
            <NavLink to="/" end>Shop</NavLink>
            <NavLink to="/cart" className="cart-link">Cart{count > 0 && <span className="cart-count" aria-label={`${count} items`}>{count}</span>}</NavLink>
          </nav>
        </div>
      </header>
      <main className="container"><Outlet /></main>
      <footer className="site-footer">
        <div className="container">
          <p>Orbit Shop is a demo store: no real products, payments or deliveries. Cart and orders are saved in your browser only.</p>
          <button className="link-btn" onClick={() => window.confirm('Clear the cart, orders and stock changes?') && resetDemo()}>Reset demo data</button>
        </div>
      </footer>
    </>
  );
}
