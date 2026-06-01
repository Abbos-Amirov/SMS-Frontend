import { useAuth } from '../../features/auth/useAuth';
import { logout } from '../../features/auth/AuthSlice';
import { toggleTheme } from '../../features/theme/ThemeSlice';
import { memberRoleLabel } from '../../lib/labels';
import { useAppDispatch, useAppSelector } from '../../store';
import { apiSlice } from '../../api/apiSlice';
import { IconLogout, IconMenu, IconMoon, IconSun } from '../icons/UiIcons';

interface TopbarProps {
  onMenu: () => void;
}

export function Topbar({ onMenu }: TopbarProps) {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);
  const { member } = useAuth();

  const initials = member
    ? `${member.memberFirstName?.[0] ?? ''}${member.memberLastName?.[0] ?? ''}`.toUpperCase() ||
      member.memberEmail[0].toUpperCase()
    : '?';

  const onLogout = () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
  };

  return (
    <header className="topbar">
      <button className="topbar__icon-btn sidebar-toggle" onClick={onMenu} aria-label="Menyu">
        <IconMenu />
      </button>
      <div className="topbar__spacer" />

      <button
        className="topbar__icon-btn"
        onClick={() => dispatch(toggleTheme())}
        aria-label="Rejimni almashtirish"
      >
        {mode === 'dark' ? <IconSun /> : <IconMoon />}
      </button>

      <div className="topbar__user">
        <div>
          <div className="topbar__user-name">
            {member?.memberFirstName} {member?.memberLastName}
          </div>
          <div className="topbar__user-role">
            {member ? memberRoleLabel[member.memberRole] : ''}
          </div>
        </div>
        <div className="avatar">{initials}</div>
      </div>

      <button className="topbar__icon-btn" onClick={onLogout} aria-label="Chiqish" title="Chiqish">
        <IconLogout />
      </button>
    </header>
  );
}
