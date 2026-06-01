import { IconSearch } from '../icons/UiIcons';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Qidirish...' }: SearchInputProps) {
  return (
    <div className="search-input">
      <IconSearch />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
