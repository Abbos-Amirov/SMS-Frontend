import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSlice } from '../api/apiSlice';
import { UNAUTHORIZED_EVENT } from '../api/axiosClient';
import { logout } from '../features/auth/AuthSlice';
import { useAppDispatch } from '../store';

/** Listens for the global 401 event and forces a clean logout + redirect. */
export function useUnauthorizedRedirect() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const handler = () => {
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      navigate('/login', { replace: true });
    };
    window.addEventListener(UNAUTHORIZED_EVENT, handler);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
  }, [dispatch, navigate]);
}
