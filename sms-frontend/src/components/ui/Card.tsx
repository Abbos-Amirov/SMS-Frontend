import type { ReactNode } from 'react';

interface CardProps {
  title?: ReactNode;
  actions?: ReactNode;
  bodyless?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({ title, actions, bodyless, className = '', children }: CardProps) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <header className="card__head">
          {title ? <h3 className="card__title">{title}</h3> : <span />}
          {actions}
        </header>
      )}
      {bodyless ? children : <div className="card__body">{children}</div>}
    </section>
  );
}
