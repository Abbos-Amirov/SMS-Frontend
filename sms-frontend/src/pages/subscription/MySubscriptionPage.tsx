import { useState } from 'react';
import { useGetPlansQuery } from '../../api/endpoints/planApi';
import { useGetMySubscriptionQuery } from '../../api/endpoints/subscriptionApi';
import { IconCheckCircle, IconCopy, IconCredit } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { ErrorState, Skeleton } from '../../components/ui/states';
import { useToast } from '../../features/ui/useToast';
import { formatDate, formatLimit, formatPrice } from '../../lib/format';
import { getSupportContact } from '../../lib/support';
import { subscriptionPlanLabel, subscriptionStatusLabel, subscriptionStatusTone } from '../../lib/labels';
import type { Plan } from '../../types';

export function MySubscriptionPage() {
  const { data, isLoading, isError } = useGetMySubscriptionQuery();
  const { data: plans, isLoading: plansLoading } = useGetPlansQuery();
  const [contactPlan, setContactPlan] = useState<Plan | null>(null);

  const activeSub = data && data.status === 'ACTIVE' ? data : null;

  return (
    <>
      <PageHeader title="Obuna" subtitle="Joriy tarif va mavjud tariflar." />

      {isLoading ? (
        <Card><Skeleton height={120} /></Card>
      ) : isError ? (
        <Card><ErrorState /></Card>
      ) : activeSub ? (
        <Card>
          <div className="stack">
            <div className="row">
              <span style={{ fontSize: 22, fontWeight: 700 }}>{subscriptionPlanLabel[activeSub.plan]}</span>
              <StatusPill tone={subscriptionStatusTone[activeSub.status]} label={subscriptionStatusLabel[activeSub.status]} />
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="l">Boshlangan</div>
                <div className="v">{formatDate(activeSub.startsAt)}</div>
              </div>
              <div className="detail-item">
                <div className="l">Tugaydi</div>
                <div className="v">{activeSub.expiresAt ? formatDate(activeSub.expiresAt) : 'Muddatsiz'}</div>
              </div>
              <div className="detail-item">
                <div className="l">Qurilma limiti</div>
                <div className="v">{formatLimit(activeSub.deviceLimit)}</div>
              </div>
              <div className="detail-item">
                <div className="l">Kunlik SMS limiti</div>
                <div className="v">{formatLimit(activeSub.dailySmsLimit)}</div>
              </div>
            </div>
            {activeSub.note && <p className="muted" style={{ margin: 0 }}>{activeSub.note}</p>}
          </div>
        </Card>
      ) : (
        <div className="stack">
          <Card>
            <div className="row" style={{ gap: 10 }}>
              {data ? (
                <>
                  <StatusPill tone={subscriptionStatusTone[data.status]} label={subscriptionStatusLabel[data.status]} />
                  <span className="muted">
                    Avvalgi tarif: {subscriptionPlanLabel[data.plan]}. Davom etish uchun quyidagi tariflardan birini so‘rang.
                  </span>
                </>
              ) : (
                <>
                  <IconCredit />
                  <span className="muted">
                    Faol obunangiz yo‘q. Xabar yuborishni boshlash uchun quyidagi tariflardan birini tanlab so‘rov yuboring.
                  </span>
                </>
              )}
            </div>
          </Card>

          {plansLoading ? (
            <div className="plan-grid">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={280} radius={16} />)}
            </div>
          ) : (
            <div className="plan-grid">
              {(plans ?? []).map((plan) => (
                <PlanCard key={plan._id} plan={plan} onRequest={() => setContactPlan(plan)} />
              ))}
            </div>
          )}
        </div>
      )}

      <ContactModal plan={contactPlan} onClose={() => setContactPlan(null)} />
    </>
  );
}

function PlanCard({ plan, onRequest }: { plan: Plan; onRequest: () => void }) {
  const features = [
    plan.deviceLimit == null ? 'Cheksiz qurilma' : `${plan.deviceLimit} ta qurilma`,
    plan.dailySmsLimit == null ? 'Cheksiz SMS' : `Kunlik ${formatLimit(plan.dailySmsLimit)} SMS`,
    plan.durationDays == null ? 'Muddatsiz' : `${plan.durationDays} kun muddat`,
    ...plan.features,
  ];

  return (
    <div className="plan-card">
      <div className="plan-card__name">{plan.name}</div>
      <div className="plan-card__price">{formatPrice(plan.price, plan.currency)}</div>
      {plan.description && <p className="plan-card__desc muted">{plan.description}</p>}
      <ul className="plan-card__features">
        {features.map((f, i) => (
          <li key={`${f}-${i}`}><IconCheckCircle width={16} height={16} /> {f}</li>
        ))}
      </ul>
      <Button variant="primary" className="plan-card__cta" onClick={onRequest}>
        Faollashtirishni so‘rash
      </Button>
    </div>
  );
}

function ContactModal({ plan, onClose }: { plan: Plan | null; onClose: () => void }) {
  const toast = useToast();
  const { phone, telegram } = getSupportContact();

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value);
    toast('success', 'Nusxalandi.');
  };

  return (
    <Modal open={!!plan} title="Administrator bilan bog‘laning" onClose={onClose}>
      <p className="muted" style={{ marginTop: 0 }}>
        {plan ? <><strong>{plan.name}</strong> tarifini faollashtirish uchun administrator bilan bog‘laning:</> : null}
      </p>
      <div className="stack" style={{ gap: 10 }}>
        <div className="contact-row">
          <span className="l">Telefon</span>
          <span className="mono">{phone}</span>
          <button className="icon-btn" onClick={() => copy(phone)} aria-label="Nusxalash"><IconCopy /></button>
        </div>
        <div className="contact-row">
          <span className="l">Telegram</span>
          <span className="mono">{telegram}</span>
          <button className="icon-btn" onClick={() => copy(telegram)} aria-label="Nusxalash"><IconCopy /></button>
        </div>
      </div>
    </Modal>
  );
}
