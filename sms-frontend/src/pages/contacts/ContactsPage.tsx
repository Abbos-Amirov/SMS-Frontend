import { useMemo, useState } from 'react';
import {
  useCreateContactMutation,
  useDeleteContactMutation,
  useGetContactsQuery,
  useImportContactsMutation,
  useUpdateContactMutation,
} from '../../api/endpoints/contactApi';
import {
  useCreateContactGroupMutation,
  useDeleteContactGroupMutation,
  useGetContactGroupsQuery,
} from '../../api/endpoints/contactGroupApi';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ConfirmDialog, Modal } from '../../components/ui/Modal';
import { Input, Select, TagInput } from '../../components/ui/FormFields';
import { DataTable, Pagination, type Column } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { StatusPill } from '../../components/ui/StatusPill';
import { IconEdit, IconPlus, IconTrash, IconUpload } from '../../components/icons/UiIcons';
import { useToast } from '../../features/ui/useToast';
import { contactStatusLabel, contactStatusTone } from '../../lib/labels';
import { formatDate } from '../../lib/format';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { parseContactsCsv } from '../../lib/csv';
import type { Contact, ContactStatus } from '../../types';

const LIMIT = 20;

interface EditState {
  id?: string;
  name: string;
  phone: string;
  status: ContactStatus;
  tags: string[];
  groupIds: string[];
}

const EMPTY: EditState = { name: '', phone: '', status: 'ACTIVE', tags: [], groupIds: [] };

