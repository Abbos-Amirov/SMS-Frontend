import type { ReactNode } from 'react';

type ContactsPanelProps = {
  title?: ReactNode;
  /** Sarlavha qatorida oʻng tomonda (masalan, O‘chirish). */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Orta blok: sarlavhasiz panel */
  noHeader?: boolean;
};

/**
 * Rasmdagi bloklar: tepada accent chiziq, ichki kontent.
 */
export function ContactsPanel({ title, actions, children, className, noHeader }: ContactsPanelProps) {
  const rootClass = `contacts-panel${className ? ` ${className}` : ''}`;
  const headClass = `contacts-panel__head${actions ? ' contacts-panel__head--split' : ''}`;
  return (
    <section className={rootClass}>
      {!noHeader && (
        <header className={headClass}>
          <h2 className="contacts-panel__title">{title}</h2>
          {actions ? <div className="contacts-panel__actions">{actions}</div> : null}
        </header>
      )}
      <div className={`contacts-panel__body${noHeader ? ' contacts-panel__body--flush-top' : ''}`}>{children}</div>
    </section>
  );
}
