import type { ReactNode } from 'react';
import { IconChevronRight } from '../icons/UiIcons';

export type DashboardMetricCardProps = {
  value: string;
  label: string;
  icon: ReactNode;
  detailLabel?: string;
};

export function DashboardMetricCard({
  value,
  label,
  icon,
  detailLabel = "Batafsil ma'lumot",
}: DashboardMetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-card__body">
        <div className="metric-card__copy">
          <p className="metric-card__value">{value}</p>
          <p className="metric-card__label">{label}</p>
        </div>
        <div className="metric-card__icon" aria-hidden>
          {icon}
        </div>
      </div>
      <button type="button" className="metric-card__foot">
        <span>{detailLabel}</span>
        <IconChevronRight />
      </button>
    </article>
  );
}
