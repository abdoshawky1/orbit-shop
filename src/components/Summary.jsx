import { formatCents } from '../lib/money.js';

export default function Summary({ summary }) {
  return (
    <dl className="summary">
      <div><dt>Subtotal</dt><dd>{formatCents(summary.subtotal)}</dd></div>
      {summary.discount > 0 && <div className="green"><dt>Discount ({summary.promo.label})</dt><dd>-{formatCents(summary.discount)}</dd></div>}
      <div><dt>Shipping</dt><dd>{summary.shipping === 0 ? 'Free' : formatCents(summary.shipping)}</dd></div>
      <div><dt>VAT (14%)</dt><dd>{formatCents(summary.tax)}</dd></div>
      <div className="grand"><dt>Total</dt><dd>{formatCents(summary.total)}</dd></div>
    </dl>
  );
}
