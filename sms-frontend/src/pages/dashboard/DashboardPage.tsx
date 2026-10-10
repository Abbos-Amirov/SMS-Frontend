import { useNavigate } from 'react-router-dom';
import { useGetMyStatsQuery } from '../../api/endpoints/statsApi';
import { useGetDevicesQuery } from '../../api/endpoints/deviceApi';
import { IconCheckCircle, IconDevice, IconMinusCircle, IconSend } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SmsVolumeChart } from '../../components/ui/SmsVolumeChart';
import { StatCard } from '../../components/ui/StatCard';
import { ErrorState, Skeleton } from '../../components/ui/states';
import { useAuth } from '../../features/auth/useAuth';
import { formatNumber } from '../../lib/format';

export function DashboardPage() {
  const navigate = useNavigate();
  const { member } = useAuth();
  const { data, isLoading, isError } = useGetMyStatsQuery();
  const { data: devices } = useGetDevicesQuery();
  const sender = devices?.list.find((device) => device.status !== 'BLOCKED');

  return (
    <>
      <PageHeader
        title={`Salom, ${member?.memberFirstName ?? ''} 👋`}
        subtitle="Hisobingiz bo‘yicha umumiy ko‘rsatkichlar."
      />

      <Card>
        <div className="readiness-card">
          <div className="readiness-card__status">
            <span className={`readiness-dot ${sender?.status === 'ONLINE' ? 'readiness-dot--online' : ''}`} />
            <div>
              <strong>{sender ? sender.name : 'Yuboruvchi telefon ulanmagan'}</strong>
              <div className="muted">
                {!sender
                  ? 'SMS yuborish uchun Android telefonni ulang.'
                  : !sender.pairedAt
                    ? 'Juftlash kodini TezkorSMS mobile ilovasiga kiriting.'
                    : sender.status === 'ONLINE'
                    ? `${sender.simCarrier ? `SIM ${Number(sender.simSlotIndex ?? 0) + 1} · ${sender.simCarrier}` : 'SIM tanlanmagan'} · yuborishga tayyor`
                    : 'Telefon oflayn — mobile ilovada yuborishni ishga tushiring.'}
              </div>
            </div>
          </div>
          <div className="row">
            <Button variant="ghost" onClick={() => navigate('/devices')}>{sender ? 'Telefon holati' : 'Telefonni ulash'}</Button>
            <Button variant="primary" disabled={!sender?.pairedAt} onClick={() => navigate('/campaigns/new')}>Yangi SMS</Button>
          </div>
        </div>
      </Card>

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
              label="Yuboruvchi telefon"
              value={data.devices.online ? 'Onlayn' : 'Oflayn'}
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
