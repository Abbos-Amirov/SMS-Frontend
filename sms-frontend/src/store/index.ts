import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { apiSlice } from '../api/apiSlice';
import authReducer from '../features/auth/AuthSlice';
import themeReducer from '../features/theme/ThemeSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
