import { useEffect } from 'react';
import { dismissToast } from '../../features/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { IconX } from '../icons/UiIcons';

function ToastItem({ id, kind, message }: { id: string; kind: string; message: string }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissToast(id)), 4500);
    return () => clearTimeout(t);
  }, [id, dispatch]);

  return (
    <div className={`toast toast--${kind}`}>
      <span className="toast__bar" aria-hidden />
      <span className="toast__msg">{message}</span>
      <button className="icon-btn" onClick={() => dispatch(dismissToast(id))} aria-label="Yopish">
        <IconX />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  if (!toasts.length) return null;
  return (
    <div className="toaster">
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} kind={t.kind} message={t.message} />
      ))}
    </div>
  );
}
