import type { InquiryParams, ListResponse, SmsLog } from '../../types';
import { apiSlice } from '../apiSlice';

export const smsLogApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getSmsLogs: build.query<ListResponse<SmsLog>, InquiryParams>({
      query: (params) => ({ url: '/sms-log', params }),
      providesTags: ['SmsLog'],
    }),
    getAdminSmsLogs: build.query<ListResponse<SmsLog>, InquiryParams>({
      query: (params) => ({ url: '/admin/sms-log', params }),
      providesTags: ['SmsLog'],
    }),
  }),
});

export const { useGetSmsLogsQuery, useGetAdminSmsLogsQuery } = smsLogApi;
