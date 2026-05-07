import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Navbar } from '../components/Navbar/Navbar';
import { AppFooter } from '../components/AppFooter/AppFooter';
import Dashboard from '../pages/Dashboard';
import Servers from '../pages/Servers';
import Messages from '../pages/Messages';
import Templates from '../pages/Templates';
import Contacts from '../pages/Contacts';
import ApiSettings from '../pages/ApiSettings';
import StubPage from '../pages/StubPage';

export function AppRouter() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Navbar />
        <main className="app-shell__content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<StubPage title="Profil" />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/blacklist" element={<StubPage title="Qora ro‘yxat" />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/send" element={<StubPage title="Xabar yuborish" />} />
            <Route path="/ussd" element={<StubPage title="USSD" />} />
            <Route path="/auto-reply" element={<StubPage title="Avto javob" />} />
            <Route path="/api-settings" element={<ApiSettings />} />
            <Route path="/subscriptions" element={<StubPage title="Obuna tariflari" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
