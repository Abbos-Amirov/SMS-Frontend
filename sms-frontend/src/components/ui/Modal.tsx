import { useEffect, type ReactNode } from 'react';
import { IconX } from '../icons/UiIcons';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}

export function Modal({ open, title, onClose, footer, wide, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className={`modal ${wide ? 'modal--wide' : ''}`} onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <h2 className="modal__title">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Yopish">
            <IconX />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Tasdiqlash',
  danger,
  loading,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{ margin: 0 }}>{message}</p>
    </Modal>
  );
}
