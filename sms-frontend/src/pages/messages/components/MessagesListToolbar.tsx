type MessagesListToolbarProps = {
  selectAll: boolean;
  onSelectAllChange: (v: boolean) => void;
  onRefresh: () => void;
};

function IconRefresh() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12a9 9 0 0 1-15 6.708L3 21M21 5v6h-6M3 12a9 9 0 0 1 15-6.708L21 3M3 19v-6h6" />
    </svg>
  );
}

export function MessagesListToolbar({ selectAll, onSelectAllChange, onRefresh }: MessagesListToolbarProps) {
  return (
    <div className="messages-list-toolbar">
      <button type="button" className="messages-refresh-btn" onClick={onRefresh} aria-label="Yangilash" title="Yangilash">
        <IconRefresh />
      </button>
      <label className="messages-select-all">
        <input type="checkbox" checked={selectAll} onChange={(e) => onSelectAllChange(e.target.checked)} />
        <span>Barchasini belgilash</span>
      </label>
    </div>
  );
}
