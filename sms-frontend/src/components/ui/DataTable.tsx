import type { ReactNode } from 'react';
import type { Direction } from '../../types';
import { IconChevronLeft, IconChevronRight } from '../icons/UiIcons';
import { Button } from './Button';
import { EmptyState, ErrorState, TableSkeleton } from './states';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: (ids: string[]) => void;
  sort?: string;
  direction?: Direction;
  onSort?: (field: string) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  emptyTitle = 'Maʼlumot yoʻq',
  emptyMessage,
  selectable,
  selectedIds,
  onToggleRow,
  onToggleAll,
  sort,
  direction,
  onSort,
}: DataTableProps<T>) {
  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState />;
  if (!rows.length) return <EmptyState title={emptyTitle} message={emptyMessage} />;

  const ids = rows.map(rowKey);
  const allChecked = selectable && selectedIds ? ids.every((id) => selectedIds.has(id)) : false;

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {selectable && (
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  className="table-checkbox"
                  checked={allChecked}
                  onChange={() => onToggleAll?.(ids)}
                  aria-label="Hammasini tanlash"
                />
              </th>
            )}
            {columns.map((c) => {
              const active = sort === c.key;
              return (
                <th
                  key={c.key}
                  className={c.sortable ? 'sortable' : undefined}
                  style={{ textAlign: c.align ?? 'left' }}
                  onClick={c.sortable && onSort ? () => onSort(c.key) : undefined}
                >
                  {c.header}
                  {active && (direction === 'asc' ? ' ↑' : ' ↓')}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = rowKey(row);
            return (
              <tr key={id}>
                {selectable && (
                  <td>
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={selectedIds?.has(id) ?? false}
                      onChange={() => onToggleRow?.(id)}
                      aria-label="Tanlash"
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPage: (page: number) => void;
}

export function Pagination({ page, limit, total, onPage }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="pagination">
      <span className="pagination__info">
        {from}–{to} / jami {total}
      </span>
      <div className="pagination__controls">
        <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Oldingi">
          <IconChevronLeft />
        </Button>
        <span className="pagination__info">
          {page} / {pages}
        </span>
        <Button size="sm" variant="ghost" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Keyingi">
          <IconChevronRight />
        </Button>
      </div>
    </div>
  );
}
