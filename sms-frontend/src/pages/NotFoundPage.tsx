import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>404</div>
        <p className="muted" style={{ margin: '12px 0 20px' }}>
          Sahifa topilmadi.
        </p>
        <Link className="btn btn--primary" to="/">
          Boshqaruv paneliga qaytish
        </Link>
      </div>
    </div>
  );
}
