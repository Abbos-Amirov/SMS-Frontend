import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../features/auth/AuthSlice';
import { toggleTheme } from '../../features/theme/ThemeSlice';
import { IconMoon, IconSun } from '../icons/UiIcons';

export function Navbar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const themeMode = useAppSelector((s) => s.theme.mode);

  const isDark = themeMode === 'dark';

  return (
    <header className="navbar">
      <div className="navbar__brandblock">
        <p className="navbar__tagline">Professional SMS platformasi</p>
      </div>
      <div className="navbar__actions">
        <button
          type="button"
          className="navbar__theme-btn"
          onClick={() => dispatch(toggleTheme())}
          title={isDark ? 'Yorug‘ rejim' : 'Qorong‘u rejim'}
          aria-label={isDark ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘u rejimga o‘tish'}
        >
          {isDark ? <IconSun aria-hidden /> : <IconMoon aria-hidden />}
        </button>
        <div className="navbar__status">
          <span className="navbar__dot" aria-hidden />
          API: demo rejim
        </div>
        <div className="navbar__user">
          <span className="navbar__avatar" aria-hidden>
            {(user?.name ?? 'A')[0]}
          </span>
          <div className="navbar__meta">
            <span className="navbar__name">{user?.name ?? 'Administrator'}</span>
            <span className="navbar__role">to‘liq huquq</span>
          </div>
        </div>
        <button type="button" className="navbar__logout" onClick={() => dispatch(logout())}>
          Chiqish
        </button>
      </div>
    </header>
  );
}
