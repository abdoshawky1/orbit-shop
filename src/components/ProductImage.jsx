// No photos in the demo: a coloured tile with a simple SVG icon per category.
// SVG renders the same everywhere, unlike emoji, which depend on the device's fonts.
const ICONS = {
  Audio: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2.5" y="13" width="5" height="8" rx="2" /><rect x="16.5" y="13" width="5" height="8" rx="2" /></>,
  Carry: <><path d="M8 7V5a4 4 0 0 1 8 0v2" /><rect x="4" y="7" width="16" height="14" rx="4" /><path d="M9 14h6" /></>,
  Desk: <><path d="M8 21h8M12 21v-7" /><path d="M7 4l9 3-3 7-9-3z" /></>,
  Fitness: <><path d="M9 3h6l1 4H8zM9 21h6l1-4H8z" /><rect x="6" y="7" width="12" height="10" rx="3" /><path d="M12 10v2.5l1.5 1" /></>,
};

export default function ProductImage({ product, large = false }) {
  return (
    <div className={`pimg ${large ? 'large' : ''}`} style={{ background: `linear-gradient(135deg, hsl(${product.hue} 80% 92%), hsl(${product.hue} 70% 82%))`, color: `hsl(${product.hue} 45% 28%)` }} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[product.category] ?? ICONS.Carry}
      </svg>
    </div>
  );
}
