import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SmsSeriesPoint } from '../../types';
import { formatDay } from '../../lib/format';

export function SmsVolumeChart({ data }: { data: SmsSeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gSent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--success)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gFailed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--danger)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--danger)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => formatDay(d)}
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}
          labelFormatter={(d) => formatDay(d as string)}
        />
        <Area type="monotone" dataKey="sent" name="Yuborildi" stroke="var(--success)" fill="url(#gSent)" strokeWidth={2} />
        <Area type="monotone" dataKey="failed" name="Xato" stroke="var(--danger)" fill="url(#gFailed)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
