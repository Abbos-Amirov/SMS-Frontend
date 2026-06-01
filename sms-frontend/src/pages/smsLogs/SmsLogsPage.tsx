import { useMemo, useState } from 'react';
import { useGetSmsLogsQuery } from '../../api/endpoints/smsLogApi';
import { Card } from '../../components/ui/Card';
import { DataTable, Pagination, type Column } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { StatusPill } from '../../components/ui/StatusPill';
import { formatDate } from '../../lib/format';
import { smsLogStatusLabel, smsLogStatusTone } from '../../lib/labels';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import type { SmsLog } from '../../types';

const LIMIT = 25;

export function SmsLogsPage() {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const debounced = useDebouncedValue(searchText);

  const params = useMemo(
    () => ({ page, limit: LIMIT, search: { text: debounced || undefined, status: status || undefined } }),
    [page, debounced, status],
  );
  const { data, isLoading, isError } = useGetSmsLogsQuery(params);

  const columns: Column<SmsLog>[] = [
    { key: 'phone', header: 'Telefon', render: (l) => <span className="mono">{l.phone || '—'}</span> },
    {
      key: 'message',
      header: 'Xabar',
      render: (l) => (
        <span className="muted" style={{ display: 'inline-block', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {l.message || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (l) => <StatusPill tone={smsLogStatusTone[l.status]} label={smsLogStatusLabel[l.status]} />,
    },
    { key: 'createdAt', header: 'Vaqt', render: (l) => <span className="muted">{formatDate(l.createdAt)}</span> },
  ];

  return (
    <>
      <PageHeader title="SMS jurnali" subtitle="Yuborilgan xabarlar tarixi." />
      <Card bodyless>
        <div className="card__body" style={{ paddingBottom: 0 }}>
          <div className="toolbar" style={{ marginBottom: 16 }}>
            <SearchInput value={searchText} onChange={(v) => { setSearchText(v); setPage(1); }} placeholder="Telefon raqami..." />
            <select
              className="field__select"
              style={{ maxWidth: 180 }}
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">Barcha holatlar</option>
              <option value="SENT">Yuborildi</option>
              <option value="DELIVERED">Yetkazildi</option>
              <option value="FAILED">Xato</option>
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(l) => l._id}
          loading={isLoading}
          error={isError}
          emptyTitle="Jurnal bo‘sh"
          emptyMessage="Hali SMS yuborilmagan."
        />
        {data && data.total > 0 && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
      </Card>
    </>
  );
}
