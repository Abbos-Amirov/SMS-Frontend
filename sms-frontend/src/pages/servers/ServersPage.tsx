import { useMemo, useState, useCallback } from 'react';
import type { ServerDevice } from './types';
import { DEMO_SERVERS } from './demo-data';
import { ServersManagementCard } from './components/ServersManagementCard';

/** Serverlar ro‘yxatini rasmdagi kabi bloklar bilan ko‘rsatadi. */
export default function ServersPage() {
  const [servers] = useState<ServerDevice[]>(DEMO_SERVERS);
  /** API tayyor bo‘lguncha rasmdagi “yuklanmoqda…” holati; `setLoading(false)` ni fetch dan keyin qo‘ying */
  const [loading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return servers;
    return servers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.model.toLowerCase().includes(q) ||
        s.biosVersiya.toLowerCase().includes(q) ||
        s.dasturVersiyasi.toLowerCase().includes(q)
    );
  }, [servers, search]);

  const effectiveTotal = loading ? 0 : filtered.length;
  const pageCount = Math.max(1, Math.ceil(effectiveTotal / pageSize));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * pageSize;

  const pageRows = loading ? [] : filtered.slice(startIdx, startIdx + pageSize);

  const startN = loading || effectiveTotal === 0 ? 0 : startIdx + 1;
  const endN = loading || effectiveTotal === 0 ? 0 : Math.min(startIdx + pageRows.length, effectiveTotal);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllPage = useCallback(() => {
    if (loading || pageRows.length === 0) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const every = pageRows.every((r) => next.has(r.id));
      if (every) pageRows.forEach((r) => next.delete(r.id));
      else pageRows.forEach((r) => next.add(r.id));
      return next;
    });
  }, [pageRows, loading]);

  const allOnPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));

  const noop = () => undefined;

  return (
    <div className="page servers-page">
      <div className="servers-page__bar">
        <h1 className="servers-page__bar-title">Serverlar</h1>
      </div>

      <ServersManagementCard
        loading={loading}
        rows={pageRows}
        pageSize={pageSize}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        toolbarHandlers={{ onDelete: noop, onAdd: noop }}
        selectedIds={selectedIds}
        onToggleAllPage={toggleAllPage}
        onToggleRow={toggleRow}
        allOnPageSelected={allOnPageSelected}
        pagination={{
          total: effectiveTotal,
          start: startN,
          end: endN,
          page: safePage,
          pageCount,
          onPrev: () => setPage((p) => Math.max(1, p - 1)),
          onNext: () => setPage((p) => Math.min(pageCount, p + 1)),
        }}
      />
    </div>
  );
}
