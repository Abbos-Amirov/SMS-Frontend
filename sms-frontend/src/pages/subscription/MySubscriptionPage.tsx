import { useGetMySubscriptionQuery } from '../../api/endpoints/subscriptionApi';
import { IconCredit } from '../../components/icons/UiIcons';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { EmptyState, ErrorState, Skeleton } from '../../components/ui/states';
import { formatDate } from '../../lib/format';
import { subscriptionPlanLabel, subscriptionStatusLabel, subscriptionStatusTone } from '../../lib/labels';

export function MySubscriptionPage() {
  const { data, isLoading, isError } = useGetMySubscriptionQuery();

  return (
    <>
      <PageHeader title="Obuna" subtitle="Joriy tarif va uning holati." />
      <Card>
        {isLoading ? (
          <Skeleton height={120} />
        ) : isError ? (
          <ErrorState />
        ) : !data ? (
          <EmptyState
            icon={<IconCredit />}
            title="Faol obuna yo‘q"
            message="Kampaniya yuborish uchun administrator obunani faollashtirishi kerak."
          />
        ) : (
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="row">
                <span style={{ fontSize: 22, fontWeight: 700 }}>{subscriptionPlanLabel[data.plan]}</span>
                <StatusPill tone={subscriptionStatusTone[data.status]} label={subscriptionStatusLabel[data.status]} />
              </div>
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="l">Boshlangan</div>
                <div className="v">{formatDate(data.startsAt)}</div>
              </div>
              <div className="detail-item">
                <div className="l">Tugaydi</div>
                <div className="v">{data.expiresAt ? formatDate(data.expiresAt) : 'Muddatsiz'}</div>
              </div>
              <div className="detail-item">
                <div className="l">Qurilma limiti</div>
                <div className="v">{data.deviceLimit == null ? 'Cheksiz' : data.deviceLimit}</div>
              </div>
              <div className="detail-item">
                <div className="l">Kunlik SMS limiti</div>
                <div className="v">{data.dailySmsLimit == null ? 'Cheksiz' : data.dailySmsLimit}</div>
              </div>
            </div>
            {data.note && <p className="muted" style={{ margin: 0 }}>{data.note}</p>}
          </div>
        )}
      </Card>
    </>
  );
}
