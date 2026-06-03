import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useDeleteMemberMutation,
  useGetMemberQuery,
  useUpdateMemberMutation,
} from '../../api/endpoints/memberApi';
import { useActivateSubscriptionMutation } from '../../api/endpoints/subscriptionApi';
import { useGetAdminPlansQuery } from '../../api/endpoints/planApi';
import { IconChevronLeft } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/FormFields';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { ErrorState, Skeleton } from '../../components/ui/states';
import { useAuth } from '../../features/auth/useAuth';
import { useToast } from '../../features/ui/useToast';
import { formatDate } from '../../lib/format';
import { memberRoleLabel, memberStatusLabel, memberStatusTone } from '../../lib/labels';
import type { SubscriptionPlan } from '../../types';

export function MemberDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOwner } = useAuth();

  const { data: m, isLoading, isError } = useGetMemberQuery(id);
  const [updateMember, { isLoading: updating }] = useUpdateMemberMutation();
  const [deleteMember, { isLoading: deleting }] = useDeleteMemberMutation();
  const [activate, { isLoading: activating }] = useActivateSubscriptionMutation();
  const { data: plans } = useGetAdminPlansQuery();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan>('BASIC');
  const [durationDays, setDurationDays] = useState('30');
  const [deviceLimit, setDeviceLimit] = useState('');
  const [dailySmsLimit, setDailySmsLimit] = useState('');

  // Prefill the limits from the chosen plan's catalog (null => empty = unlimited).
  const applyPlan = (code: SubscriptionPlan) => {
    const p = plans?.find((x) => x.code === code);
    if (!p) return;
    setDurationDays(p.durationDays == null ? '' : String(p.durationDays));
    setDeviceLimit(p.deviceLimit == null ? '' : String(p.deviceLimit));
    setDailySmsLimit(p.dailySmsLimit == null ? '' : String(p.dailySmsLimit));
  };

  const openSub = () => {
    applyPlan(plan);
    setSubOpen(true);
  };

  if (isLoading) return <Skeleton height={260} />;
  if (isError || !m) return <ErrorState message="Aʼzo topilmadi." />;

  const setStatus = async (memberStatus: 'ACTIVE' | 'BLOCKED') => {
    try {
      await updateMember({ id, data: { memberStatus } }).unwrap();
      toast('success', memberStatus === 'BLOCKED' ? 'Aʼzo bloklandi.' : 'Blok olib tashlandi.');
    } catch (err) {
      toast('error', (err as { data?: { message?: string } })?.data?.message ?? 'Xatolik');
    }
  };

  const setRole = async (memberRole: 'ADMIN' | 'USER') => {
    try {
      await updateMember({ id, data: { memberRole } }).unwrap();
      toast('success', 'Rol yangilandi.');
    } catch (err) {
      toast('error', (err as { data?: { message?: string } })?.data?.message ?? 'Xatolik');
    }
  };

  const doDelete = async () => {
    try {
      await deleteMember(id).unwrap();
      toast('success', 'Aʼzo o‘chirildi.');
      navigate('/admin/members');
    } catch (err) {
      toast('error', (err as { data?: { message?: string } })?.data?.message ?? 'Xatolik');
    }
  };

  const doActivate = async () => {
    try {
      await activate({
        memberId: id,
        data: {
          plan,
          durationDays: durationDays ? Number(durationDays) : undefined,
          deviceLimit: deviceLimit ? Number(deviceLimit) : undefined,
          dailySmsLimit: dailySmsLimit ? Number(dailySmsLimit) : undefined,
        },
      }).unwrap();
      toast('success', 'Obuna faollashtirildi.');
      setSubOpen(false);
    } catch (err) {
      toast('error', (err as { data?: { message?: string } })?.data?.message ?? 'Xatolik');
    }
  };

  return (
    <>
      <PageHeader
        title={`${m.memberFirstName} ${m.memberLastName ?? ''}`}
        subtitle={m.memberEmail}
        actions={
          <Button variant="ghost" iconLeft={<IconChevronLeft />} onClick={() => navigate('/admin/members')}>
            Orqaga
          </Button>
        }
      />

      <div className="stack" style={{ maxWidth: 760 }}>
        <Card>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
            <StatusPill tone={memberStatusTone[m.memberStatus]} label={memberStatusLabel[m.memberStatus]} />
            <StatusPill tone="accent" label={memberRoleLabel[m.memberRole]} dot={false} />
          </div>
          <div className="detail-grid">
            <div className="detail-item"><div className="l">Kompaniya</div><div className="v">{m.memberCompanyName || '—'}</div></div>
            <div className="detail-item"><div className="l">Telefon</div><div className="v">{m.memberPhone || '—'}</div></div>
            <div className="detail-item"><div className="l">Xabarlar</div><div className="v">{m.memberCampaigns}</div></div>
            <div className="detail-item"><div className="l">Qurilmalar</div><div className="v">{m.memberDevices}</div></div>
            <div className="detail-item"><div className="l">Kontaktlar</div><div className="v">{m.memberContacts}</div></div>
            <div className="detail-item"><div className="l">Yuborilgan SMS</div><div className="v">{m.memberSentSms}</div></div>
            <div className="detail-item"><div className="l">Ro‘yxatdan</div><div className="v">{formatDate(m.createdAt)}</div></div>
          </div>
        </Card>

        <Card title="Boshqaruv">
          <div className="toolbar">
            {m.memberStatus === 'BLOCKED' ? (
              <Button loading={updating} onClick={() => setStatus('ACTIVE')}>Blokni ochish</Button>
            ) : (
              <Button variant="danger" loading={updating} onClick={() => setStatus('BLOCKED')}>Bloklash</Button>
            )}
            {m.memberRole === 'USER' && isOwner && (
              <Button loading={updating} onClick={() => setRole('ADMIN')}>Adminga ko‘tarish</Button>
            )}
            {m.memberRole === 'ADMIN' && isOwner && (
              <Button loading={updating} onClick={() => setRole('USER')}>Foydalanuvchiga tushirish</Button>
            )}
            <Button variant="primary" onClick={openSub}>Obuna faollashtirish</Button>
            <div className="toolbar__spacer" />
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>O‘chirish</Button>
          </div>
        </Card>
      </div>

      <Modal
        open={subOpen}
        title="Obunani faollashtirish"
        onClose={() => setSubOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSubOpen(false)}>Bekor qilish</Button>
            <Button variant="primary" loading={activating} onClick={doActivate}>Faollashtirish</Button>
          </>
        }
      >
        <Select
          label="Tarif"
          value={plan}
          onChange={(e) => {
            const code = e.target.value as SubscriptionPlan;
            setPlan(code);
            applyPlan(code);
          }}
          options={
            plans && plans.length
              ? plans.map((p) => ({ value: p.code, label: p.name }))
              : [
                  { value: 'BASIC', label: 'Basic' },
                  { value: 'PRO', label: 'Pro' },
                  { value: 'ENTERPRISE', label: 'Enterprise' },
                ]
          }
        />
        <Input
          label="Muddat (kun, bo‘sh = muddatsiz)"
          type="number"
          value={durationDays}
          onChange={(e) => setDurationDays(e.target.value)}
        />
        <Input
          label="Kunlik SMS limiti (bo‘sh = cheksiz)"
          type="number"
          value={dailySmsLimit}
          onChange={(e) => setDailySmsLimit(e.target.value)}
        />
        <Input
          label="Qurilma limiti (bo‘sh = tarif bo‘yicha)"
          type="number"
          value={deviceLimit}
          onChange={(e) => setDeviceLimit(e.target.value)}
        />
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="Aʼzoni o‘chirish"
        message="Aʼzo o‘chiriladi va tizimdan chiqariladi. Davom etilsinmi?"
        confirmLabel="O‘chirish"
        danger
        loading={deleting}
        onConfirm={doDelete}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
}
