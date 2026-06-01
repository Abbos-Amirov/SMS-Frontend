import type { AdminStats, MemberStats } from '../../types';
import { apiSlice } from '../apiSlice';

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMyStats: build.query<MemberStats, { days?: number } | void>({
      query: (arg) => ({ url: '/stats/me', params: arg ?? undefined }),
      providesTags: ['Stats'],
    }),
    getAdminStats: build.query<AdminStats, { days?: number } | void>({
      query: (arg) => ({ url: '/admin/stats', params: arg ?? undefined }),
      providesTags: ['Stats'],
    }),
  }),
});

export const { useGetMyStatsQuery, useGetAdminStatsQuery } = statsApi;
