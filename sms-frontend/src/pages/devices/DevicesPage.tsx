import { useState } from 'react';
import { useCreateDeviceMutation, useGetDevicesQuery, useResetDeviceCodeMutation, useRevokeDeviceMutation } from '../../api/endpoints/deviceApi';
import { IconCopy, IconDevice, IconPlus } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Input } from '../../components/ui/FormFields';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
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

  const columns: Column<Device>[] = [
    { key: 'name', header: 'Nomi', render: (d) => <strong>{d.name}</strong> },
    {
      key: 'status',
      header: 'Holat',
      render: (d) => <StatusPill tone={deviceStatusTone[d.status]} label={deviceStatusLabel[d.status]} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (d) => (
        <span className="row" style={{ justifyContent: 'flex-end' }}>
          <Button size="sm" onClick={() => resetPairing(d)}>Yangi kod</Button>
          {d.status !== 'BLOCKED' && <Button size="sm" variant="danger" onClick={() => revoke(d)}>Bloklash</Button>}
        </span>
      ),
    },
    {
      key: 'battery',
      header: 'Batareya',
      render: (d) => (d.batteryLevel != null ? `${d.batteryLevel}%` : <span className="muted">—</span>),
    },
    { key: 'network', header: 'Tarmoq', render: (d) => d.networkType || <span className="muted">—</span> },
    { key: 'limit', header: 'Limit/min', render: (d) => d.sendLimitPerMinute },
    {
      key: 'lastSeenAt',
      header: 'Oxirgi faollik',
      render: (d) => <span className="muted">{d.lastSeenAt ? formatRelative(d.lastSeenAt) : 'hech qachon'}</span>,
    },
    {
      key: 'code',
      header: 'Kod',
      render: (d) =>
        d.status === 'OFFLINE' && !d.pairedAt ? (
          <span className="mono">{d.code}</span>
        ) : (
          <span className="muted">ulangan</span>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Qurilmalar"
        subtitle="SMS yuboruvchi Android qurilmalarni boshqaring."
        actions={
          <Button variant="primary" iconLeft={<IconPlus width={18} height={18} />} onClick={() => setCreatingOpen(true)}>
            Qurilma qo‘shish
          </Button>
        }
      />

      <Card bodyless>
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(d) => d._id}
          loading={isLoading}
          error={isError}
          emptyTitle="Qurilma yo‘q"
          emptyMessage="Qurilma qo‘shing va mobil ilovada juftlash kodini kiriting."
        />
      </Card>

      <Modal
        open={creatingOpen}
        title="Yangi qurilma"
        onClose={() => setCreatingOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreatingOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" loading={creating} onClick={submit}>
              Yaratish
            </Button>
          </>
        }
      >
        <p className="muted" style={{ marginTop: 0 }}>
          Qurilma yaratilgach, bir martalik juftlash kodi beriladi. Uni mobil ilovaga kiriting.
        </p>
        <Input label="Qurilma nomi" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan: Samsung-1" />
      </Modal>

      <Modal open={!!created} title="Qurilma yaratildi" onClose={() => setCreated(null)}>
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
