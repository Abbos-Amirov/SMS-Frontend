import { useMemo, useState } from 'react';
import {
  useCancelSubscriptionMutation,
  useGetAdminSubscriptionsQuery,
} from '../../api/endpoints/subscriptionApi';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/ui/Modal';
import { DataTable, Pagination, type Column } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { useToast } from '../../features/ui/useToast';
import { formatDate } from '../../lib/format';
import {
  subscriptionPlanLabel,
  subscriptionStatusLabel,
  subscriptionStatusTone,
} from '../../lib/labels';
import type { Subscription } from '../../types';

const LIMIT = 20;

export function AdminSubscriptionsPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const params = useMemo(
    () => ({ page, limit: LIMIT, status: status || undefined }),
    [page, status],
  );
  const { data, isLoading, isError } = useGetAdminSubscriptionsQuery(params);
  const [cancelSub, { isLoading: cancelling }] = useCancelSubscriptionMutation();
  const [toCancel, setToCancel] = useState<Subscription | null>(null);

  const doCancel = async () => {
    if (!toCancel) return;
    try {
      await cancelSub(toCancel._id).unwrap();
      toast('success', 'Obuna bekor qilindi.');
      setToCancel(null);
    } catch {
      toast('error', 'Bekor qilishda xatolik.');
    }
  };

  const columns: Column<Subscription>[] = [
    { key: 'memberId', header: 'Aʼzo ID', render: (s) => <span className="mono">{s.memberId.slice(-8)}</span> },
    { key: 'plan', header: 'Tarif', render: (s) => subscriptionPlanLabel[s.plan] },
    {
      key: 'status',
      header: 'Holat',
      render: (s) => <StatusPill tone={subscriptionStatusTone[s.status]} label={subscriptionStatusLabel[s.status]} />,
    },
    { key: 'starts', header: 'Boshlangan', render: (s) => <span className="muted">{formatDate(s.startsAt)}</span> },
    { key: 'expires', header: 'Tugaydi', render: (s) => <span className="muted">{s.expiresAt ? formatDate(s.expiresAt) : 'Muddatsiz'}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (s) =>
        s.status === 'ACTIVE' ? (
          <Button size="sm" variant="danger" onClick={() => setToCancel(s)}>
            Bekor qilish
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader title="Obunalar" subtitle="Barcha obunalarni boshqaring." />
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
              <option value="ACTIVE">Faol</option>
              <option value="EXPIRED">Muddati tugagan</option>
              <option value="CANCELLED">Bekor qilingan</option>
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(s) => s._id}
          loading={isLoading}
          error={isError}
          emptyTitle="Obuna yo‘q"
          emptyMessage="Aʼzo sahifasidan obuna faollashtirishingiz mumkin."
        />
        {data && data.total > 0 && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
      </Card>

      <ConfirmDialog
        open={!!toCancel}
        title="Obunani bekor qilish"
        message="Bu obuna bekor qilinadi. Davom etilsinmi?"
        confirmLabel="Bekor qilish"
        danger
        loading={cancelling}
        onConfirm={doCancel}
        onClose={() => setToCancel(null)}
      />
    </>
  );
}
