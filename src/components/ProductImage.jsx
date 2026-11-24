// No photos in the demo: a coloured tile with an emoji keeps the layout honest.
export default function ProductImage({ product, large = false }) {
  return (
    <div className={`pimg ${large ? 'large' : ''}`} style={{ background: `linear-gradient(135deg, hsl(${product.hue} 80% 92%), hsl(${product.hue} 70% 82%))` }} aria-hidden="true">
      <span>{product.icon}</span>
    </div>
  );
}
