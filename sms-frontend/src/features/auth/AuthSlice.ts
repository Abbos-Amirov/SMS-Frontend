import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AUTH_MEMBER_KEY, AUTH_TOKEN_KEY } from '../../api/axiosClient';
import type { AuthResponse, Member } from '../../types';

export interface AuthState {
  token: string | null;
  member: Member | null;
}

function readMember(): Member | null {
  try {
    const raw = localStorage.getItem(AUTH_MEMBER_KEY);
    return raw ? (JSON.parse(raw) as Member) : null;
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  token: typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null,
  member: typeof localStorage !== 'undefined' ? readMember() : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      state.token = action.payload.token;
      state.member = action.payload.member;
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
        localStorage.setItem(AUTH_MEMBER_KEY, JSON.stringify(action.payload.member));
      } catch {
        /* ignore */
      }
    },
    setMember(state, action: PayloadAction<Member>) {
      state.member = action.payload;
      try {
        localStorage.setItem(AUTH_MEMBER_KEY, JSON.stringify(action.payload));
      } catch {
        /* ignore */
      }
    },
    logout(state) {
      state.token = null;
      state.member = null;
      try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_MEMBER_KEY);
      } catch {
        /* ignore */
      }
    },
  },
});

export const { setCredentials, setMember, logout } = authSlice.actions;
export default authSlice.reducer;
