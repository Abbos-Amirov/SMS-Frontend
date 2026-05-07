import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
  name: string;
};

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: 'idle' | 'loading';
}

const initialState: AuthState = {
  user: typeof localStorage !== 'undefined' ? { name: 'Oscar' } : null,
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('auth_token', action.payload);
      } else {
        localStorage.removeItem('auth_token');
      }
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth_token');
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
