type ContactsBulkActionsProps = {
  onDelete: () => void;
  onMove: () => void;
  onChangeStatus: () => void;
  onAddContact: () => void;
  onImport: () => void;
};

export function ContactsBulkActions({
  onDelete,
  onMove,
  onChangeStatus,
  onAddContact,
  onImport,
}: ContactsBulkActionsProps) {
  return (
    <div className="contacts-bulk-row">
      <button type="button" className="contacts-btn contacts-btn--red" onClick={onDelete}>
        O‘chirish
      </button>
      <button type="button" className="contacts-btn contacts-btn--blue-flat" onClick={onMove}>
        Move
      </button>
      <button type="button" className="contacts-btn contacts-btn--yellow" onClick={onChangeStatus}>
        Statusini almashtirish
      </button>
      <button type="button" className="contacts-btn contacts-btn--soft-strong" onClick={onAddContact}>
        + Kontakt qo‘shish
      </button>
      <button type="button" className="contacts-btn contacts-btn--green" onClick={onImport}>
        Import
      </button>
    </div>
  );
}
