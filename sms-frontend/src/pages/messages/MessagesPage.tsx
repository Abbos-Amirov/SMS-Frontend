import { useState, useCallback } from 'react';
import type { MessageSearchForm } from './types';
import { MessagesFilterCard } from './components/MessagesFilterCard';
import { MessagesListToolbar } from './components/MessagesListToolbar';

const DEFAULT_FORM: MessageSearchForm = {
  server: 'Barchasi',
  status: 'Yuborilmadi',
  type: 'All',
  rowLimit: 50,
  mobile: '',
  messageText: '',
  dateFrom: '2022-03-12',
  dateUntil: '2023-03-19',
};

/** Xabarlar — filter paneli va ro‘yxat boshqaruvlari (demo; API ulanadi). */
export default function MessagesPage() {
  const [form, setForm] = useState<MessageSearchForm>(DEFAULT_FORM);
  const [pageSelect, setPageSelect] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  /** Hozircha bo‘sh ro‘yxat — rasmdagidek */
  const hasRows = false;

  const patchForm = useCallback((patch: Partial<MessageSearchForm>) => {
    setForm((f) => ({ ...f, ...patch }));
  }, []);

  const noop = () => undefined;

  return (
    <div className="page messages-page">
      <div className="messages-page__bar">
        <h1 className="messages-page__bar-title">
          Xabarlar
          {!hasRows ? <span className="messages-page__bar-sub"> (No messages found.)</span> : null}
        </h1>
      </div>

      <MessagesFilterCard
        form={form}
        patchForm={patchForm}
        pageSelect={pageSelect}
        onPageSelectChange={setPageSelect}
        onSearch={noop}
        onExport={noop}
        onResend={noop}
        onDelete={noop}
      />

      <section className="messages-list-card">
        <MessagesListToolbar
          selectAll={selectAll}
          onSelectAllChange={setSelectAll}
          onRefresh={noop}
        />
      </section>
    </div>
  );
}
