function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

type ServersCardToolbarProps = {
  onDelete: () => void;
  onAdd: () => void;
};

export function ServersCardToolbar({ onDelete, onAdd }: ServersCardToolbarProps) {
  return (
    <div className="servers-card-head">
      <h2 className="servers-card-head__title">Serverlar</h2>
      <div className="servers-card-head__actions">
        <button type="button" className="contacts-btn contacts-btn--red contacts-btn--md servers-btn-with-icon" onClick={onDelete}>
          <IconTrash /> O‘chirish
        </button>
        <button
          type="button"
          className="contacts-btn contacts-btn--primary contacts-btn--md"
          onClick={onAdd}
        >
          + Qo‘shish
        </button>
      </div>
    </div>
  );
}
