import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'novasms_theme';

function readStoredMode(): ThemeMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: typeof localStorage !== 'undefined' ? readStoredMode() : 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      try {
        localStorage.setItem(STORAGE_KEY, action.payload);
      } catch {
        /* ignore */
      }
    },
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, state.mode);
      } catch {
        /* ignore */
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
