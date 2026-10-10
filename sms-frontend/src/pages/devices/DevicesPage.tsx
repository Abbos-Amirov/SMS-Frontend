import { useState } from 'react';
import { useCreateDeviceMutation, useGetDevicesQuery, useResetDeviceCodeMutation, useRevokeDeviceMutation } from '../../api/endpoints/deviceApi';
import { IconCopy, IconDevice, IconPlus } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/FormFields';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { ErrorState, Skeleton } from '../../components/ui/states';
import { useToast } from '../../features/ui/useToast';
import { formatRelative } from '../../lib/format';
import { deviceStatusLabel, deviceStatusTone } from '../../lib/labels';
import type { Device, DeviceCreated } from '../../types';

export function DevicesPage() {
  const toast = useToast();
  const { data, isLoading, isError } = useGetDevicesQuery();
  const [createDevice, { isLoading: creating }] = useCreateDeviceMutation();
  const [resetCode] = useResetDeviceCodeMutation();
  const [revokeDevice] = useRevokeDeviceMutation();

  const [name, setName] = useState('');
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [created, setCreated] = useState<DeviceCreated | null>(null);

  const submit = async () => {
    if (!name.trim()) {
      toast('error', 'Qurilma nomini kiriting.');
      return;
    }
    try {
      const res = await createDevice({ name: name.trim(), platform: 'ANDROID' }).unwrap();
      setCreated(res);
      setCreatingOpen(false);
      setName('');
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? 'Xatolik';
      toast('error', msg);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    toast('success', 'Kod nusxalandi.');
  };

  const resetPairing = async (device: Device) => {
    if (!window.confirm(`${device.name} uchun yangi kod yaratiladi va eski ulanish uziladi. Davom etilsinmi?`)) return;
    try {
      setCreated(await resetCode(device._id).unwrap());
      toast('success', 'Yangi juftlash kodi yaratildi.');
    } catch {
      toast('error', 'Kod yangilanmadi.');
    }
  };

  const revoke = async (device: Device) => {
    if (!window.confirm(`${device.name} bloklansinmi?`)) return;
    try {
      await revokeDevice(device._id).unwrap();
      toast('success', 'Qurilma bloklandi.');
    } catch {
      toast('error', 'Qurilma bloklanmadi.');
    }
  };

  const device = data?.list[0];

  return (
    <>
      <PageHeader
        title="Yuboruvchi telefon"
        subtitle="TezkorSMS hisobiga bitta Android telefon ulanadi."
        actions={!device && !isLoading ? (
          <Button variant="primary" iconLeft={<IconPlus width={18} height={18} />} onClick={() => setCreatingOpen(true)}>
            Telefonni ulash
          </Button>
        ) : undefined}
      />

      {isLoading ? <Skeleton height={220} /> : isError ? (
        <Card><ErrorState message="Telefon holatini yuklab bo‘lmadi." /></Card>
      ) : device ? (
        <Card title={device.name} actions={<StatusPill tone={deviceStatusTone[device.status]} label={deviceStatusLabel[device.status]} />}>
          <div className="detail-grid">
            <div className="detail-item"><div className="l">Faol SIM</div><div className="v">{device.simCarrier ? `SIM ${Number(device.simSlotIndex ?? 0) + 1} · ${device.simCarrier}` : 'Tanlanmagan'}</div></div>
            <div className="detail-item"><div className="l">Batareya</div><div className="v">{device.batteryLevel != null ? `${device.batteryLevel}%` : '—'}</div></div>
            <div className="detail-item"><div className="l">Tarmoq</div><div className="v">{device.networkType || '—'}</div></div>
            <div className="detail-item"><div className="l">Oxirgi aloqa</div><div className="v">{device.lastSeenAt ? formatRelative(device.lastSeenAt) : 'Hali ulanmagan'}</div></div>
          </div>
          {!device.pairedAt && device.status !== 'BLOCKED' ? (
            <div className="state-block" style={{ marginTop: 18 }}>
              <p className="muted" style={{ margin: 0 }}>Bu kodni TezkorSMS mobil ilovasiga kiriting:</p>
              <button className="code-pill" onClick={() => copyCode(device.code)}>{device.code}<IconCopy /></button>
            </div>
          ) : null}
          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 18 }}>
            <Button size="sm" onClick={() => resetPairing(device)}>{device.status === 'BLOCKED' ? 'Qayta ulash' : 'Telefonni almashtirish'}</Button>
            {device.status !== 'BLOCKED' && <Button size="sm" variant="danger" onClick={() => revoke(device)}>Ulanishni uzish</Button>}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="state-block">
            <div className="state-block__icon"><IconDevice /></div>
            <div className="state-block__title">Yuboruvchi telefon ulanmagan</div>
            <p className="muted">Android telefon yarating, keyin berilgan kodni mobile ilovaga kiriting.</p>
            <Button variant="primary" onClick={() => setCreatingOpen(true)}>Telefonni ulash</Button>
          </div>
        </Card>
      )}

      <Modal
        open={creatingOpen}
        title="Yuboruvchi telefonni ulash"
        onClose={() => setCreatingOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreatingOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" loading={creating} onClick={submit}>
              Kod yaratish
            </Button>
          </>
        }
      >
        <p className="muted" style={{ marginTop: 0 }}>
          Bir martalik juftlash kodi yaratiladi. Uni TezkorSMS mobil ilovasiga kiriting.
        </p>
        <Input label="Telefon nomi" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan: Ofis Samsung" />
      </Modal>

      <Modal open={!!created} title="Telefonni mobile ilovaga ulang" onClose={() => setCreated(null)}>
        <div className="state-block" style={{ padding: '12px 0 4px' }}>
          <div className="state-block__icon">
            <IconDevice />
          </div>
          <div className="state-block__title">{created?.name}</div>
          <p className="muted" style={{ margin: 0 }}>
            Quyidagi juftlash kodini mobil ilovaga kiriting:
          </p>
          <button className="code-pill" onClick={() => created && copyCode(created.code)}>
            {created?.code}
            <IconCopy />
          </button>
        </div>
      </Modal>
    </>
  );
}
