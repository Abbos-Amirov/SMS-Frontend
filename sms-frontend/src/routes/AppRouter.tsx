import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { CampaignsListPage } from '../pages/campaigns/CampaignsListPage';
import { CampaignCreatePage } from '../pages/campaigns/CampaignCreatePage';
import { CampaignDetailPage } from '../pages/campaigns/CampaignDetailPage';
import { ContactsPage } from '../pages/contacts/ContactsPage';
import { DevicesPage } from '../pages/devices/DevicesPage';
import { TemplatesPage } from '../pages/templates/TemplatesPage';
import { AutoReplyPage } from '../pages/autoReply/AutoReplyPage';
import { SmsLogsPage } from '../pages/smsLogs/SmsLogsPage';
import { MySubscriptionPage } from '../pages/subscription/MySubscriptionPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { MembersPage } from '../pages/admin/MembersPage';
import { MemberDetailPage } from '../pages/admin/MemberDetailPage';
import { AdminSubscriptionsPage } from '../pages/admin/AdminSubscriptionsPage';
import { AdminSmsLogsPage } from '../pages/admin/AdminSmsLogsPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function AppRouter() {
  useUnauthorizedRedirect();

  return (
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
            <Route path="sms-logs" element={<AdminSmsLogsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
