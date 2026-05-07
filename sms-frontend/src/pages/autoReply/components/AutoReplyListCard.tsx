import type { AutoReplyRule, AutoReplySortKey } from '../types';
import { ContactsPanel } from '../../contacts/components/ContactsPanel';
import { ContactsPagination } from '../../contacts/components/ContactsPagination';

type AutoReplyListCardProps = {
  pageSize: number;
  onPageSizeChange: (n: number) => void;
  search: string;
  onSearchChange: (v: string) => void;
  pageRows: AutoReplyRule[];
  selectedIds: Set<string>;
  allOnPageSelected: boolean;
  onToggleAllPage: () => void;
  onToggleRow: (id: string) => void;
  onDeleteSelected: () => void;
  sortKey: AutoReplySortKey;
  sortDir: 'asc' | 'desc';
  onSortColumn: (key: AutoReplySortKey) => void;
  pagination: {
    total: number;
    start: number;
    end: number;
    page: number;
    pageCount: number;
    onPrev: () => void;
    onNext: () => void;
  };
};

const PAGE_OPTS = [10, 25, 50];

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function SortHeader({
  label,
  colKey,
  activeKey,
  sortDir,
  onSortColumn,
}: {
  label: string;
  colKey: AutoReplySortKey;
  activeKey: AutoReplySortKey;
  sortDir: 'asc' | 'desc';
  onSortColumn: (k: AutoReplySortKey) => void;
}) {
  const active = activeKey === colKey;
  return (
    <th>
      <button type="button" className="auto-reply-sort-th" onClick={() => onSortColumn(colKey)}>
        <span>{label}</span>
        <span className="auto-reply-sort-glyphs" aria-hidden>
          <span className={`auto-reply-sort-glyph${active && sortDir === 'asc' ? ' auto-reply-sort-glyph--on' : ''}`}>▲</span>
          <span className={`auto-reply-sort-glyph${active && sortDir === 'desc' ? ' auto-reply-sort-glyph--on' : ''}`}>▼</span>
        </span>
      </button>
    </th>
  );
}

function StatusAllowed({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <span className="contacts-status contacts-status--off" aria-label="Ruxsat yo‘q">
        —
      </span>
    );
  }
  return (
    <span className="contacts-status contacts-status--on" aria-label="Ruxsat berilgan">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export function AutoReplyListCard({
  pageSize,
  onPageSizeChange,
  search,
  onSearchChange,
  pageRows,
  selectedIds,
  allOnPageSelected,
  onToggleAllPage,
  onToggleRow,
  onDeleteSelected,
  sortKey,
  sortDir,
  onSortColumn,
  pagination,
}: AutoReplyListCardProps) {
  const deleteBtn = (
    <button
      type="button"
      className="contacts-btn contacts-btn--red contacts-btn--md auto-reply-btn-with-icon"
      onClick={onDeleteSelected}
      disabled={selectedIds.size === 0}
    >
      <IconTrash />
      O‘chirish
    </button>
  );

  return (
    <ContactsPanel title="Ro‘yxat" actions={deleteBtn}>
      <div className="contacts-table-filters">
        <label className="contacts-table-filters__show">
          <select
            className="contacts-select contacts-select--narrow"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Sahifadagi yozuvlar soni"
          >
            {PAGE_OPTS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>ta yozuvlarni ko‘rsat</span>
        </label>
        <label className="contacts-table-filters__search">
          <span>Izlash:</span>
          <input
            type="search"
            className="contacts-input contacts-input--search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder=""
          />
        </label>
      </div>

      <div className="contacts-table-wrap-inner">
        <table className="contacts-data-table">
          <thead>
            <tr>
              <th className="contacts-data-table__check">
                <input
                  type="checkbox"
                  checked={pageRows.length > 0 && allOnPageSelected}
                  onChange={onToggleAllPage}
                  disabled={pageRows.length === 0}
                  aria-label="Barchasini tanlash"
                />
              </th>
              <SortHeader label="Xabar" colKey="trigger" activeKey={sortKey} sortDir={sortDir} onSortColumn={onSortColumn} />
              <SortHeader label="Javob" colKey="reply" activeKey={sortKey} sortDir={sortDir} onSortColumn={onSortColumn} />
              <SortHeader label="Javob sharti" colKey="condition" activeKey={sortKey} sortDir={sortDir} onSortColumn={onSortColumn} />
              <SortHeader label="Ruxsat" colKey="allowed" activeKey={sortKey} sortDir={sortDir} onSortColumn={onSortColumn} />
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td className="auto-reply-empty-cell" colSpan={5}>
                  Ma’lumot yo‘q
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr key={row.id}>
                  <td className="contacts-data-table__check">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={() => onToggleRow(row.id)}
                      aria-label="Qatorni tanlash"
                    />
                  </td>
                  <td>{row.triggerMessage}</td>
                  <td className="auto-reply-cell-multiline">{row.replyBody}</td>
                  <td>{row.conditionLabel}</td>
                  <td>
                    <StatusAllowed ok={row.allowed} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ContactsPagination {...pagination} />
    </ContactsPanel>
  );
}
