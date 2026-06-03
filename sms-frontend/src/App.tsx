import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeSync } from './components/ThemeSync/ThemeSync';
import { Toaster } from './components/ui/Toaster';
import { AppRouter } from './routes/AppRouter';
import './styles/main.css';

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeSync />
        <BrowserRouter>
          <AppRouter />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}
