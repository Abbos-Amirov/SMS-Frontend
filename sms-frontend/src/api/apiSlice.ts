import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Member',
    'Device',
    'Campaign',
    'Contact',
    'ContactGroup',
    'Subscription',
    'Stats',
    'SmsLog',
    'Template',
    'AutoReply',
    'Plan',
  ],
  endpoints: () => ({}),
});
