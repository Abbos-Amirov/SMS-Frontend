import type { ReactNode } from 'react';
import { IconInbox } from '../icons/UiIcons';

export function Skeleton({ width, height = 16, radius = 8 }: { width?: number | string; height?: number; radius?: number }) {
  return (
    <span
      className="skeleton"
      style={{ display: 'block', width: width ?? '100%', height, borderRadius: radius }}
    />
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div style={{ padding: '6px 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row" style={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton width="60%" />
        </div>
      ))}
    </div>
  );
}

interface StateBlockProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: StateBlockProps) {
  return (
    <div className="state-block">
      <div className="state-block__icon">{icon ?? <IconInbox />}</div>
      <div className="state-block__title">{title}</div>
      {message && <p style={{ margin: 0, maxWidth: 360 }}>{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message = 'Maʼlumotni yuklab boʻlmadi.', action }: { message?: string; action?: ReactNode }) {
  return (
    <div className="state-block">
      <div className="state-block__icon" style={{ color: 'var(--danger)' }}>!</div>
      <div className="state-block__title">Xatolik</div>
      <p style={{ margin: 0 }}>{message}</p>
      {action}
    </div>
  );
}
