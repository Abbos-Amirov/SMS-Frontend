import type { ServerDevice } from '../types';

const COL_COUNT = 7;

function statusLabel(s: ServerDevice['status']) {
  if (s === 'online') return 'Online';
  if (s === 'offline') return 'Offline';
  return 'No reply';
}

type ServersDataTableProps = {
  rows: ServerDevice[];
  loading: boolean;
  selectedIds: Set<string>;
  onToggleAll: () => void;
  onToggleRow: (id: string) => void;
  allSelected: boolean;
};

export function ServersDataTable({
  rows,
  loading,
  selectedIds,
  onToggleAll,
  onToggleRow,
  allSelected,
}: ServersDataTableProps) {
  return (
    <div className="contacts-table-wrap-inner">
      <table className="contacts-data-table servers-data-table">
        <thead>
          <tr>
            <th className="contacts-data-table__check">
              <input type="checkbox" checked={rows.length > 0 && allSelected} onChange={onToggleAll} aria-label="Barchasi" />
            </th>
            <th>Name</th>
            <th>Model</th>
            <th>Bios versiya</th>
            <th>Dastur versiyasi</th>
            <th>Umumiy xabarlar</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={COL_COUNT} className="servers-table-empty">
                Yozuvlar yuklanmoqda...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={COL_COUNT} className="servers-table-empty">
                Yozuvlar yo‘q
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="contacts-data-table__check">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => onToggleRow(row.id)}
                    aria-label={row.name}
                  />
                </td>
                <td>{row.name}</td>
                <td>{row.model}</td>
                <td className="mono">{row.biosVersiya}</td>
                <td className="mono">{row.dasturVersiyasi}</td>
                <td>{row.umumiyXabarlar.toLocaleString('uz-UZ')}</td>
                <td>
                  <span className={`servers-status servers-status--${row.status}`}>{statusLabel(row.status)}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
