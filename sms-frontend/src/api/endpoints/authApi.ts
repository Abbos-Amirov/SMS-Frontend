import type { AuthResponse, Member } from '../../types';
import { apiSlice } from '../apiSlice';

export interface LoginBody {
  memberEmail: string;
  memberPassword: string;
}

export interface RegisterBody {
  memberEmail: string;
  memberPassword: string;
  memberFirstName: string;
  memberLastName?: string;
  memberPhone?: string;
  memberCompanyName?: string;
}

export interface UpdateMeBody {
  memberFirstName?: string;
  memberLastName?: string;
  memberPhone?: string;
  memberCompanyName?: string;
  memberImage?: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginBody>({
      query: (data) => ({ url: '/auth/login', method: 'POST', data }),
    }),
    register: build.mutation<AuthResponse, RegisterBody>({
      query: (data) => ({ url: '/auth/register', method: 'POST', data }),
    }),
    logout: build.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getMe: build.query<Member, void>({
      query: () => ({ url: '/member/me' }),
      providesTags: ['Member'],
    }),
    updateMe: build.mutation<Member, UpdateMeBody>({
      query: (data) => ({ url: '/member/me', method: 'POST', data }),
      invalidatesTags: ['Member'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateMeMutation,
} = authApi;
