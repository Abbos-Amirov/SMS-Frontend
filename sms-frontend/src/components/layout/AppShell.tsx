import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      {navOpen && <div className="sidebar-backdrop" onClick={() => setNavOpen(false)} />}
      <div className="app-main">
        <Topbar onMenu={() => setNavOpen((o) => !o)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
