import { useCallback, useMemo, useState } from 'react';
import type { AutoReplyRule, AutoReplySortKey } from './types';
import { AUTO_REPLY_CONDITIONS } from './types';
import { AutoReplyAddCard } from './components/AutoReplyAddCard';
import { AutoReplyListCard } from './components/AutoReplyListCard';

let idSeed = 0;

const DEFAULT_ADD = {
  triggerMessage: '',
  replyBody: '',
  conditionLabel: AUTO_REPLY_CONDITIONS[0] ?? '',
};

function filterBySearch(rows: AutoReplyRule[], search: string): AutoReplyRule[] {
  const q = search.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) =>
      r.triggerMessage.toLowerCase().includes(q) ||
      r.replyBody.toLowerCase().includes(q) ||
      r.conditionLabel.toLowerCase().includes(q)
  );
}

function sortRows(
  rows: AutoReplyRule[],
  sortKey: AutoReplySortKey,
  sortDir: 'asc' | 'desc'
): AutoReplyRule[] {
  const m = sortDir === 'asc' ? 1 : -1;
  const out = [...rows];
  out.sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'allowed') {
      cmp = Number(a.allowed) - Number(b.allowed);
    } else if (sortKey === 'trigger') {
      cmp = a.triggerMessage.localeCompare(b.triggerMessage, 'uz');
    } else if (sortKey === 'reply') {
      cmp = a.replyBody.localeCompare(b.replyBody, 'uz');
    } else {
      cmp = a.conditionLabel.localeCompare(b.conditionLabel, 'uz');
    }
    return cmp * m;
  });
  return out;
}

/** Avto javob — qo‘shish formasi va tartiblangan jadval (holat sahifada; API keyin ulanishi mumkin). */
export default function AutoReplyPage() {
  const [items, setItems] = useState<AutoReplyRule[]>([]);
  const [addForm, setAddForm] = useState(DEFAULT_ADD);

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [sortKey, setSortKey] = useState<AutoReplySortKey>('trigger');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const patchAdd = useCallback((p: Partial<typeof DEFAULT_ADD>) => {
    setAddForm((f) => ({ ...f, ...p }));
  }, []);

  const onSortColumn = useCallback(
    (key: AutoReplySortKey) => {
      setSortKey((prevKey) => {
        if (prevKey !== key) {
          setSortDir('asc');
          return key;
        }
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prevKey;
      });
    },
    []
  );

  const filtered = useMemo(() => filterBySearch(items, search), [items, search]);
  const sorted = useMemo(() => sortRows(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(startIdx, startIdx + pageSize);
  const startN = sorted.length === 0 ? 0 : startIdx + 1;
  const endN = Math.min(startIdx + pageRows.length, sorted.length);

  const allOnPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllPage = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = pageRows.length > 0 && pageRows.every((r) => next.has(r.id));
      if (allSelected) {
        pageRows.forEach((r) => next.delete(r.id));
      } else {
        pageRows.forEach((r) => next.add(r.id));
      }
      return next;
    });
  }, [pageRows]);

  const handleAdd = () => {
    const t = addForm.triggerMessage.trim();
    const b = addForm.replyBody.trim();
    if (!t || !b) return;
    idSeed += 1;
    const row: AutoReplyRule = {
      id: `ar_${idSeed}`,
      triggerMessage: t,
      replyBody: b,
      conditionLabel: addForm.conditionLabel,
      allowed: true,
    };
    setItems((prev) => [...prev, row]);
    setAddForm({ ...DEFAULT_ADD, conditionLabel: addForm.conditionLabel });
    setPage(1);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setItems((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(pageCount, p + 1));

  const onPageSizeChange = (n: number) => {
    setPageSize(n);
    setPage(1);
  };

  const onSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <div className="page auto-reply-page">
      <AutoReplyAddCard
        form={addForm}
        conditions={AUTO_REPLY_CONDITIONS}
        onPatch={patchAdd}
        onSubmit={handleAdd}
      />

      <AutoReplyListCard
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        search={search}
        onSearchChange={onSearchChange}
        pageRows={pageRows}
        selectedIds={selectedIds}
        allOnPageSelected={allOnPageSelected}
        onToggleAllPage={toggleAllPage}
        onToggleRow={toggleRow}
        onDeleteSelected={handleDeleteSelected}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortColumn={onSortColumn}
        pagination={{
          total: sorted.length,
          start: startN,
          end: endN,
          page: safePage,
          pageCount,
          onPrev,
          onNext,
        }}
      />
    </div>
  );
}
