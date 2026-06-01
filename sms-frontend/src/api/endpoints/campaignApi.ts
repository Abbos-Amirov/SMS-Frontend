import type { Campaign, CampaignDetail, InquiryParams, ListResponse } from '../../types';
import { apiSlice } from '../apiSlice';

export interface CreateCampaignBody {
  title: string;
  message: string;
  scheduledAt?: string;
  sendNow?: boolean;
  contactIds?: string[];
  groupIds?: string[];
  phones?: string[];
}

export const campaignApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCampaigns: build.query<ListResponse<Campaign>, InquiryParams>({
      query: (params) => ({ url: '/campaign', params }),
      providesTags: ['Campaign'],
    }),
    getCampaign: build.query<CampaignDetail, string>({
      query: (id) => ({ url: `/campaign/${id}` }),
      providesTags: (_r, _e, id) => [{ type: 'Campaign', id }],
    }),
    createCampaign: build.mutation<CampaignDetail | Campaign, CreateCampaignBody>({
      query: (data) => ({ url: '/campaign', method: 'POST', data }),
      invalidatesTags: ['Campaign'],
    }),
    cancelCampaign: build.mutation<CampaignDetail, string>({
      query: (id) => ({ url: `/campaign/${id}/cancel`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => ['Campaign', { type: 'Campaign', id }],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useCancelCampaignMutation,
} = campaignApi;
