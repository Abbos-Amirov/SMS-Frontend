import { ContactsPanel } from '../../contacts/components/ContactsPanel';

type AddFormValues = {
  triggerMessage: string;
  replyBody: string;
  conditionLabel: string;
};

type ConditionOption = string;

type AutoReplyAddCardProps = {
  form: AddFormValues;
  conditions: ConditionOption[];
  onPatch: (p: Partial<AddFormValues>) => void;
  onSubmit: () => void;
};

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function AutoReplyAddCard({ form, conditions, onPatch, onSubmit }: AutoReplyAddCardProps) {
  return (
    <ContactsPanel title="Avto javob qo‘shish">
      <div className="auto-reply-form-stack">
        <div className="auto-reply-form-field">
          <label className="auto-reply-field-label" htmlFor="auto-reply-trigger">
            Xabar
          </label>
          <input
            id="auto-reply-trigger"
            type="text"
            className="contacts-input contacts-input--search auto-reply-control-full"
            value={form.triggerMessage}
            onChange={(e) => onPatch({ triggerMessage: e.target.value })}
            placeholder="Bir nechta trigger xabarlarni | belgisi bilan ajrating"
          />
        </div>

        <div className="auto-reply-form-field">
          <label className="auto-reply-field-label" htmlFor="auto-reply-body">
            Javob
          </label>
          <textarea
            id="auto-reply-body"
            className="contacts-textarea"
            rows={4}
            value={form.replyBody}
            onChange={(e) => onPatch({ replyBody: e.target.value })}
            placeholder="Excel import asosida mijoz ismi uchun % name % dan foydalanishingiz mumkin"
          />
        </div>

        <div className="auto-reply-form-field">
          <label className="auto-reply-field-label" htmlFor="auto-reply-condition">
            Javob sharti
          </label>
          <select
            id="auto-reply-condition"
            className="contacts-select auto-reply-control-full"
            value={form.conditionLabel}
            onChange={(e) => onPatch({ conditionLabel: e.target.value })}
          >
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="contacts-actions-row contacts-actions-row--start">
        <button type="button" className="contacts-btn contacts-btn--primary contacts-btn--md auto-reply-btn-with-icon" onClick={onSubmit}>
          <IconPlus />
          Avto javob qo‘shish
        </button>
      </div>
    </ContactsPanel>
  );
}
