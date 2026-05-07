import type { ContactGroupOption } from '../types';

type ContactGroupToolbarProps = {
  groups: ContactGroupOption[];
  selectedGroupId: string;
  onGroupChange: (id: string) => void;
  onEdit: () => void;
  onRefresh: () => void;
  onDeleteGroup: () => void;
  onExport: () => void;
};

export function ContactGroupToolbar({
  groups,
  selectedGroupId,
  onGroupChange,
  onEdit,
  onRefresh,
  onDeleteGroup,
  onExport,
}: ContactGroupToolbarProps) {
  return (
    <div className="contacts-toolbar-row">
      <select
        className="contacts-select contacts-select--wide"
        value={selectedGroupId}
        onChange={(e) => onGroupChange(e.target.value)}
      >
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.label}
          </option>
        ))}
      </select>
      <div className="contacts-toolbar-actions">
        <button type="button" className="contacts-btn contacts-btn--soft" onClick={onEdit}>
          Tahrirlash
        </button>
        <button type="button" className="contacts-btn contacts-btn--primary contacts-btn--md" onClick={onRefresh}>
          Yangilash
        </button>
        <button type="button" className="contacts-btn contacts-btn--orange" onClick={onDeleteGroup}>
          O‘chirish
        </button>
        <button type="button" className="contacts-btn contacts-btn--green" onClick={onExport}>
          Export
        </button>
      </div>
    </div>
  );
}
