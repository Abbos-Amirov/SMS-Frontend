import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { useToast } from '../features/ui/useToast';

export function RoleRoute() {
  const { isAdmin } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!isAdmin) toast('error', 'Bu bo‘limga ruxsatingiz yo‘q.');
  }, [isAdmin, toast]);

  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
