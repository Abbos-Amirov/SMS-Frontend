import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { NAV_SECTIONS } from './navConfig';

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { isAdmin } = useAuth();

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">S</div>
        <div>
          <div className="sidebar__brand-name">NovaSMS</div>
          <div className="sidebar__brand-sub">Boshqaruv markazi</div>
        </div>
      </div>

      {NAV_SECTIONS.filter((s) => !s.adminOnly || isAdmin).map((section, i) => (
        <div key={i}>
          {section.title && <div className="sidebar__section">{section.title}</div>}
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  );
}
