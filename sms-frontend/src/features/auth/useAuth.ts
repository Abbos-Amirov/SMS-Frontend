import { useAppSelector } from '../../store';

export function useAuth() {
  const { token, member } = useAppSelector((s) => s.auth);
  const role = member?.memberRole ?? null;
  return {
    token,
    member,
    role,
    isAuthenticated: Boolean(token),
    isAdmin: role === 'ADMIN' || role === 'OWNER',
    isOwner: role === 'OWNER',
  };
}
