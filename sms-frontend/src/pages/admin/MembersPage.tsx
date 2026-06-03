import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMembersQuery } from '../../api/endpoints/memberApi';
import { IconChevronRight } from '../../components/icons/UiIcons';
import { Card } from '../../components/ui/Card';
import { DataTable, Pagination, type Column } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { StatusPill } from '../../components/ui/StatusPill';
import { formatDate } from '../../lib/format';
import { memberRoleLabel, memberStatusLabel, memberStatusTone } from '../../lib/labels';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import type { Member } from '../../types';

const LIMIT = 20;

export function MembersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const debounced = useDebouncedValue(searchText);

  const params = useMemo(
    () => ({ page, limit: LIMIT, search: { text: debounced || undefined, memberStatus: status || undefined } }),
    [page, debounced, status],
  );
  const { data, isLoading, isError } = useGetMembersQuery(params);

  const columns: Column<Member>[] = [
    {
      key: 'name',
      header: 'Aʼzo',
      render: (m) => (
        <div>
          <strong>{m.memberFirstName} {m.memberLastName}</strong>
          <div className="muted" style={{ fontSize: 12 }}>{m.memberEmail}</div>
        </div>
      ),
    },
    { key: 'role', header: 'Rol', render: (m) => memberRoleLabel[m.memberRole] },
    {
      key: 'status',
      header: 'Holat',
      render: (m) => <StatusPill tone={memberStatusTone[m.memberStatus]} label={memberStatusLabel[m.memberStatus]} />,
    },
    { key: 'campaigns', header: 'Xabarlar', render: (m) => m.memberCampaigns },
    { key: 'devices', header: 'Qurilma', render: (m) => m.memberDevices },
    { key: 'createdAt', header: 'Ro‘yxatdan', render: (m) => <span className="muted">{formatDate(m.createdAt)}</span> },
    {
      key: 'open',
      header: '',
      align: 'right',
      render: (m) => (
        <button className="icon-btn" onClick={() => navigate(`/admin/members/${m._id}`)} aria-label="Ochish">
          <IconChevronRight />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Aʼzolar" subtitle="Barcha foydalanuvchilarni boshqaring." />
      <Card bodyless>
        <div className="card__body" style={{ paddingBottom: 0 }}>
          <div className="toolbar" style={{ marginBottom: 16 }}>
            <SearchInput value={searchText} onChange={(v) => { setSearchText(v); setPage(1); }} placeholder="Ism yoki email..." />
            <select
              className="field__select"
              style={{ maxWidth: 180 }}
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">Barcha holatlar</option>
              <option value="ACTIVE">Faol</option>
              <option value="BLOCKED">Bloklangan</option>
              <option value="DELETED">O‘chirilgan</option>
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(m) => m._id}
          loading={isLoading}
          error={isError}
          emptyTitle="Aʼzo topilmadi"
        />
        {data && data.total > 0 && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
      </Card>
    </>
  );
}
