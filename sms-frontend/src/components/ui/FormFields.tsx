import { forwardRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { IconX } from '../icons/UiIcons';

interface FieldWrapProps {
  label?: ReactNode;
  error?: string;
  children: ReactNode;
}
export function FieldWrap({ label, error, children }: FieldWrapProps) {
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode; error?: string };
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, ...rest }, ref) => (
  <FieldWrap label={label} error={error}>
    <input ref={ref} className="field__input" {...rest} />
  </FieldWrap>
));
Input.displayName = 'Input';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: ReactNode; error?: string };
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, ...rest }, ref) => (
  <FieldWrap label={label} error={error}>
    <textarea ref={ref} className="field__textarea" {...rest} />
  </FieldWrap>
));
Textarea.displayName = 'Textarea';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: ReactNode;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, ...rest }, ref) => (
    <FieldWrap label={label} error={error}>
      <select ref={ref} className="field__select" {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrap>
  ),
);
Select.displayName = 'Select';

interface TagInputProps {
  label?: ReactNode;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}
export function TagInput({ label, value, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft('');
  };
  return (
    <FieldWrap label={label}>
      <div className="tag-input">
        {value.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label="O'chirish">
              <IconX width={12} height={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          placeholder={placeholder ?? 'Teg qo‘shish...'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
        />
      </div>
    </FieldWrap>
  );
}
