import { format, formatDistanceToNow, parseISO } from 'date-fns';

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const d = typeof value === 'string' ? parseISO(value) : value;
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value?: string | Date | null): string {
  const d = toDate(value);
  return d ? format(d, 'yyyy-MM-dd HH:mm') : '—';
}

export function formatDay(value?: string | Date | null): string {
  const d = toDate(value);
  return d ? format(d, 'dd MMM') : '—';
}

export function formatRelative(value?: string | Date | null): string {
  const d = toDate(value);
  return d ? formatDistanceToNow(d, { addSuffix: true }) : '—';
}

export function formatNumber(value?: number | null): string {
  if (value == null) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}
