import type { ContactRecord } from '../types';

type ContactsDataTableProps = {
  rows: ContactRecord[];
  selectedIds: Set<string>;
  onToggleAll: () => void;
  onToggleRow: (id: string) => void;
  allOnPageSelected: boolean;
};

function StatusIcon({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <span className="contacts-status contacts-status--off" aria-label="Yo‘q">
        —
      </span>
    );
  }
  return (
    <span className="contacts-status contacts-status--on" aria-label="Faol">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export function ContactsDataTable({
  rows,
  selectedIds,
  onToggleAll,
  onToggleRow,
  allOnPageSelected,
}: ContactsDataTableProps) {
  return (
    <div className="contacts-table-wrap-inner">
      <table className="contacts-data-table">
        <thead>
          <tr>
            <th className="contacts-data-table__check">
              <input
                type="checkbox"
                checked={rows.length > 0 && allOnPageSelected}
                onChange={onToggleAll}
                aria-label="Barchasini tanlash"
              />
            </th>
            <th>Name</th>
            <th>Mobil Raqam</th>
            <th>Xabar statusi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="contacts-data-table__check">
                <input
                  type="checkbox"
                  checked={selectedIds.has(row.id)}
                  onChange={() => onToggleRow(row.id)}
                  aria-label={`${row.name}ni tanlash`}
                />
              </td>
              <td>{row.name}</td>
              <td className="mono">{row.mobile}</td>
              <td>
                <StatusIcon ok={row.messageOk} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
