import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppSelector } from '../../store';

export function SmsVolumeChart() {
  const series = useAppSelector((s) => s.stats.series);

  return (
    <div className="chart-panel">
      <div className="chart-panel__head">
        <h2 className="chart-panel__title">Haftalik SMS hajmi</h2>
        <p className="chart-panel__desc">Yuborilgan va xatoliklar (demo ma’lumot)</p>
      </div>
      <div className="chart-panel__body">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted)" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
            <YAxis stroke="var(--muted)" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
              }}
            />
            <Area
              type="monotone"
              dataKey="sent"
              name="Yuborilgan"
              stroke="var(--accent)"
              fillOpacity={1}
              fill="url(#colorSent)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="failed"
              name="Xato"
              stroke="var(--danger)"
              fill="var(--danger-soft)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
