import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import authReducer from '../features/auth/AuthSlice';
import statsReducer from '../features/stats/StatsSlice';
import themeReducer from '../features/theme/ThemeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stats: statsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
