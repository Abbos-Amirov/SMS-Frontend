import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function IconChart({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M4 19V5M4 19h16M8 17V9m4 8V5m4 12v-4" />
    </svg>
  );
}

export function IconUser({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
    </svg>
  );
}

export function IconServer({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  );
}

export function IconBan({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m5 5 14 14" />
    </svg>
  );
}

export function IconTemplate({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M10 13h4M10 17h7" />
    </svg>
  );
}

export function IconContacts({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function IconMessage({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}

export function IconSend({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export function IconHash({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M4 9h16M10 9 8 21M14 15l2 8M14 15H8M14 15h6m0-15 2 8M14 9h6M6 21h12" />
    </svg>
  );
}

export function IconReply({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function IconApi({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M4 7h16M10 11h4M7 15h10M6 20h12" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconCredit({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

export function IconDownload({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M12 3v12M8 11l4 4 4-4M4 21h16" />
    </svg>
  );
}

/* Dashboard metric icons (larger visual weight) */
const mb = { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function IconStopwatch({ className, ...p }: IconProps) {
  return (
    <svg {...mb} className={className} {...p}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M9 2h6" />
    </svg>
  );
}

export function IconCalendar({ className, ...p }: IconProps) {
  return (
    <svg {...mb} className={className} {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

export function IconSync({ className, ...p }: IconProps) {
  return (
    <svg {...mb} className={className} {...p}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M21 21v-5h-5" />
    </svg>
  );
}

export function IconCheckCircle({ className, ...p }: IconProps) {
  return (
    <svg {...mb} className={className} {...p}>
      <path d="M22 12a10 10 0 1 1-10-10" />
      <path d="M8 12.5 11 15 17 9" />
    </svg>
  );
}

export function IconDoubleCheck({ className, ...p }: IconProps) {
  return (
    <svg {...mb} className={className} {...p}>
      <path d="M4 13 9 18 20 6" />
      <path d="M8 13 14 18 22 9" />
    </svg>
  );
}

export function IconMinusCircle({ className, ...p }: IconProps) {
  return (
    <svg {...mb} className={className} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function IconMail({ className, ...p }: IconProps) {
  return (
    <svg {...mb} className={className} {...p}>
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export function IconBolt({ className, ...p }: IconProps) {
  return (
    <svg {...mb} className={className} {...p}>
      <path d="M13 2 4 13h8l-1 9 11-13h-7l2-9Z" />
    </svg>
  );
}

export function IconClock({ className, ...p }: IconProps) {
  return (
    <svg {...mb} className={className} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}

export function IconMoon({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function IconSun({ className, ...p }: IconProps) {
  return (
    <svg {...base} className={className} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function IconChevronRight({ className, ...p }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
