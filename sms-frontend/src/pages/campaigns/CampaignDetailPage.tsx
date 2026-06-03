import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCancelCampaignMutation, useGetCampaignQuery } from '../../api/endpoints/campaignApi';
import { IconChevronLeft } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { ErrorState, Skeleton } from '../../components/ui/states';
import { useToast } from '../../features/ui/useToast';
import { formatDate } from '../../lib/format';
import { campaignStatusLabel, campaignStatusTone } from '../../lib/labels';

export function CampaignDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading, isError } = useGetCampaignQuery(id, {
    pollingInterval: 4000,
    skipPollingIfUnfocused: true,
  });
  const [cancelCampaign, { isLoading: cancelling }] = useCancelCampaignMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) return <Skeleton height={260} />;
  if (isError || !data) return <ErrorState message="Xabar topilmadi." />;

  const p = data.progress;
  const total = data.totalCount || 1;
  const pct = (n: number) => `${(n / total) * 100}%`;
  const canCancel = data.status === 'SENDING' || data.status === 'SCHEDULED';

  const doCancel = async () => {
    try {
      await cancelCampaign(id).unwrap();
      toast('success', 'Xabar bekor qilindi.');
      setConfirmOpen(false);
    } catch {
      toast('error', 'Bekor qilishda xatolik.');
    }
  };

  return (
    <>
      <PageHeader
        title={data.title}
        subtitle={`Yaratilgan: ${formatDate(data.createdAt)}`}
        actions={
          <>
            <Button variant="ghost" iconLeft={<IconChevronLeft />} onClick={() => navigate('/campaigns')}>
              Orqaga
            </Button>
            {canCancel && (
              <Button variant="danger" loading={cancelling} onClick={() => setConfirmOpen(true)}>
                Bekor qilish
              </Button>
            )}
          </>
        }
      />

      <div className="stack" style={{ maxWidth: 760 }}>
        <Card>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
            <StatusPill tone={campaignStatusTone[data.status]} label={campaignStatusLabel[data.status]} />
            {data.scheduledAt && <span className="muted">Reja: {formatDate(data.scheduledAt)}</span>}
          </div>

          <div className="progress-track" style={{ marginBottom: 14 }}>
            <div className="progress-seg--sent" style={{ width: pct(p.sent) }} />
            <div className="progress-seg--failed" style={{ width: pct(p.failed) }} />
            <div className="progress-seg--processing" style={{ width: pct(p.processing) }} />
          </div>

          <div className="kpi-inline">
            <div className="kpi-inline__item">
              <div className="v">{data.totalCount}</div>
              <div className="l">Jami</div>
            </div>
            <div className="kpi-inline__item">
              <div className="v" style={{ color: 'var(--success)' }}>{p.sent}</div>
              <div className="l">Yuborildi</div>
            </div>
            <div className="kpi-inline__item">
              <div className="v" style={{ color: 'var(--danger)' }}>{p.failed}</div>
              <div className="l">Xato</div>
            </div>
            <div className="kpi-inline__item">
              <div className="v" style={{ color: 'var(--warn)' }}>{p.processing}</div>
              <div className="l">Jarayonda</div>
            </div>
            <div className="kpi-inline__item">
              <div className="v">{p.pending}</div>
              <div className="l">Kutilmoqda</div>
            </div>
          </div>
        </Card>

        <Card title="Xabar matni">
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{data.message}</p>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Xabarni bekor qilish"
        message="Qolgan yuborilmagan xabarlar bekor qilinadi. Davom etilsinmi?"
        confirmLabel="Ha, bekor qilish"
        danger
        loading={cancelling}
        onConfirm={doCancel}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
