import { ContactsPanel } from './ContactsPanel';
import { ContactGroupToolbar } from './ContactGroupToolbar';
import { ContactsTableFilters } from './ContactsTableFilters';
import { ContactsDataTable } from './ContactsDataTable';
import { ContactsPagination } from './ContactsPagination';
import { ContactsBulkActions } from './ContactsBulkActions';
import type { ContactGroupOption, ContactRecord } from '../types';

type ContactsManagementCardProps = {
  groups: ContactGroupOption[];
  selectedGroupId: string;
  onGroupChange: (id: string) => void;
  toolbarHandlers: {
    onEdit: () => void;
    onRefresh: () => void;
    onDeleteGroup: () => void;
    onExport: () => void;
  };
  pageSize: number;
  onPageSizeChange: (n: number) => void;
  search: string;
  onSearchChange: (v: string) => void;
  pageRows: ContactRecord[];
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
  bulkHandlers: {
    onDelete: () => void;
    onMove: () => void;
    onChangeStatus: () => void;
    onAddContact: () => void;
    onImport: () => void;
  };
};

export function ContactsManagementCard(props: ContactsManagementCardProps) {
  const {
    groups,
    selectedGroupId,
    onGroupChange,
    toolbarHandlers,
    pageSize,
    onPageSizeChange,
    search,
    onSearchChange,
    pageRows,
    selectedIds,
    onToggleAllPage,
    onToggleRow,
    allOnPageSelected,
    pagination,
    bulkHandlers,
  } = props;

  return (
    <ContactsPanel noHeader>
      <div className="contacts-management-inner">
        <ContactGroupToolbar
          groups={groups}
          selectedGroupId={selectedGroupId}
          onGroupChange={onGroupChange}
          {...toolbarHandlers}
        />
        <ContactsTableFilters
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          search={search}
          onSearchChange={onSearchChange}
        />
        <ContactsDataTable
          rows={pageRows}
          selectedIds={selectedIds}
          onToggleAll={onToggleAllPage}
          onToggleRow={onToggleRow}
          allOnPageSelected={allOnPageSelected}
        />
        <ContactsPagination {...pagination} />
        <ContactsBulkActions {...bulkHandlers} />
      </div>
    </ContactsPanel>
  );
}
