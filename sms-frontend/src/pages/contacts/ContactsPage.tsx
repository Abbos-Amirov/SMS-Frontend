import { useMemo, useState, useCallback } from 'react';
import type { ContactGroupOption, ContactRecord } from './types';
import { DEMO_CONTACTS, DEMO_GROUPS, DEMO_SERVERS_TAGS } from './demo-data';
import { ContactGroupCreateCard } from './components/ContactGroupCreateCard.tsx';
import { ContactsManagementCard } from './components/ContactsManagementCard.tsx';
import { GroupMessageCard } from './components/GroupMessageCard.tsx';

let groupIdSeed = 2000;

function filterRows(
  rows: ContactRecord[],
  groupId: string,
  search: string
): ContactRecord[] {
  const q = search.trim().toLowerCase();
  return rows.filter((r) => {
    const inGroup = groupId === 'g_all' || r.groupId === groupId;
    if (!inGroup) return false;
    if (!q) return true;
    return r.name.toLowerCase().includes(q) || r.mobile.replace(/\s/g, '').includes(q);
  });
}

/** Kontaktlar sahifasi — layout rasmdagi strukturaga yaqin; holat sahifada (API keyin ulanadi). */
export default function ContactsPage() {
  const [groups, setGroups] = useState<ContactGroupOption[]>(DEMO_GROUPS);
  const rows = DEMO_CONTACTS;
  const [newGroupName, setNewGroupName] = useState('');

  const [selectedGroupId, setSelectedGroupId] = useState('g1002');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1']));

  const filtered = useMemo(
    () => filterRows(rows, selectedGroupId, search),
    [rows, selectedGroupId, search]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(startIdx, startIdx + pageSize);
  const startN = filtered.length === 0 ? 0 : startIdx + 1;
  const endN = Math.min(startIdx + pageRows.length, filtered.length);

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

  const handleCreateGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    groupIdSeed += 1;
    const id = `g_${groupIdSeed}`;
    const label = `[${groupIdSeed}] ${name}`;
    setGroups((g) => [...g, { id, label }]);
    setSelectedGroupId(id);
    setNewGroupName('');
  };

  /* Demo tugmalar — API ulanganda almashtiriladi */
  const noopDemo = () => undefined;

  return (
    <div className="page contacts-page">
      <ContactGroupCreateCard
        value={newGroupName}
        onChange={setNewGroupName}
        onSubmit={handleCreateGroup}
      />

      <ContactsManagementCard
        groups={groups}
        selectedGroupId={selectedGroupId}
        onGroupChange={(id) => {
          setSelectedGroupId(id);
          setPage(1);
          setSelectedIds(new Set());
        }}
        toolbarHandlers={{
          onEdit: noopDemo,
          onRefresh: () => setPage(1),
          onDeleteGroup: noopDemo,
          onExport: noopDemo,
        }}
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
        pageRows={pageRows}
        selectedIds={selectedIds}
        onToggleAllPage={toggleAllPage}
        onToggleRow={toggleRow}
        allOnPageSelected={allOnPageSelected}
        pagination={{
          total: filtered.length,
          start: startN,
          end: endN,
          page: safePage,
          pageCount,
          onPrev: () => setPage((p) => Math.max(1, p - 1)),
          onNext: () => setPage((p) => Math.min(pageCount, p + 1)),
        }}
        bulkHandlers={{
          onDelete: noopDemo,
          onMove: noopDemo,
          onChangeStatus: noopDemo,
          onAddContact: noopDemo,
          onImport: noopDemo,
        }}
      />

      <GroupMessageCard groups={groups} serverTags={DEMO_SERVERS_TAGS} />
    </div>
  );
}
