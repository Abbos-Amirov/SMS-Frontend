import type { InquiryParams, ListResponse, Member, MemberRole, MemberStatus } from '../../types';
import { apiSlice } from '../apiSlice';

export interface AdminUpdateMemberBody {
  memberStatus?: MemberStatus;
  memberRole?: MemberRole;
}

export const memberApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMembers: build.query<ListResponse<Member>, InquiryParams>({
      query: (params) => ({ url: '/admin/member', params }),
      providesTags: ['Member'],
    }),
    getMember: build.query<Member, string>({
      query: (id) => ({ url: `/admin/member/${id}` }),
      providesTags: (_r, _e, id) => [{ type: 'Member', id }],
    }),
    updateMember: build.mutation<Member, { id: string; data: AdminUpdateMemberBody }>({
      query: ({ id, data }) => ({ url: `/admin/member/${id}`, method: 'POST', data }),
      invalidatesTags: ['Member'],
    }),
    deleteMember: build.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/member/${id}/delete`, method: 'POST' }),
      invalidatesTags: ['Member'],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberQuery,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = memberApi;
