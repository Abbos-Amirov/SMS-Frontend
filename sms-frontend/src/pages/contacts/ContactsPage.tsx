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
  useUpdateContactGroupMutation,
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
import type { Contact, ContactGroup, ContactStatus } from '../../types';

const LIMIT = 20;

const GROUP_COLORS = ['#4d8cff', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#ec4899', '#64748b'];

interface GroupEdit {
  id?: string;
  name: string;
  description: string;
  color: string;
}

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
  const [updateGroup, { isLoading: updatingGroup }] = useUpdateContactGroupMutation();
  const [deleteGroup, { isLoading: deletingGroup }] = useDeleteContactGroupMutation();

  const [edit, setEdit] = useState<EditState | null>(null);
  const [toDelete, setToDelete] = useState<Contact | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importGroupId, setImportGroupId] = useState('');
  const [groupEdit, setGroupEdit] = useState<GroupEdit | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<ContactGroup | null>(null);

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

  const saveGroup = async () => {
    if (!groupEdit) return;
    if (!groupEdit.name.trim()) {
      toast('error', 'Guruh nomini kiriting.');
      return;
    }
    const payload = {
      name: groupEdit.name.trim(),
      description: groupEdit.description.trim() || undefined,
      color: groupEdit.color,
    };
    try {
      if (groupEdit.id) {
        await updateGroup({ id: groupEdit.id, data: payload }).unwrap();
        toast('success', 'Guruh yangilandi.');
      } else {
        await createGroup(payload).unwrap();
        toast('success', 'Guruh yaratildi.');
      }
      setGroupEdit(null);
    } catch {
      toast('error', 'Guruh saqlanmadi. Nomi takrorlanmaganini tekshiring.');
    }
  };

  const removeGroup = async () => {
    if (!groupToDelete) return;
    try {
      await deleteGroup(groupToDelete._id).unwrap();
      toast('success', 'Guruh o‘chirildi.');
      if (groupFilter === groupToDelete._id) setGroupFilter('');
      setGroupToDelete(null);
    } catch {
      toast('error', 'Guruh o‘chirilmadi.');
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
          ? groups.filter((g) => c.groupIds.includes(g._id)).map((g) => (
              <span key={g._id} className="tag-chip">
                <span className="group-dot group-dot--sm" style={{ background: g.color }} />
                {g.name}
              </span>
            ))
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
        subtitle="Xabar yuborish uchun telefon raqamlari bazasi."
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

      <Card
        title="Kontakt guruhlari"
        actions={
          <Button
            size="sm"
            variant="primary"
            iconLeft={<IconPlus width={16} height={16} />}
            onClick={() => setGroupEdit({ name: '', description: '', color: GROUP_COLORS[0] })}
          >
            Yangi guruh
          </Button>
        }
      >
        {groups.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            Hali guruh yo‘q. Kontaktlarni toifalarga ajratib, xabarni butun guruhga yuborish uchun guruh yarating.
          </p>
        ) : (
          <div className="group-list">
            {groups.map((group) => (
              <div key={group._id} className="group-item">
                <span className="group-dot" style={{ background: group.color }} />
                <div className="group-item__main">
                  <div className="group-item__name">
                    {group.name}
                    <span className="muted" style={{ fontWeight: 400 }}> · {group.count ?? 0} ta kontakt</span>
                  </div>
                  {group.description && <div className="muted group-item__desc">{group.description}</div>}
                </div>
                <button
                  className="icon-btn"
                  onClick={() => setGroupEdit({ id: group._id, name: group.name, description: group.description ?? '', color: group.color })}
                  aria-label="Tahrirlash"
                >
                  <IconEdit width={16} height={16} />
                </button>
                <button className="icon-btn icon-btn--danger" onClick={() => setGroupToDelete(group)} aria-label="O‘chirish">
                  <IconTrash width={16} height={16} />
                </button>
              </div>
            ))}
          </div>
        )}
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

      <Modal
        open={!!groupEdit}
        title={groupEdit?.id ? 'Guruhni tahrirlash' : 'Yangi guruh'}
        onClose={() => setGroupEdit(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setGroupEdit(null)}>Bekor qilish</Button>
            <Button variant="primary" loading={creatingGroup || updatingGroup} onClick={saveGroup}>Saqlash</Button>
          </>
        }
      >
        {groupEdit && (
          <>
            <Input
              label="Nomi"
              value={groupEdit.name}
              onChange={(e) => setGroupEdit({ ...groupEdit, name: e.target.value })}
              placeholder="Masalan: VIP mijozlar"
            />
            <Input
              label="Tavsif (ixtiyoriy)"
              value={groupEdit.description}
              onChange={(e) => setGroupEdit({ ...groupEdit, description: e.target.value })}
            />
            <div className="field">
              <span className="field__label">Rang</span>
              <div className="color-swatches">
                {GROUP_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-swatch ${groupEdit.color === color ? 'is-selected' : ''}`}
                    style={{ background: color }}
                    onClick={() => setGroupEdit({ ...groupEdit, color })}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!groupToDelete}
        title="Guruhni o‘chirish"
        message={`"${groupToDelete?.name}" guruhi o‘chiriladi va barcha kontaktlardan olib tashlanadi. Kontaktlarning o‘zi o‘chmaydi. Davom etilsinmi?`}
        confirmLabel="O‘chirish"
        danger
        loading={deletingGroup}
        onConfirm={removeGroup}
        onClose={() => setGroupToDelete(null)}
      />
    </>
  );
}
