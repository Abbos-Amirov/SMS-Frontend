type ServersTableFiltersProps = {
  pageSize: number;
  onPageSizeChange: (n: number) => void;
  search: string;
  onSearchChange: (v: string) => void;
};

const PAGE_OPTS = [10, 25, 50];

export function ServersTableFilters({
  pageSize,
  onPageSizeChange,
  search,
  onSearchChange,
}: ServersTableFiltersProps) {
  return (
    <div className="contacts-table-filters servers-table-filters">
      <label className="contacts-table-filters__show servers-ta-label">
        <select
          className="contacts-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_OPTS.map((n) => (
            <option key={n} value={n}>
              {n} ta yozuvlarni ko‘rsat
            </option>
          ))}
        </select>
      </label>
      <label className="contacts-table-filters__search">
        <span>Izlash:</span>
        <input
          type="search"
          className="contacts-input contacts-input--search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
    </div>
  );
}
