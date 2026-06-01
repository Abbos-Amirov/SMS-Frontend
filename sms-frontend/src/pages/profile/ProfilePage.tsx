import { useEffect, useState } from 'react';
import { useUpdateMeMutation } from '../../api/endpoints/authApi';
import { setMember } from '../../features/auth/AuthSlice';
import { useAuth } from '../../features/auth/useAuth';
import { useToast } from '../../features/ui/useToast';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/FormFields';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { memberRoleLabel, memberStatusLabel, memberStatusTone } from '../../lib/labels';
import { useAppDispatch } from '../../store';

export function ProfilePage() {
  const { member } = useAuth();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const [form, setForm] = useState({
    memberFirstName: '',
    memberLastName: '',
    memberPhone: '',
    memberCompanyName: '',
  });

  useEffect(() => {
    if (member) {
      setForm({
        memberFirstName: member.memberFirstName ?? '',
        memberLastName: member.memberLastName ?? '',
        memberPhone: member.memberPhone ?? '',
        memberCompanyName: member.memberCompanyName ?? '',
      });
    }
  }, [member]);

  const save = async () => {
    try {
      const updated = await updateMe(form).unwrap();
      dispatch(setMember(updated));
      toast('success', 'Profil yangilandi.');
    } catch {
      toast('error', 'Saqlashda xatolik.');
    }
  };

  if (!member) return null;

  return (
    <>
      <PageHeader title="Profil" subtitle="Shaxsiy maʼlumotlaringiz." />
      <div className="card-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)', maxWidth: 640 }}>
        <Card>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="row">
              <span className="muted">{member.memberEmail}</span>
              <StatusPill tone="accent" label={memberRoleLabel[member.memberRole]} dot={false} />
            </div>
            <StatusPill tone={memberStatusTone[member.memberStatus]} label={memberStatusLabel[member.memberStatus]} />
          </div>
          <div className="form-row">
            <Input
              label="Ism"
              value={form.memberFirstName}
              onChange={(e) => setForm({ ...form, memberFirstName: e.target.value })}
            />
            <Input
              label="Familiya"
              value={form.memberLastName}
              onChange={(e) => setForm({ ...form, memberLastName: e.target.value })}
            />
          </div>
          <Input
            label="Telefon"
            value={form.memberPhone}
            onChange={(e) => setForm({ ...form, memberPhone: e.target.value })}
          />
          <Input
            label="Kompaniya"
            value={form.memberCompanyName}
            onChange={(e) => setForm({ ...form, memberCompanyName: e.target.value })}
          />
          <Button variant="primary" loading={isLoading} onClick={save}>
            Saqlash
          </Button>
        </Card>
      </div>
    </>
  );
}
