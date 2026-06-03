import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCampaignMutation } from '../../api/endpoints/campaignApi';
import { useGetContactsQuery } from '../../api/endpoints/contactApi';
import { useGetMySubscriptionQuery } from '../../api/endpoints/subscriptionApi';
import { useGetTemplatesQuery } from '../../api/endpoints/templateApi';
import { useGetContactGroupsQuery } from '../../api/endpoints/contactGroupApi';
import { IconCredit } from '../../components/icons/UiIcons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/FormFields';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState, Skeleton } from '../../components/ui/states';
import { useToast } from '../../features/ui/useToast';
import { useDebouncedValue } from '../../lib/useDebouncedValue';

type RecipientMode = 'contacts' | 'groups' | 'phones';
type ScheduleMode = 'now' | 'later';

export function CampaignCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();

  const { data: sub, isLoading: subLoading } = useGetMySubscriptionQuery();
  const [createCampaign, { isLoading: creating }] = useCreateCampaignMutation();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<RecipientMode>('contacts');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [phones, setPhones] = useState('');
  const [schedule, setSchedule] = useState<ScheduleMode>('now');
  const [scheduledAt, setScheduledAt] = useState('');

  const [contactSearch, setContactSearch] = useState('');
  const debounced = useDebouncedValue(contactSearch);
  const { data: contacts, isLoading: contactsLoading } = useGetContactsQuery({
    page: 1,
    limit: 100,
    search: { text: debounced || undefined, status: 'ACTIVE' },
  });
  const { data: templates } = useGetTemplatesQuery({ page: 1, limit: 100 });
  const { data: groups = [] } = useGetContactGroupsQuery();

  const phoneList = useMemo(
    () => phones.split(/[\n,;]+/).map((p) => p.trim()).filter(Boolean),
    [phones],
  );
  const recipientCount = mode === 'contacts' ? selected.size : mode === 'groups' ? selectedGroups.size : phoneList.length;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleGroup = (id: string) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submit = async () => {
    if (!title.trim() || !message.trim()) {
      toast('error', 'Sarlavha va matn majburiy.');
      return;
    }
    if (recipientCount === 0) {
      toast('error', 'Kamida bitta qabul qiluvchi tanlang.');
      return;
    }
    if (schedule === 'later' && !scheduledAt) {
      toast('error', 'Yuborish vaqtini tanlang.');
      return;
    }
    try {
      const res = await createCampaign({
        title: title.trim(),
        message: message.trim(),
        sendNow: schedule === 'now',
        scheduledAt: schedule === 'later' ? new Date(scheduledAt).toISOString() : undefined,
        contactIds: mode === 'contacts' ? Array.from(selected) : undefined,
        groupIds: mode === 'groups' ? Array.from(selectedGroups) : undefined,
        phones: mode === 'phones' ? phoneList : undefined,
      }).unwrap();
      toast('success', schedule === 'now' ? 'Xabar yuborildi.' : 'Xabar rejalashtirildi.');
      navigate(`/campaigns/${res._id}`);
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? 'Xatolik';
      toast('error', msg);
    }
  };

  if (subLoading) return <Skeleton height={200} />;

  if (!sub || sub.status !== 'ACTIVE') {
    return (
      <>
        <PageHeader title="Yangi xabar" />
        <Card>
          <EmptyState
            icon={<IconCredit />}
            title="Faol obuna talab qilinadi"
            message="Xabar yuborish uchun administrator obunani faollashtirishi kerak."
            action={
              <Button variant="ghost" onClick={() => navigate('/subscription')}>
                Obunani ko‘rish
              </Button>
            }
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Yangi xabar" subtitle="Matn, qabul qiluvchilar va yuborish vaqtini belgilang." />

      <div className="stack" style={{ maxWidth: 760 }}>
        <Card title="Xabar matni">
          <Input label="Sarlavha" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Xabar nomi" />
          {templates && templates.list.length > 0 && (
            <Select
              label="Shablondan tanlash (ixtiyoriy)"
              value=""
              placeholder="— shablon tanlang —"
              onChange={(e) => {
                const t = templates.list.find((x) => x._id === e.target.value);
                if (t) setMessage(t.body);
              }}
              options={templates.list.map((t) => ({ value: t._id, label: t.name }))}
            />
          )}
          <Textarea
            label={`Matn (${message.length} belgi)`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="SMS matni..."
            rows={4}
          />
          <p className="muted" style={{ margin: 0 }}>
            Kontakt ismini qo‘shish uchun <strong>{'{{name}}'}</strong>, raqamni qo‘shish uchun <strong>{'{{phone}}'}</strong> yozing.
          </p>
        </Card>

        <Card title="Qabul qiluvchilar" actions={<span className="pill pill--accent">{recipientCount} ta</span>}>
          <div className="toolbar" style={{ marginBottom: 14 }}>
            <Button size="sm" variant={mode === 'contacts' ? 'primary' : 'ghost'} onClick={() => setMode('contacts')}>
              Kontaktlardan
            </Button>
            <Button size="sm" variant={mode === 'phones' ? 'primary' : 'ghost'} onClick={() => setMode('phones')}>
              Raqamlarni kiritish
            </Button>
            <Button size="sm" variant={mode === 'groups' ? 'primary' : 'ghost'} onClick={() => setMode('groups')}>
              Guruhlardan
            </Button>
          </div>

          {mode === 'contacts' ? (
            <>
              <SearchInput value={contactSearch} onChange={setContactSearch} placeholder="Kontakt qidirish..." />
              <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 12 }}>
                {contactsLoading ? (
                  <Skeleton height={120} />
                ) : !contacts?.list.length ? (
                  <p className="muted">Kontakt topilmadi.</p>
                ) : (
                  contacts.list.map((c) => (
                    <label key={c._id} className="row" style={{ padding: '7px 2px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        className="table-checkbox"
                        checked={selected.has(c._id)}
                        onChange={() => toggle(c._id)}
                      />
                      <span>{c.name || '—'}</span>
                      <span className="mono muted">{c.phone}</span>
                    </label>
                  ))
                )}
              </div>
            </>
          ) : mode === 'groups' ? (
            <div className="stack">
              {groups.length === 0 ? <p className="muted">Kontakt guruhi topilmadi.</p> : groups.map((group) => (
                <label key={group._id} className="row" style={{ padding: '7px 2px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    checked={selectedGroups.has(group._id)}
                    onChange={() => toggleGroup(group._id)}
                  />
                  <span>{group.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <Textarea
              label="Telefon raqamlari (har biri yangi qatorda yoki vergul bilan)"
              value={phones}
              onChange={(e) => setPhones(e.target.value)}
              placeholder={'+998901234567\n+821012345678'}
              rows={5}
            />
          )}
        </Card>

        <Card title="Yuborish vaqti">
          <div className="toolbar" style={{ marginBottom: 12 }}>
            <Button size="sm" variant={schedule === 'now' ? 'primary' : 'ghost'} onClick={() => setSchedule('now')}>
              Hozir yuborish
            </Button>
            <Button size="sm" variant={schedule === 'later' ? 'primary' : 'ghost'} onClick={() => setSchedule('later')}>
              Rejalashtirish
            </Button>
          </div>
          {schedule === 'later' && (
            <Input
              type="datetime-local"
              label="Yuborish sanasi va vaqti"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          )}
        </Card>

        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => navigate('/campaigns')}>
            Bekor qilish
          </Button>
          <Button variant="primary" loading={creating} onClick={submit}>
            {schedule === 'now' ? 'Yaratish va yuborish' : 'Rejalashtirish'}
          </Button>
        </div>
      </div>
    </>
  );
}
