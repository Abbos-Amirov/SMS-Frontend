import { useEffect } from 'react';
import { useAppSelector } from '../../store';

/** `data-theme` ni Redux bilan sinxronlashtiradi (toggle va boshqa oynalar uchun). */
export function ThemeSync() {
  const mode = useAppSelector((s) => s.theme.mode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  return null;
}
