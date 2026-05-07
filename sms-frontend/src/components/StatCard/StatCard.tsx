export type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  trend?: number;
};

export function StatCard({ label, value, hint, trend }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {trend !== undefined && (
          <span
            className={`stat-card__trend${trend >= 0 ? ' stat-card__trend--up' : ' stat-card__trend--down'}`}
          >
            {trend >= 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      {hint !== undefined && hint !== '' ? <p className="stat-card__hint">{hint}</p> : null}
    </article>
  );
}
