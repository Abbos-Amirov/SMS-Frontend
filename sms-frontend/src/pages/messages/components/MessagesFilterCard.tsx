import type { MessageSearchForm } from '../types';
import { ContactsPanel } from '../../contacts/components/ContactsPanel';

function IconServer() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l6.59-6.59a1 1 0 0 0 0-1.41L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

function IconList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

function IconMobile() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}

function IconCal() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconExport() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 3v12M8 11l4 4 4-4M4 21h16" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

type MessagesFilterCardProps = {
  form: MessageSearchForm;
  patchForm: (patch: Partial<MessageSearchForm>) => void;
  pageSelect: number;
  onPageSelectChange: (n: number) => void;
  onSearch: () => void;
  onExport: () => void;
  onResend: () => void;
  onDelete: () => void;
};

const SERVER_OPTS = ['Barchasi', 'Galaxy S5 [108]', 'Gateway-UZ [12]'];
const STATUS_OPTS = ['Barchasi', 'Yuborilmadi', 'Yetkazilgan', 'Navbatda', 'Xato'];
const TYPE_OPTS = ['All', 'Marketing', 'Transactional', 'OTP'];

export function MessagesFilterCard({
  form,
  patchForm,
  pageSelect,
  onPageSelectChange,
  onSearch,
  onExport,
  onResend,
  onDelete,
}: MessagesFilterCardProps) {
  return (
    <ContactsPanel title="Xabarlarni izlash va filterlash">
      <div className="messages-filter-rows">
        <div className="messages-filter-row messages-filter-row--3">
          <label className="messages-field messages-field--icon">
            <span className="messages-field__icon">
              <IconServer />
            </span>
            <span className="messages-field__main">
              <span className="messages-field__label">Serverni tanlang</span>
              <select className="messages-select-full" value={form.server} onChange={(e) => patchForm({ server: e.target.value })}>
                {SERVER_OPTS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <label className="messages-field messages-field--icon">
            <span className="messages-field__icon">
              <IconTag />
            </span>
            <span className="messages-field__main">
              <span className="messages-field__label">Status</span>
              <select className="messages-select-full" value={form.status} onChange={(e) => patchForm({ status: e.target.value })}>
                {STATUS_OPTS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <div className="messages-type-limit-cell">
            <label className="messages-field messages-field--icon messages-field--grow">
              <span className="messages-field__icon">
                <IconList />
              </span>
              <span className="messages-field__main">
                <span className="messages-field__label">Turi</span>
                <select className="messages-select-full" value={form.type} onChange={(e) => patchForm({ type: e.target.value })}>
                  {TYPE_OPTS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <label className="messages-rowlimit-box">
              <span className="visually-hidden">Limit</span>
              <input
                type="number"
                min={10}
                max={500}
                step={10}
                className="messages-rowlimit-input"
                value={form.rowLimit}
                onChange={(e) => patchForm({ rowLimit: Number(e.target.value) || 50 })}
              />
            </label>
          </div>
        </div>

        <div className="messages-filter-row messages-filter-row--4">
          <label className="messages-field messages-field--icon">
            <span className="messages-field__icon">
              <IconMobile />
            </span>
            <span className="messages-field__main">
              <span className="messages-field__label">Mobil Raqam</span>
              <input
                type="text"
                className="messages-input-full"
                value={form.mobile}
                onChange={(e) => patchForm({ mobile: e.target.value })}
                placeholder="+998 ..."
              />
            </span>
          </label>

          <label className="messages-field messages-field--icon">
            <span className="messages-field__icon">
              <IconChat />
            </span>
            <span className="messages-field__main">
              <span className="messages-field__label">Xabar</span>
              <input
                type="text"
                className="messages-input-full"
                value={form.messageText}
                onChange={(e) => patchForm({ messageText: e.target.value })}
                placeholder="Matn bo‘yicha qidiruv"
              />
            </span>
          </label>

          <label className="messages-field messages-field--icon">
            <span className="messages-field__icon">
              <IconCal />
            </span>
            <span className="messages-field__main">
              <span className="messages-field__label">Shu kundan</span>
              <input
                type="date"
                className="messages-input-full"
                value={form.dateFrom}
                onChange={(e) => patchForm({ dateFrom: e.target.value })}
              />
            </span>
          </label>

          <label className="messages-field messages-field--icon">
            <span className="messages-field__icon">
              <IconCal />
            </span>
            <span className="messages-field__main">
              <span className="messages-field__label">Shu kungacha</span>
              <input
                type="date"
                className="messages-input-full"
                value={form.dateUntil}
                onChange={(e) => patchForm({ dateUntil: e.target.value })}
              />
            </span>
          </label>
        </div>
      </div>

      <div className="messages-filter-footer">
        <div className="messages-filter-buttons">
          <button type="button" className="contacts-btn contacts-btn--primary contacts-btn--md messages-btn-icon" onClick={onSearch}>
            <IconSearch /> Izlash
          </button>
          <button type="button" className="contacts-btn contacts-btn--green contacts-btn--md messages-btn-icon" onClick={onExport}>
            <IconExport /> Export
          </button>
          <button type="button" className="contacts-btn contacts-btn--soft-strong contacts-btn--md messages-btn-icon" onClick={onResend}>
            <IconSend /> Qayta yuborish
          </button>
          <button type="button" className="contacts-btn contacts-btn--orange contacts-btn--md messages-btn-icon" onClick={onDelete}>
            <IconX /> O‘chirish
          </button>
        </div>
        <select
          className="contacts-select messages-page-mini-select"
          value={pageSelect}
          onChange={(e) => onPageSelectChange(Number(e.target.value))}
          aria-label="Sahifa"
        >
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </ContactsPanel>
  );
}
