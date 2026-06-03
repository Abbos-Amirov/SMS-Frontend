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

/** A limit value where null/undefined means unlimited. */
export function formatLimit(value: number | null | undefined, unit?: string): string {
  if (value == null) return 'Cheksiz';
  return unit ? `${formatNumber(value)} ${unit}` : formatNumber(value);
}

/** Plan price; null/undefined means the price is negotiated. */
export function formatPrice(price: number | null | undefined, currency = 'UZS'): string {
  if (price == null) return 'Kelishuv asosida';
  const label = currency === 'UZS' ? "so'm" : currency;
  return `${formatNumber(price)} ${label}`;
}
