import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * Top-level error boundary so a render error in any page shows a recovery screen
 * instead of a blank white app. Wrap the whole tree in App.tsx.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Hook a real error-tracking service (Sentry) here later.
    console.error('UI crash:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
          <div style={{ maxWidth: 420, textAlign: 'center' }}>
            <h1 style={{ fontSize: 20, marginBottom: 8 }}>Nimadir xato ketdi</h1>
            <p className="muted" style={{ marginBottom: 20 }}>
              Sahifani yuklab bo‘lmadi. Sahifani qayta yuklab ko‘ring.
            </p>
            <button className="btn btn--primary" onClick={() => window.location.reload()}>
              Qayta yuklash
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
