import { ContactsPanel } from './ContactsPanel';

type ContactGroupCreateCardProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export function ContactGroupCreateCard({ value, onChange, onSubmit }: ContactGroupCreateCardProps) {
  return (
    <ContactsPanel
      title="Kontaktlar guruhi (Misol: Yangi mijozlar, Doimiy mijozlar...)"
      className="contacts-panel--compact-title"
    >
      <label className="contacts-field-row">
        <span className="contacts-input-icon-wrap" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
          </svg>
        </span>
        <input
          type="text"
          className="contacts-input contacts-input--with-icon"
          placeholder="Guruh nomini kiriting"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      <div className="contacts-actions-row contacts-actions-row--start">
        <button type="button" className="contacts-btn contacts-btn--primary contacts-btn--md" onClick={onSubmit}>
          Yaratish
        </button>
      </div>
    </ContactsPanel>
  );
}
