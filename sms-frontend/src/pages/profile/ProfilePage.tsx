import { useEffect, useRef, useState } from 'react';
import { useUpdateMeMutation } from '../../api/endpoints/authApi';
import { setMember } from '../../features/auth/AuthSlice';
import { useAuth } from '../../features/auth/useAuth';
import { useToast } from '../../features/ui/useToast';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/FormFields';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { fileToAvatarDataUrl } from '../../lib/image';
import { memberRoleLabel, memberStatusLabel, memberStatusTone } from '../../lib/labels';
import { useAppDispatch } from '../../store';

export function ProfilePage() {
  const { member } = useAuth();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    memberFirstName: '',
    memberLastName: '',
    memberPhone: '',
    memberCompanyName: '',
  });
  // null = unchanged, '' = remove, string = new image
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setForm({
        memberFirstName: member.memberFirstName ?? '',
        memberLastName: member.memberLastName ?? '',
        memberPhone: member.memberPhone ?? '',
        memberCompanyName: member.memberCompanyName ?? '',
      });
      setImage(null);
    }
  }, [member]);

  if (!member) return null;

  const previewImage = image !== null ? image : member.memberImage ?? '';
  const initials =
    `${member.memberFirstName?.[0] ?? ''}${member.memberLastName?.[0] ?? ''}`.toUpperCase() ||
    member.memberEmail[0].toUpperCase();

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setImage(dataUrl);
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Rasmni yuklashda xatolik.');
    }
  };

  const save = async () => {
    try {
      const payload = { ...form, ...(image !== null ? { memberImage: image } : {}) };
      const updated = await updateMe(payload).unwrap();
      dispatch(setMember(updated));
      setImage(null);
      toast('success', 'Profil yangilandi.');
    } catch {
      toast('error', 'Saqlashda xatolik.');
    }
  };

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

          <div className="profile-avatar-row">
            <div className="avatar avatar--lg">
              {previewImage ? <img src={previewImage} alt="Profil rasmi" /> : initials}
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <div className="row" style={{ gap: 8 }}>
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Rasm yuklash
                </Button>
                {previewImage && (
                  <Button variant="ghost" size="sm" onClick={() => setImage('')}>
                    Oʻchirish
                  </Button>
                )}
              </div>
              <span className="muted" style={{ fontSize: 12 }}>
                JPG yoki PNG, 4 MB gacha. Saqlash tugmasini bosing.
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onPickFile}
            />
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
