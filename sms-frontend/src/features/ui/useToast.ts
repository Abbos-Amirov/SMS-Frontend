import { useCallback } from 'react';
import { useAppDispatch } from '../../store';
import { pushToast, type ToastKind } from './uiSlice';

export function useToast() {
  const dispatch = useAppDispatch();
  return useCallback(
    (kind: ToastKind, message: string) => {
      dispatch(pushToast(kind, message));
    },
    [dispatch],
  );
}
