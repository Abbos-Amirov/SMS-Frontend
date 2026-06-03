import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

// Lazy-load pages so each route is a separate chunk (smaller initial bundle).
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const CampaignsListPage = lazy(() => import('../pages/campaigns/CampaignsListPage').then((m) => ({ default: m.CampaignsListPage })));
const CampaignCreatePage = lazy(() => import('../pages/campaigns/CampaignCreatePage').then((m) => ({ default: m.CampaignCreatePage })));
const CampaignDetailPage = lazy(() => import('../pages/campaigns/CampaignDetailPage').then((m) => ({ default: m.CampaignDetailPage })));
const ContactsPage = lazy(() => import('../pages/contacts/ContactsPage').then((m) => ({ default: m.ContactsPage })));
const DevicesPage = lazy(() => import('../pages/devices/DevicesPage').then((m) => ({ default: m.DevicesPage })));
const TemplatesPage = lazy(() => import('../pages/templates/TemplatesPage').then((m) => ({ default: m.TemplatesPage })));
const AutoReplyPage = lazy(() => import('../pages/autoReply/AutoReplyPage').then((m) => ({ default: m.AutoReplyPage })));
const SmsLogsPage = lazy(() => import('../pages/smsLogs/SmsLogsPage').then((m) => ({ default: m.SmsLogsPage })));
const MySubscriptionPage = lazy(() => import('../pages/subscription/MySubscriptionPage').then((m) => ({ default: m.MySubscriptionPage })));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const MembersPage = lazy(() => import('../pages/admin/MembersPage').then((m) => ({ default: m.MembersPage })));
const MemberDetailPage = lazy(() => import('../pages/admin/MemberDetailPage').then((m) => ({ default: m.MemberDetailPage })));
const AdminSubscriptionsPage = lazy(() => import('../pages/admin/AdminSubscriptionsPage').then((m) => ({ default: m.AdminSubscriptionsPage })));
const AdminPlansPage = lazy(() => import('../pages/admin/AdminPlansPage').then((m) => ({ default: m.AdminPlansPage })));
const AdminSmsLogsPage = lazy(() => import('../pages/admin/AdminSmsLogsPage').then((m) => ({ default: m.AdminSmsLogsPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function RouteFallback() {
  return <div style={{ padding: 40, color: 'var(--muted)' }}>Yuklanmoqda…</div>;
}

export function AppRouter() {
  useUnauthorizedRedirect();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="campaigns" element={<CampaignsListPage />} />
            <Route path="campaigns/new" element={<CampaignCreatePage />} />
            <Route path="campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="auto-reply" element={<AutoReplyPage />} />
            <Route path="sms-logs" element={<SmsLogsPage />} />
            <Route path="subscription" element={<MySubscriptionPage />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route path="admin" element={<RoleRoute />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="members/:id" element={<MemberDetailPage />} />
              <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
              <Route path="plans" element={<AdminPlansPage />} />
              <Route path="sms-logs" element={<AdminSmsLogsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
