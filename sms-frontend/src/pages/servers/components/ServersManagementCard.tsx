import { ContactsPanel } from '../../contacts/components/ContactsPanel';
import { ContactsPagination } from '../../contacts/components/ContactsPagination';
import { ServersCardToolbar } from './ServersCardToolbar';
import { ServersTableFilters } from './ServersTableFilters';
import { ServersDataTable } from './ServersDataTable';
import type { ServerDevice } from '../types';

type ServersManagementCardProps = {
  loading: boolean;
  rows: ServerDevice[];
  pageSize: number;
  onPageSizeChange: (n: number) => void;
  search: string;
  onSearchChange: (v: string) => void;
  toolbarHandlers: {
    onDelete: () => void;
    onAdd: () => void;
  };
  selectedIds: Set<string>;
  onToggleAllPage: () => void;
  onToggleRow: (id: string) => void;
  allOnPageSelected: boolean;
  pagination: {
    total: number;
    start: number;
    end: number;
    page: number;
    pageCount: number;
    onPrev: () => void;
    onNext: () => void;
  };
};

export function ServersManagementCard(props: ServersManagementCardProps) {
  const {
    loading,
    rows,
    pageSize,
    onPageSizeChange,
    search,
    onSearchChange,
    toolbarHandlers,
    selectedIds,
    onToggleAllPage,
    onToggleRow,
    allOnPageSelected,
    pagination,
  } = props;

  return (
    <ContactsPanel noHeader>
      <div className="servers-management-inner">
        <ServersCardToolbar {...toolbarHandlers} />
        <ServersTableFilters
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          search={search}
          onSearchChange={onSearchChange}
        />
        <ServersDataTable
          rows={rows}
          loading={loading}
          selectedIds={selectedIds}
          onToggleAll={onToggleAllPage}
          onToggleRow={onToggleRow}
          allSelected={allOnPageSelected}
        />
        <ContactsPagination {...pagination} />
      </div>
    </ContactsPanel>
  );
}
