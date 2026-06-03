import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCampaignsQuery } from '../../api/endpoints/campaignApi';
import { IconChevronRight, IconSend } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable, Pagination, type Column } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { formatDate } from '../../lib/format';
import { campaignStatusLabel, campaignStatusTone } from '../../lib/labels';
import type { Campaign } from '../../types';

const LIMIT = 20;

export function CampaignsListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const params = useMemo(
    () => ({ page, limit: LIMIT, status: status || undefined }),
    [page, status],
  );
  const { data, isLoading, isError } = useGetCampaignsQuery(params);

  const columns: Column<Campaign>[] = [
    { key: 'title', header: 'Nomi', render: (c) => <strong>{c.title}</strong> },
    {
      key: 'status',
      header: 'Holat',
      render: (c) => <StatusPill tone={campaignStatusTone[c.status]} label={campaignStatusLabel[c.status]} />,
    },
    { key: 'total', header: 'Jami', render: (c) => c.totalCount },
    { key: 'sent', header: 'Yuborildi', render: (c) => <span style={{ color: 'var(--success)' }}>{c.sentCount}</span> },
    { key: 'failed', header: 'Xato', render: (c) => <span style={{ color: 'var(--danger)' }}>{c.failedCount}</span> },
    { key: 'createdAt', header: 'Sana', render: (c) => <span className="muted">{formatDate(c.createdAt)}</span> },
    {
      key: 'open',
      header: '',
      align: 'right',
      render: (c) => (
        <button className="icon-btn" onClick={() => navigate(`/campaigns/${c._id}`)} aria-label="Ochish">
          <IconChevronRight />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Xabarlar"
        subtitle="Yuborilgan SMS xabarlar."
        actions={
          <Button variant="primary" iconLeft={<IconSend width={16} height={16} />} onClick={() => navigate('/campaigns/new')}>
            Yangi xabar
          </Button>
        }
      />

      <Card bodyless>
        <div className="card__body" style={{ paddingBottom: 0 }}>
          <div className="toolbar" style={{ marginBottom: 16 }}>
            <select
              className="field__select"
              style={{ maxWidth: 200 }}
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">Barcha holatlar</option>
              <option value="DRAFT">Qoralama</option>
              <option value="SCHEDULED">Rejalashtirilgan</option>
              <option value="SENDING">Yuborilmoqda</option>
              <option value="DONE">Yakunlangan</option>
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(c) => c._id}
          loading={isLoading}
          error={isError}
          emptyTitle="Xabar yo‘q"
          emptyMessage="Birinchi xabaringizni yuboring."
        />
        {data && data.total > 0 && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
      </Card>
    </>
  );
}
