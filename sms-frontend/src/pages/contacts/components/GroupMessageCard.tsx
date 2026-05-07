import { useState, useMemo, useEffect } from 'react';
import { ContactsPanel } from './ContactsPanel';
import type { ContactGroupOption } from '../types';

type GroupMessageCardProps = {
  groups: ContactGroupOption[];
  serverTags: string[];
};

function InfoHint() {
  return (
    <span className="contacts-hint-icon" title="Qo‘shimcha maʼlumot" aria-label="Qo‘shimcha">
      ⓘ
    </span>
  );
}

export function GroupMessageCard({ groups, serverTags }: GroupMessageCardProps) {
  const selectable = useMemo(() => groups.filter((g) => g.id !== 'g_all'), [groups]);
  const [groupMsgId, setGroupMsgId] = useState(() => selectable[0]?.id ?? '');
  const [servers, setServers] = useState(serverTags.slice(0, 1));
  const [schedule, setSchedule] = useState(false);
  const [priority, setPriority] = useState(false);
  const [body, setBody] = useState('');

  useEffect(() => {
    if (selectable.some((g) => g.id === groupMsgId)) return;
    setGroupMsgId(selectable[0]?.id ?? '');
  }, [selectable, groupMsgId]);

  return (
    <ContactsPanel title="Kontaktlar guruhiga xabar yuborish">
      <div className="contacts-message-form">
        <label className="contacts-stack">
          <span className="contacts-stack__label">Kontaktlar guruhi:</span>
          <select className="contacts-select" value={groupMsgId} onChange={(e) => setGroupMsgId(e.target.value)}>
            {selectable.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </label>

        <label className="contacts-stack">
          <span className="contacts-stack__label">Server:</span>
          <div className="contacts-tags-input">
            {servers.map((t) => (
              <button
                key={t}
                type="button"
                className="contacts-tag"
                onClick={() => setServers((s) => s.filter((x) => x !== t))}
              >
                {t} ✕
              </button>
            ))}
            <select
              className="contacts-tag-select"
              value=""
              onChange={(e) => {
                const v = e.target.value;
                if (v && !servers.includes(v)) setServers((s) => [...s, v]);
                e.target.value = '';
              }}
            >
              <option value="">Server qo‘shish...</option>
              {serverTags
                .filter((t) => !servers.includes(t))
                .map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
          </div>
        </label>

        <label className="contacts-check contacts-check--inline">
          <input type="checkbox" checked={schedule} onChange={(e) => setSchedule(e.target.checked)} />
          <span>Rejalashtirish</span>
          <InfoHint />
        </label>

        <label className="contacts-stack">
          <span className="contacts-stack__label">Matn:</span>
          <textarea className="contacts-textarea" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
        </label>

        <label className="contacts-check contacts-check--inline contacts-check--bottom">
          <input type="checkbox" checked={priority} onChange={(e) => setPriority(e.target.checked)} />
          <span>Navbatsiz</span>
          <InfoHint />
        </label>
      </div>
    </ContactsPanel>
  );
}
