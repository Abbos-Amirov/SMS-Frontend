import { useMemo, useState } from 'react';
import {
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useGetTemplatesQuery,
  useUpdateTemplateMutation,
} from '../../api/endpoints/templateApi';
import { IconEdit, IconPlus, IconTrash } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable, Pagination, type Column } from '../../components/ui/DataTable';
import { Input, Textarea } from '../../components/ui/FormFields';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { useToast } from '../../features/ui/useToast';
import { formatDate } from '../../lib/format';
import type { Template } from '../../types';

const LIMIT = 20;
interface EditState {
  id?: string;
  name: string;
  body: string;
}

export function TemplatesPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ page, limit: LIMIT }), [page]);
  const { data, isLoading, isError } = useGetTemplatesQuery(params);

  const [createTemplate, { isLoading: creating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: updating }] = useUpdateTemplateMutation();
  const [deleteTemplate, { isLoading: deleting }] = useDeleteTemplateMutation();

  const [edit, setEdit] = useState<EditState | null>(null);
  const [toDelete, setToDelete] = useState<Template | null>(null);

  const save = async () => {
    if (!edit || !edit.name.trim() || !edit.body.trim()) {
      toast('error', 'Nom va matn majburiy.');
      return;
    }
    try {
      if (edit.id) {
        await updateTemplate({ id: edit.id, data: { name: edit.name, body: edit.body } }).unwrap();
        toast('success', 'Shablon yangilandi.');
      } else {
        await createTemplate({ name: edit.name, body: edit.body }).unwrap();
        toast('success', 'Shablon qo‘shildi.');
      }
      setEdit(null);
    } catch {
      toast('error', 'Saqlashda xatolik.');
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    try {
      await deleteTemplate(toDelete._id).unwrap();
      toast('success', 'Shablon o‘chirildi.');
      setToDelete(null);
    } catch {
      toast('error', 'O‘chirishda xatolik.');
    }
  };

  const columns: Column<Template>[] = [
    { key: 'name', header: 'Nomi', render: (t) => <strong>{t.name}</strong> },
    {
      key: 'body',
      header: 'Matn',
      render: (t) => (
        <span className="muted" style={{ display: 'inline-block', maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {t.body}
        </span>
      ),
    },
    { key: 'createdAt', header: 'Sana', render: (t) => <span className="muted">{formatDate(t.createdAt)}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (t) => (
        <span className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="icon-btn" onClick={() => setEdit({ id: t._id, name: t.name, body: t.body })} aria-label="Tahrirlash">
            <IconEdit width={18} height={18} />
          </button>
          <button className="icon-btn icon-btn--danger" onClick={() => setToDelete(t)} aria-label="O‘chirish">
            <IconTrash width={18} height={18} />
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Shablonlar"
        subtitle="Tez-tez ishlatiladigan SMS matnlari."
        actions={
          <Button variant="primary" iconLeft={<IconPlus width={18} height={18} />} onClick={() => setEdit({ name: '', body: '' })}>
            Yangi shablon
          </Button>
        }
      />
      <Card bodyless>
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(t) => t._id}
          loading={isLoading}
          error={isError}
          emptyTitle="Shablon yo‘q"
          emptyMessage="Birinchi shabloningizni yarating."
        />
        {data && data.total > 0 && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
      </Card>

      <Modal
        open={!!edit}
        title={edit?.id ? 'Shablonni tahrirlash' : 'Yangi shablon'}
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
            <Input label="Nomi" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            <Textarea label="Matn" rows={5} value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} />
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Shablonni o‘chirish"
        message={`"${toDelete?.name}" o‘chirilsinmi?`}
        confirmLabel="O‘chirish"
        danger
        loading={deleting}
        onConfirm={remove}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
