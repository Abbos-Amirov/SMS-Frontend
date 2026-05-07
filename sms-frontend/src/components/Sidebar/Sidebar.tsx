import { NavLink } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react';
import { useAppSelector } from '../../store';
import {
  IconApi,
  IconBan,
  IconChart,
  IconContacts,
  IconCredit,
  IconDownload,
  IconHash,
  IconMessage,
  IconReply,
  IconSend,
  IconServer,
  IconTemplate,
  IconUser,
} from '../icons/UiIcons';

type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

type NavItem = {
  to: string;
  label: string;
  Icon: NavIcon;
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: '/', label: 'Statistika', Icon: IconChart, end: true },
  { to: '/profile', label: 'Profil', Icon: IconUser },
  { to: '/servers', label: 'Serverlar', Icon: IconServer },
  { to: '/blacklist', label: 'Qora ro‘yxat', Icon: IconBan },
  { to: '/templates', label: 'Shablonlar', Icon: IconTemplate },
  { to: '/contacts', label: 'Kontaktlar', Icon: IconContacts },
  { to: '/messages', label: 'Xabarlar', Icon: IconMessage },
  { to: '/send', label: 'Xabar yuborish', Icon: IconSend },
  { to: '/ussd', label: 'USSD', Icon: IconHash },
  { to: '/auto-reply', label: 'Avto javob', Icon: IconReply },
  { to: '/api-settings', label: 'API', Icon: IconApi },
  { to: '/subscriptions', label: 'Obuna tariflari', Icon: IconCredit },
];

export function Sidebar() {
  const user = useAppSelector((s) => s.auth.user);
  const displayName = user?.name ?? 'Foydalanuvchi';

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden />
        <div className="sidebar__brand-text">
          <div className="sidebar__novasms">NOVASMS</div>
        </div>
      </div>

      <div className="sidebar__profile">
        <span className="sidebar__profile-avatar" aria-hidden>
          {displayName[0]?.toUpperCase() ?? '?'}
        </span>
        <div className="sidebar__profile-meta">
          <span className="sidebar__profile-name">{displayName}</span>
          <span className="sidebar__profile-status">
            <span className="sidebar__online-dot" aria-hidden />
            Online
          </span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Asosiy navigatsiya">
        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            <Icon className="sidebar__link-icon" aria-hidden />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__download">
          <IconDownload className="sidebar__download-icon" aria-hidden />
          App yuklash
        </button>
      </div>
    </aside>
  );
}
