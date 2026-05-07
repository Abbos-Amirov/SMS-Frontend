type ContactsTableFiltersProps = {
  pageSize: number;
  onPageSizeChange: (n: number) => void;
  search: string;
  onSearchChange: (v: string) => void;
};

const PAGE_OPTS = [10, 25, 50];

export function ContactsTableFilters({
  pageSize,
  onPageSizeChange,
  search,
  onSearchChange,
}: ContactsTableFiltersProps) {
  return (
    <div className="contacts-table-filters">
      <label className="contacts-table-filters__show">
        <span>Show</span>
        <select
          className="contacts-select contacts-select--narrow"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_OPTS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>entries</span>
      </label>
      <label className="contacts-table-filters__search">
        <span>Izlash:</span>
        <input
          type="search"
          className="contacts-input contacts-input--search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder=""
        />
      </label>
    </div>
  );
}
