import { useGetMyStatsQuery } from '../../api/endpoints/statsApi';
import { IconCheckCircle, IconDevice, IconMinusCircle, IconSend } from '../../components/icons/UiIcons';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SmsVolumeChart } from '../../components/ui/SmsVolumeChart';
import { StatCard } from '../../components/ui/StatCard';
import { ErrorState, Skeleton } from '../../components/ui/states';
import { useAuth } from '../../features/auth/useAuth';
import { formatNumber } from '../../lib/format';

export function DashboardPage() {
  const { member } = useAuth();
  const { data, isLoading, isError } = useGetMyStatsQuery();

  return (
    <>
      <PageHeader
        title={`Salom, ${member?.memberFirstName ?? ''} 👋`}
        subtitle="Hisobingiz bo‘yicha umumiy ko‘rsatkichlar."
      />

      {isLoading ? (
        <div className="stat-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={108} radius={14} />
          ))}
        </div>
      ) : isError || !data ? (
        <Card>
          <ErrorState message="Statistikani yuklab bo‘lmadi. Backend ishlayotganini tekshiring." />
        </Card>
      ) : (
        <div className="stack">
          <div className="stat-grid">
            <StatCard
              label="Yuborilgan SMS"
              value={formatNumber(data.sms.sent)}
              icon={<IconCheckCircle width={20} height={20} />}
            />
            <StatCard
              label="Xato"
              value={formatNumber(data.sms.failed)}
              icon={<IconMinusCircle width={20} height={20} />}
            />
            <StatCard
              label="Xabarlar"
              value={formatNumber(data.campaigns.total)}
              hint={`${data.campaigns.sending} ta yuborilmoqda`}
              icon={<IconSend width={18} height={18} />}
            />
            <StatCard
              label="Onlayn qurilmalar"
              value={`${data.devices.online} / ${data.devices.total}`}
              icon={<IconDevice width={18} height={18} />}
            />
          </div>

          <Card title="SMS hajmi (so‘nggi 14 kun)">
            <SmsVolumeChart data={data.smsSeries} />
          </Card>
        </div>
      )}
    </>
  );
}