export function ContactsPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const debounced = useDebouncedValue(searchText);

  const params = useMemo(
    () => ({
      page,
      limit: LIMIT,
      search: { text: debounced || undefined, status: status || undefined, groupId: groupFilter || undefined },
    }),
    [page, debounced, status, groupFilter],
  );
  const { data, isLoading, isError } = useGetContactsQuery(params);
  const { data: groups = [] } = useGetContactGroupsQuery();

  const [createContact, { isLoading: creating }] = useCreateContactMutation();
  const [updateContact, { isLoading: updating }] = useUpdateContactMutation();
  const [deleteContact, { isLoading: deleting }] = useDeleteContactMutation();
  const [importContacts, { isLoading: importing }] = useImportContactsMutation();
  const [createGroup, { isLoading: creatingGroup }] = useCreateContactGroupMutation();
  const [deleteGroup] = useDeleteContactGroupMutation();

  const [edit, setEdit] = useState<EditState | null>(null);
  const [toDelete, setToDelete] = useState<Contact | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importGroupId, setImportGroupId] = useState('');
  const [groupName, setGroupName] = useState('');

  const save = async () => {
    if (!edit) return;
    if (!edit.phone.trim()) {
      toast('error', 'Telefon raqami majburiy.');
      return;
    }
    try {
      const payload = { name: edit.name || undefined, phone: edit.phone, status: edit.status, tags: edit.tags, groupIds: edit.groupIds };
      if (edit.id) {
        await updateContact({ id: edit.id, data: payload }).unwrap();
        toast('success', 'Kontakt yangilandi.');
      } else {
        await createContact(payload).unwrap();
        toast('success', 'Kontakt qo‘shildi.');
      }
      setEdit(null);
    } catch {
      toast('error', 'Saqlashda xatolik.');
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    try {
      await deleteContact(toDelete._id).unwrap();
      toast('success', 'Kontakt o‘chirildi.');
      setToDelete(null);
    } catch {
      toast('error', 'O‘chirishda xatolik.');
    }
  };

  const importCsv = async (file?: File) => {
    if (!file) return;
    try {
      const rows = parseContactsCsv(await file.text());
      const result = await importContacts({ rows, groupIds: importGroupId ? [importGroupId] : undefined }).unwrap();
      setImportErrors(result.errors.map((error) => `${error.row}-qator: ${error.phone} (${error.reason})`));
      toast('success', `${result.created} ta yangi, ${result.updated} ta yangilangan kontakt.`);
      if (!result.errors.length) setImportOpen(false);
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Importda xatolik.');
    }
  };

  const addGroup = async () => {
    if (!groupName.trim()) return;
    try {
      await createGroup({ name: groupName.trim() }).unwrap();
      setGroupName('');
      toast('success', 'Guruh yaratildi.');
    } catch {
      toast('error', 'Guruh yaratilmadi. Nomi takrorlanmaganini tekshiring.');
    }
  };

  const downloadImportTemplate = () => {
    const blob = new Blob(['name,phone,tags\nAli,+998901234567,mijoz;vip\nKim,+821012345678,korea\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<Contact>[] = [
    { key: 'name', header: 'Ism', render: (c) => c.name || <span className="muted">—</span> },
    { key: 'phone', header: 'Telefon', render: (c) => <span className="mono">{c.phone}</span> },
    {
      key: 'groups',
      header: 'Guruhlar',
      render: (c) =>
        c.groupIds?.length
          ? groups.filter((g) => c.groupIds.includes(g._id)).map((g) => <span key={g._id} className="tag-chip">{g.name}</span>)
          : <span className="muted">-</span>,
    },
    {
      key: 'tags',
      header: 'Teglar',
      render: (c) =>
        c.tags.length ? (
          <span className="row" style={{ flexWrap: 'wrap' }}>
            {c.tags.map((t) => (
              <span key={t} className="tag-chip">
                {t}
              </span>
            ))}
          </span>
        ) : (
          <span className="muted">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (c) => <StatusPill tone={contactStatusTone[c.status]} label={contactStatusLabel[c.status]} />,
    },
    { key: 'createdAt', header: 'Qo‘shilgan', render: (c) => <span className="muted">{formatDate(c.createdAt)}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (c) => (
        <span className="row" style={{ justifyContent: 'flex-end' }}>
          <button
            className="icon-btn"
            onClick={() => setEdit({ id: c._id, name: c.name ?? '', phone: c.phone, status: c.status, tags: c.tags, groupIds: c.groupIds ?? [] })}
            aria-label="Tahrirlash"
          >
            <IconEdit width={18} height={18} />
          </button>
          <button className="icon-btn icon-btn--danger" onClick={() => setToDelete(c)} aria-label="O‘chirish">
            <IconTrash width={18} height={18} />
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Kontaktlar"
        subtitle="Kampaniyalar uchun telefon raqamlari bazasi."
        actions={
          <span className="row">
            <Button iconLeft={<IconUpload width={18} height={18} />} onClick={() => { setImportErrors([]); setImportOpen(true); }}>
              Excel / CSV import
            </Button>
            <Button variant="primary" iconLeft={<IconPlus width={18} height={18} />} onClick={() => setEdit({ ...EMPTY })}>
              Yangi kontakt
            </Button>
          </span>
        }
      />

      <Card title="Kontakt guruhlari">
        <div className="toolbar">
          <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Masalan: VIP mijozlar" />
          <Button loading={creatingGroup} onClick={addGroup}>Guruh yaratish</Button>
        </div>
        <div className="row" style={{ flexWrap: 'wrap', marginTop: 12 }}>
          {groups.map((group) => (
            <span key={group._id} className="tag-chip">
              {group.name}
              <button type="button" onClick={() => deleteGroup(group._id)} aria-label="Guruhni o‘chirish">×</button>
            </span>
          ))}
        </div>
      </Card>

      <Card bodyless>
        <div className="card__body" style={{ paddingBottom: 0 }}>
          <div className="toolbar" style={{ marginBottom: 16 }}>
            <SearchInput value={searchText} onChange={(v) => { setSearchText(v); setPage(1); }} placeholder="Ism yoki telefon..." />
            <select
              className="field__select"
              style={{ maxWidth: 180 }}
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">Barcha holatlar</option>
              <option value="ACTIVE">Faol</option>
              <option value="ARCHIVED">Arxivlangan</option>
            </select>
            <select
              className="field__select"
              style={{ maxWidth: 200 }}
              value={groupFilter}
              onChange={(e) => { setGroupFilter(e.target.value); setPage(1); }}
            >
              <option value="">Barcha guruhlar</option>
              {groups.map((group) => <option key={group._id} value={group._id}>{group.name}</option>)}
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={data?.list ?? []}
          rowKey={(c) => c._id}
          loading={isLoading}
          error={isError}
          emptyTitle="Kontakt yo‘q"
          emptyMessage="Birinchi kontaktingizni qo‘shing."
        />
        {data && data.total > 0 && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />}
      </Card>

      <Modal
        open={!!edit}
        title={edit?.id ? 'Kontaktni tahrirlash' : 'Yangi kontakt'}
        onClose={() => setEdit(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEdit(null)}>
              Bekor qilish
            </Button>
            <Button variant="primary" loading={creating || updating} onClick={save}>
              Saqlash
            </Button>
          </>
        }
      >
        {edit && (
          <>
            <Input label="Ism" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            <Input
              label="Telefon *"
              value={edit.phone}
              onChange={(e) => setEdit({ ...edit, phone: e.target.value })}
              placeholder="+998... yoki +82..."
            />
            <Select
              label="Holat"
              value={edit.status}
              onChange={(e) => setEdit({ ...edit, status: e.target.value as ContactStatus })}
              options={[
                { value: 'ACTIVE', label: 'Faol' },
                { value: 'ARCHIVED', label: 'Arxivlangan' },
              ]}
            />
            <TagInput label="Teglar" value={edit.tags} onChange={(tags) => setEdit({ ...edit, tags })} />
            <div className="field">
              <span className="field__label">Guruhlar</span>
              {groups.map((group) => (
                <label key={group._id} className="row">
                  <input
                    type="checkbox"
                    checked={edit.groupIds.includes(group._id)}
                    onChange={() => setEdit({
                      ...edit,
                      groupIds: edit.groupIds.includes(group._id)
                        ? edit.groupIds.filter((id) => id !== group._id)
                        : [...edit.groupIds, group._id],
                    })}
                  />
                  {group.name}
                </label>
              ))}
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Kontaktni o‘chirish"
        message={`"${toDelete?.name || toDelete?.phone}" o‘chirilsinmi?`}
        confirmLabel="O‘chirish"
        danger
        loading={deleting}
        onConfirm={remove}
        onClose={() => setToDelete(null)}
      />

      <Modal open={importOpen} title="Kontaktlarni Excel orqali import qilish" onClose={() => setImportOpen(false)}>
        <p className="muted">
          Excel faylni CSV UTF-8 formatida saqlang. Ustunlar: <strong>name, phone, tags</strong>.
          Teglarni nuqtali vergul bilan ajrating.
        </p>
        <Button size="sm" onClick={downloadImportTemplate}>CSV namuna yuklab olish</Button>
        <Select
          label="Import qilinadigan guruh (ixtiyoriy)"
          value={importGroupId}
          onChange={(event) => setImportGroupId(event.target.value)}
          placeholder="Guruhsiz import"
          options={groups.map((group) => ({ value: group._id, label: group.name }))}
        />
        <Input type="file" accept=".csv,text/csv" disabled={importing} onChange={(event) => importCsv(event.target.files?.[0])} />
        {importErrors.length > 0 && (
          <div className="field__error">
            {importErrors.slice(0, 10).map((error) => <div key={error}>{error}</div>)}
          </div>
        )}
      </Modal>
    </>
  );
}
