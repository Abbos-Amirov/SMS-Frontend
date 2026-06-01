import type { InquiryParams, ListResponse, Subscription, SubscriptionPlan } from '../../types';
import { apiSlice } from '../apiSlice';

export interface ActivateSubscriptionBody {
  plan: SubscriptionPlan;
  durationDays?: number;
  deviceLimit?: number;
  dailySmsLimit?: number;
  note?: string;
}

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMySubscription: build.query<Subscription | null, void>({
      query: () => ({ url: '/subscription/me' }),
      providesTags: ['Subscription'],
    }),
    getAdminSubscriptions: build.query<ListResponse<Subscription>, InquiryParams>({
      query: (params) => ({ url: '/admin/subscription', params }),
      providesTags: ['Subscription'],
    }),
    activateSubscription: build.mutation<
      Subscription,
      { memberId: string; data: ActivateSubscriptionBody }
    >({
      query: ({ memberId, data }) => ({
        url: `/admin/subscription/member/${memberId}`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Subscription', 'Member'],
    }),
    cancelSubscription: build.mutation<Subscription, string>({
      query: (id) => ({ url: `/admin/subscription/${id}/cancel`, method: 'POST' }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useGetMySubscriptionQuery,
  useGetAdminSubscriptionsQuery,
  useActivateSubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;
