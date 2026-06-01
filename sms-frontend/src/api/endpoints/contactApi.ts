import type { Contact, ContactStatus, InquiryParams, ListResponse } from '../../types';
import { apiSlice } from '../apiSlice';

export interface CreateContactBody {
  name?: string;
  phone: string;
  status?: ContactStatus;
  tags?: string[];
  groupIds?: string[];
}

export type UpdateContactBody = Partial<CreateContactBody>;
export interface ImportContactsResult {
  created: number;
  updated: number;
  errors: { row: number; phone: string; reason: string }[];
}

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getContacts: build.query<ListResponse<Contact>, InquiryParams>({
      query: (params) => ({ url: '/contact', params }),
      providesTags: ['Contact'],
    }),
    getContact: build.query<Contact, string>({
      query: (id) => ({ url: `/contact/${id}` }),
      providesTags: (_r, _e, id) => [{ type: 'Contact', id }],
    }),
    createContact: build.mutation<Contact, CreateContactBody>({
      query: (data) => ({ url: '/contact', method: 'POST', data }),
      invalidatesTags: ['Contact'],
    }),
    updateContact: build.mutation<Contact, { id: string; data: UpdateContactBody }>({
      query: ({ id, data }) => ({ url: `/contact/${id}`, method: 'POST', data }),
      invalidatesTags: ['Contact'],
    }),
    deleteContact: build.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/contact/${id}/delete`, method: 'POST' }),
      invalidatesTags: ['Contact'],
    }),
    importContacts: build.mutation<ImportContactsResult, { rows: CreateContactBody[]; groupIds?: string[] }>({
      query: (data) => ({ url: '/contact/import', method: 'POST', data }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useImportContactsMutation,
} = contactApi;
