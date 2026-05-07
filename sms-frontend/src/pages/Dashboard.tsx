import { useState } from 'react';
import { SmsVolumeChart } from '../components/Charts/SmsVolumeChart';
import { DashboardMetricCard } from '../components/DashboardMetricCard/DashboardMetricCard';
import {
  IconBolt,
  IconCalendar,
  IconCheckCircle,
  IconClock,
  IconDoubleCheck,
  IconMail,
  IconMinusCircle,
  IconStopwatch,
  IconSync,
} from '../components/icons/UiIcons';

const fmtNum = (n: number) => new Intl.NumberFormat('uz-UZ').format(n);

const DASH_METRICS = [
  { label: 'Kutilmoqda', value: '0', icon: <IconStopwatch /> },
  { label: 'Rejalashtirilgan', value: '0', icon: <IconCalendar /> },
  { label: 'Navbatda', value: '0', icon: <IconSync /> },
  { label: 'Yuborilgan', value: fmtNum(844_706), icon: <IconCheckCircle /> },
  { label: 'Delivered', value: '0', icon: <IconDoubleCheck /> },
  { label: 'Yuborilmadi', value: fmtNum(2), icon: <IconMinusCircle /> },
  { label: 'Kelgan smslar', value: fmtNum(1_983), icon: <IconMail /> },
  { label: "Kutilayotgan USSD so'rovlar", value: '0', icon: <IconStopwatch /> },
  { label: "Yuborilgan USSD so'rovlar", value: '0', icon: <IconDoubleCheck /> },
  { label: 'Mavjud limitlar', value: fmtNum(9_007_795), icon: <IconBolt /> },
  { label: 'Muddat qoldi', value: '766 d', icon: <IconClock /> },
] as const;

export default function Dashboard() {
  const [period, setPeriod] = useState('all');

  return (
    <div className="page dashboard-page">
      <div className="dashboard-page__head">
        <h1 className="dashboard-page__title">Statistika</h1>
        <label className="dashboard-page__filter">
          <span className="visually-hidden">Davr</span>
          <select
            className="dashboard-page__select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="all">Barchasi</option>
            <option value="today">Bugun</option>
            <option value="week">Hafta</option>
            <option value="month">Oy</option>
          </select>
        </label>
      </div>
      <p className="page__lede page__lede--tight">
        Ko‘rsatkichlar demo ma’lumot — backend ulanganda yangilanadi.
      </p>
      <div className="dashboard-metrics">
        {DASH_METRICS.map((m) => (
          <DashboardMetricCard key={m.label} value={m.value} label={m.label} icon={m.icon} />
        ))}
      </div>
      <SmsVolumeChart />
    </div>
  );
}
