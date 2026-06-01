import type { InquiryParams, ListResponse, Template, TemplateStatus } from '../../types';
import { apiSlice } from '../apiSlice';

export interface CreateTemplateBody {
  name: string;
  body: string;
  variables?: string[];
  locale?: string;
  status?: TemplateStatus;
}

export type UpdateTemplateBody = Partial<CreateTemplateBody>;

export const templateApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getTemplates: build.query<ListResponse<Template>, InquiryParams>({
      query: (params) => ({ url: '/template', params }),
      providesTags: ['Template'],
    }),
    createTemplate: build.mutation<Template, CreateTemplateBody>({
      query: (data) => ({ url: '/template', method: 'POST', data }),
      invalidatesTags: ['Template'],
    }),
    updateTemplate: build.mutation<Template, { id: string; data: UpdateTemplateBody }>({
      query: ({ id, data }) => ({ url: `/template/${id}`, method: 'POST', data }),
      invalidatesTags: ['Template'],
    }),
    deleteTemplate: build.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/template/${id}/delete`, method: 'POST' }),
      invalidatesTags: ['Template'],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templateApi;
