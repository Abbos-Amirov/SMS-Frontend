import { useState } from 'react';
import { useGetAdminPlansQuery, useUpdatePlanMutation } from '../../api/endpoints/planApi';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/FormFields';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { ErrorState, Skeleton } from '../../components/ui/states';
import { useToast } from '../../features/ui/useToast';
import { formatLimit, formatPrice } from '../../lib/format';
import type { Plan } from '../../types';

interface EditState {
  code: Plan['code'];
  name: string;
  price: string;
  deviceLimit: string;
  dailySmsLimit: string;
  durationDays: string;
  description: string;
  isActive: boolean;
}

// Empty string => unlimited / negotiated (null). Returns undefined on invalid input.
function toNullableNumber(value: string): number | null | undefined {
  if (value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function AdminPlansPage() {
  const toast = useToast();
  const { data: plans, isLoading, isError } = useGetAdminPlansQuery();
  const [updatePlan, { isLoading: saving }] = useUpdatePlanMutation();
  const [edit, setEdit] = useState<EditState | null>(null);

  const openEdit = (plan: Plan) => {
    setEdit({
      code: plan.code,
      name: plan.name,
      price: plan.price == null ? '' : String(plan.price),
      deviceLimit: plan.deviceLimit == null ? '' : String(plan.deviceLimit),
      dailySmsLimit: plan.dailySmsLimit == null ? '' : String(plan.dailySmsLimit),
      durationDays: plan.durationDays == null ? '' : String(plan.durationDays),
      description: plan.description ?? '',
      isActive: plan.isActive,
    });
  };

  const save = async () => {
    if (!edit) return;
    if (!edit.name.trim()) {
      toast('error', 'Tarif nomini kiriting.');
      return;
    }
    const price = toNullableNumber(edit.price);
    const deviceLimit = toNullableNumber(edit.deviceLimit);
    const dailySmsLimit = toNullableNumber(edit.dailySmsLimit);
    const durationDays = toNullableNumber(edit.durationDays);
    if ([price, deviceLimit, dailySmsLimit, durationDays].includes(undefined)) {
      toast('error', 'Raqamli maydonlar noto‘g‘ri. Bo‘sh = cheksiz.');
      return;
    }
    if (dailySmsLimit != null && dailySmsLimit < 1) {
      toast('error', 'Kunlik SMS limiti 1 dan kam bo‘lmasin (bo‘sh = cheksiz).');
      return;
    }
    if (durationDays != null && durationDays < 1) {
      toast('error', 'Muddat 1 kundan kam bo‘lmasin (bo‘sh = muddatsiz).');
      return;
    }
    try {
      await updatePlan({
        code: edit.code,
        data: {
          name: edit.name.trim(),
          price,
          deviceLimit,
          dailySmsLimit,
          durationDays,
          description: edit.description.trim(),
          isActive: edit.isActive,
        },
      }).unwrap();
      toast('success', 'Tarif yangilandi.');
      setEdit(null);
    } catch (err) {
      toast('error', (err as { data?: { message?: string } })?.data?.message ?? 'Saqlashda xatolik.');
    }
  };

  return (
    <>
      <PageHeader title="Tariflar" subtitle="Narx, qurilma va kunlik SMS limitini boshqaring." />

      {isLoading ? (
        <div className="card-grid">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={220} radius={14} />)}
        </div>
      ) : isError ? (
        <Card><ErrorState /></Card>
      ) : (
        <div className="card-grid">
          {(plans ?? []).map((plan) => (
            <Card
              key={plan._id}
              title={plan.name}
              actions={<Button size="sm" onClick={() => openEdit(plan)}>Tahrirlash</Button>}
            >
              <div className="row" style={{ marginBottom: 12 }}>
                <StatusPill tone={plan.isActive ? 'success' : 'neutral'} label={plan.isActive ? 'Faol' : 'Yashirin'} />
              </div>
              <div className="detail-grid">
                <div className="detail-item"><div className="l">Narx</div><div className="v">{formatPrice(plan.price, plan.currency)}</div></div>
                <div className="detail-item"><div className="l">Qurilma limiti</div><div className="v">{formatLimit(plan.deviceLimit)}</div></div>
                <div className="detail-item"><div className="l">Kunlik SMS</div><div className="v">{formatLimit(plan.dailySmsLimit)}</div></div>
                <div className="detail-item"><div className="l">Muddat</div><div className="v">{plan.durationDays == null ? 'Muddatsiz' : `${plan.durationDays} kun`}</div></div>
              </div>
              {plan.description && <p className="muted" style={{ marginBottom: 0 }}>{plan.description}</p>}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!edit}
        title={edit ? `${edit.name} tarifini tahrirlash` : ''}
        onClose={() => setEdit(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEdit(null)}>Bekor qilish</Button>
            <Button variant="primary" loading={saving} onClick={save}>Saqlash</Button>
          </>
        }
      >
        {edit && (
          <>
            <Input label="Nomi" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            <Input
              label="Narx (so‘m, bo‘sh = Kelishuv asosida)"
              type="number"
              value={edit.price}
              onChange={(e) => setEdit({ ...edit, price: e.target.value })}
              placeholder="Kelishuv asosida"
            />
            <Input
              label="Qurilma limiti (bo‘sh = cheksiz)"
              type="number"
              value={edit.deviceLimit}
              onChange={(e) => setEdit({ ...edit, deviceLimit: e.target.value })}
              placeholder="Cheksiz"
            />
            <Input
              label="Kunlik SMS limiti (bo‘sh = cheksiz)"
              type="number"
              value={edit.dailySmsLimit}
              onChange={(e) => setEdit({ ...edit, dailySmsLimit: e.target.value })}
              placeholder="Cheksiz"
            />
            <Input
              label="Muddat (kun, bo‘sh = muddatsiz)"
              type="number"
              value={edit.durationDays}
              onChange={(e) => setEdit({ ...edit, durationDays: e.target.value })}
              placeholder="Muddatsiz"
            />
            <Textarea
              label="Tavsif (ixtiyoriy)"
              rows={2}
              value={edit.description}
              onChange={(e) => setEdit({ ...edit, description: e.target.value })}
            />
            <Select
              label="Holat"
              value={edit.isActive ? 'true' : 'false'}
              onChange={(e) => setEdit({ ...edit, isActive: e.target.value === 'true' })}
              options={[
                { value: 'true', label: 'Faol (foydalanuvchilarga ko‘rinadi)' },
                { value: 'false', label: 'Yashirin' },
              ]}
            />
          </>
        )}
      </Modal>
    </>
  );
}
