import { useMemo, useState } from 'react';
import {
  useCreateAutoReplyMutation,
  useDeleteAutoReplyMutation,
  useGetAutoRepliesQuery,
  useUpdateAutoReplyMutation,
} from '../../api/endpoints/autoReplyApi';
import { IconEdit, IconPlus, IconTrash } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable, Pagination, type Column } from '../../components/ui/DataTable';
import { Input, Select, Textarea } from '../../components/ui/FormFields';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { useToast } from '../../features/ui/useToast';
import { autoReplyMatchLabel } from '../../lib/labels';
import type { AutoReply, AutoReplyMatchType } from '../../types';

const LIMIT = 20;
interface EditState {
  id?: string;
  triggerText: string;
  replyBody: string;
  matchType: AutoReplyMatchType;
  enabled: boolean;
}
const EMPTY: EditState = { triggerText: '', replyBody: '', matchType: 'CONTAINS', enabled: true };

export function AutoReplyPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ page, limit: LIMIT }), [page]);
  const { data, isLoading, isError } = useGetAutoRepliesQuery(params);

  const [createRule, { isLoading: creating }] = useCreateAutoReplyMutation();
  const [updateRule, { isLoading: updating }] = useUpdateAutoReplyMutation();
  const [deleteRule, { isLoading: deleting }] = useDeleteAutoReplyMutation();

  const [edit, setEdit] = useState<EditState | null>(null);
  const [toDelete, setToDelete] = useState<AutoReply | null>(null);

  const save = async () => {
    if (!edit || !edit.triggerText.trim() || !edit.replyBody.trim()) {
      toast('error', 'Trigger va javob matni majburiy.');
      return;
    }
    const payload = {
      triggerText: edit.triggerText,
      replyBody: edit.replyBody,
      matchType: edit.matchType,
      enabled: edit.enabled,
    };
    try {
      if (edit.id) {
        await updateRule({ id: edit.id, data: payload }).unwrap();
        toast('success', 'Qoida yangilandi.');
      } else {
        await createRule(payload).unwrap();
        toast('success', 'Qoida qo‘shildi.');
      }
      setEdit(null);
    } catch {
      toast('error', 'Saqlashda xatolik.');
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    try {
      await deleteRule(toDelete._id).unwrap();
      toast('success', 'Qoida o‘chirildi.');
      setToDelete(null);
    } catch {
      toast('error', 'O‘chirishda xatolik.');
    }
  };

  const columns: Column<AutoReply>[] = [
    { key: 'triggerText', header: 'Trigger', render: (r) => <strong>{r.triggerText}</strong> },
    {
      key: 'replyBody',
      header: 'Javob',
      render: (r) => (
        <span className="muted" style={{ display: 'inline-block', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.replyBody}
        </span>
      ),
    },
    { key: 'matchType', header: 'Moslik', render: (r) => autoReplyMatchLabel[r.matchType] },
    {
      key: 'enabled',
      header: 'Holat',
      render: (r) => <StatusPill tone={r.enabled ? 'success' : 'neutral'} label={r.enabled ? 'Yoqilgan' : 'O‘chiq'} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        <span className="row" style={{ justifyContent: 'flex-end' }}>
          <button
            className="icon-btn"
            onClick={() => setEdit({ id: r._id, triggerText: r.triggerText, replyBody: r.replyBody, matchType: r.matchType, enabled: r.enabled })}
            aria-label="Tahrirlash"
          >
            <IconEdit width={18} height={18} />
          </button>
          <button className="icon-btn icon-btn--danger" onClick={() => setToDelete(r)} aria-label="O‘chirish">
            <IconTrash width={18} height={18} />
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Avto-javob"
        subtitle="Kiruvchi xabarlarga avtomatik javob qoidalari."
        actions={
          <Button variant="primary" iconLeft={<IconPlus width={18} height={18} />} onClick={() => setEdit({ ...EMPTY })}>
            Yangi qoida
          </Button>
        }
      />

      <div className="form-banner" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}>
        Eslatma: avto-javob ijrosi (kiruvchi SMS) keyingi bosqichda yoqiladi. Hozircha qoidalarni sozlashingiz mumkin.
      </div>

      <Card bodyless>
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(r) => r._id}
          loading={isLoading}
          error={isError}
          emptyTitle="Qoida yo‘q"
          emptyMessage="Birinchi avto-javob qoidasini yarating."
        />
        {data && data.total > 0 && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
      </Card>

      <Modal
        open={!!edit}
        title={edit?.id ? 'Qoidani tahrirlash' : 'Yangi qoida'}
        onClose={() => setEdit(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEdit(null)}>Bekor qilish</Button>
            <Button variant="primary" loading={creating || updating} onClick={save}>Saqlash</Button>
          </>
        }
      >
        {edit && (
          <>
            <Input
              label="Kalit so‘z"
              value={edit.triggerText}
              onChange={(e) => setEdit({ ...edit, triggerText: e.target.value })}
              placeholder="Masalan: STOP"
            />
            <Textarea
              label="Javob matni"
              rows={3}
              value={edit.replyBody}
              onChange={(e) => setEdit({ ...edit, replyBody: e.target.value })}
            />
            <Select
              label="Moslik turi"
              value={edit.matchType}
              onChange={(e) => setEdit({ ...edit, matchType: e.target.value as AutoReplyMatchType })}
              options={[
                { value: 'CONTAINS', label: 'Ichida bor' },
                { value: 'EXACT', label: 'Aniq mos' },
                { value: 'PREFIX', label: 'Boshlanishi' },
              ]}
            />
            <label className="row" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                className="table-checkbox"
                checked={edit.enabled}
                onChange={(e) => setEdit({ ...edit, enabled: e.target.checked })}
              />
              Qoida yoqilgan
            </label>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Qoidani o‘chirish"
        message={`"${toDelete?.triggerText}" qoidasi o‘chirilsinmi?`}
        confirmLabel="O‘chirish"
        danger
        loading={deleting}
        onConfirm={remove}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
