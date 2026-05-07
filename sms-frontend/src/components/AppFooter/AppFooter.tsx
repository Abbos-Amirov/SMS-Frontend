const year = new Date().getFullYear();

export function AppFooter() {
  return (
    <footer className="app-footer">
      <span className="app-footer__copy">
        © {year} NovaSMS. Barcha huquqlar himoyalangan.
      </span>
      <span className="app-footer__ver">Versiya: 3.0</span>
    </footer>
  );
}
