import type {
  AutoReply,
  AutoReplyMatchType,
  AutoReplyStatus,
  InquiryParams,
  ListResponse,
} from '../../types';
import { apiSlice } from '../apiSlice';

export interface CreateAutoReplyBody {
  triggerText: string;
  replyBody: string;
  matchType?: AutoReplyMatchType;
  enabled?: boolean;
  deviceId?: string;
  status?: AutoReplyStatus;
}

export type UpdateAutoReplyBody = Partial<CreateAutoReplyBody>;

export const autoReplyApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAutoReplies: build.query<ListResponse<AutoReply>, InquiryParams>({
      query: (params) => ({ url: '/auto-reply', params }),
      providesTags: ['AutoReply'],
    }),
    createAutoReply: build.mutation<AutoReply, CreateAutoReplyBody>({
      query: (data) => ({ url: '/auto-reply', method: 'POST', data }),
      invalidatesTags: ['AutoReply'],
    }),
    updateAutoReply: build.mutation<AutoReply, { id: string; data: UpdateAutoReplyBody }>({
      query: ({ id, data }) => ({ url: `/auto-reply/${id}`, method: 'POST', data }),
      invalidatesTags: ['AutoReply'],
    }),
    deleteAutoReply: build.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/auto-reply/${id}/delete`, method: 'POST' }),
      invalidatesTags: ['AutoReply'],
    }),
  }),
});

export const {
  useGetAutoRepliesQuery,
  useCreateAutoReplyMutation,
  useUpdateAutoReplyMutation,
  useDeleteAutoReplyMutation,
} = autoReplyApi;
