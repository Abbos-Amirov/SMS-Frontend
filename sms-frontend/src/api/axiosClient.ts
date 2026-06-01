import axios, { type InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4008';

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_MEMBER_KEY = 'auth_member';

/** Fired when any request returns 401 so the app can log the user out. */
export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

export const axiosClient = axios.create({
  baseURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
  // Serialize nested objects the way the backend's extended query parser expects:
  // search[text]=x&search[status]=ACTIVE
  paramsSerializer: (params) => qs.stringify(params, { encodeValuesOnly: true, skipNulls: true }),
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_MEMBER_KEY);
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(err);
  },
);
