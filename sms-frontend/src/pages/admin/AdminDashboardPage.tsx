import { useGetAdminStatsQuery } from '../../api/endpoints/statsApi';
import { IconContacts, IconCheckCircle, IconDevice, IconSend } from '../../components/icons/UiIcons';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SmsVolumeChart } from '../../components/ui/SmsVolumeChart';
import { StatCard } from '../../components/ui/StatCard';
import { ErrorState, Skeleton } from '../../components/ui/states';
import { formatNumber } from '../../lib/format';
import { subscriptionPlanLabel } from '../../lib/labels';

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useGetAdminStatsQuery();

  return (
    <>
      <PageHeader title="Admin panel" subtitle="Platforma bo‘yicha umumiy ko‘rsatkichlar." />

      {isLoading ? (
        <div className="stat-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={108} radius={14} />
          ))}
        </div>
      ) : isError || !data ? (
        <Card>
          <ErrorState message="Statistikani yuklab bo‘lmadi." />
        </Card>
      ) : (
        <div className="stack">
          <div className="stat-grid">
            <StatCard
              label="Aʼzolar"
              value={formatNumber(data.members.total)}
              hint={`${data.members.active} faol · ${data.members.blocked} bloklangan`}
              icon={<IconContacts width={18} height={18} />}
            />
            <StatCard
              label="Xabarlar"
              value={formatNumber(data.campaigns.total)}
              hint={`${data.campaigns.sending} yuborilmoqda`}
              icon={<IconSend width={18} height={18} />}
            />
            <StatCard
              label="Onlayn qurilmalar"
              value={formatNumber(data.devicesOnline)}
              icon={<IconDevice width={18} height={18} />}
            />
            <StatCard
              label="Jami yuborilgan SMS"
              value={formatNumber(data.sms.sent)}
              hint={`${formatNumber(data.sms.failed)} xato`}
              icon={<IconCheckCircle width={20} height={20} />}
            />
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}>
            <Card title="SMS hajmi (so‘nggi 14 kun)">
              <SmsVolumeChart data={data.smsSeries} />
            </Card>
            <Card title="Obunalar">
              <div className="stack" style={{ gap: 10 }}>
                {(['BASIC', 'PRO', 'ENTERPRISE'] as const).map((plan) => (
                  <div key={plan} className="row" style={{ justifyContent: 'space-between' }}>
                    <span>{subscriptionPlanLabel[plan]}</span>
                    <strong>{data.subscriptions.byPlan[plan]}</strong>
                  </div>
                ))}
                <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Faol</span>
                  <strong style={{ color: 'var(--success)' }}>{data.subscriptions.byStatus.ACTIVE}</strong>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Muddati tugagan</span>
                  <strong>{data.subscriptions.byStatus.EXPIRED}</strong>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
