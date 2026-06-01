import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { type AxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';
import { axiosClient } from './axiosClient';

export interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: unknown;
  params?: AxiosRequestConfig['params'];
}

export interface AxiosBaseQueryError {
  status?: number;
  data: ApiError;
}

/** RTK Query baseQuery that runs every request through the shared axiosClient. */
export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosClient.request({ url, method: method ?? 'GET', data, params });
      return { data: result.data };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const body = err.response?.data as Partial<ApiError> | undefined;
        return {
          error: {
            status,
            data: {
              statusCode: status ?? 0,
              message: body?.message ?? err.message ?? 'Network error',
              timestamp: body?.timestamp,
            },
          },
        };
      }
      return { error: { data: { statusCode: 0, message: 'Unknown error' } } };
    }
  };
