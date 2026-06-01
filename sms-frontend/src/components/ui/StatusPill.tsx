import type { PillTone } from '../../lib/labels';

interface StatusPillProps {
  tone: PillTone;
  label: string;
  dot?: boolean;
}

export function StatusPill({ tone, label, dot = true }: StatusPillProps) {
  return (
    <span className={`pill pill--${tone}`}>
      {dot && <span className="pill__dot" aria-hidden />}
      {label}
    </span>
  );
}
