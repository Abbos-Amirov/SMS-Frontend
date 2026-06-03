import type { Plan, SubscriptionPlan } from '../../types';
import { apiSlice } from '../apiSlice';

export interface UpdatePlanBody {
  name?: string;
  price?: number | null;
  currency?: string;
  dailySmsLimit?: number | null;
  deviceLimit?: number | null;
  durationDays?: number | null;
  description?: string;
  features?: string[];
  order?: number;
  isActive?: boolean;
}

export const planApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Active plans shown to members on the subscription page.
    getPlans: build.query<Plan[], void>({
      query: () => ({ url: '/plan' }),
      providesTags: ['Plan'],
    }),
    // Full catalog for the admin editor.
    getAdminPlans: build.query<Plan[], void>({
      query: () => ({ url: '/admin/plan' }),
      providesTags: ['Plan'],
    }),
    updatePlan: build.mutation<Plan, { code: SubscriptionPlan; data: UpdatePlanBody }>({
      query: ({ code, data }) => ({ url: `/admin/plan/${code}`, method: 'POST', data }),
      invalidatesTags: ['Plan'],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetAdminPlansQuery,
  useUpdatePlanMutation,
} = planApi;
