import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
}

interface UiState {
  toasts: Toast[];
}

const initialState: UiState = { toasts: [] };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    pushToast: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload);
      },
      prepare(kind: ToastKind, message: string) {
        return { payload: { id: nanoid(), kind, message } };
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { pushToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
