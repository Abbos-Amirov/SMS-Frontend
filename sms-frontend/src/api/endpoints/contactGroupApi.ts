import type { ContactGroup } from '../../types';
import { apiSlice } from '../apiSlice';

export interface ContactGroupBody {
  name: string;
  description?: string;
  color?: string;
}

export const contactGroupApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getContactGroups: build.query<ContactGroup[], void>({
      query: () => ({ url: '/contact-group' }),
      providesTags: ['ContactGroup'],
    }),
    createContactGroup: build.mutation<ContactGroup, ContactGroupBody>({
      query: (data) => ({ url: '/contact-group', method: 'POST', data }),
      invalidatesTags: ['ContactGroup'],
    }),
    updateContactGroup: build.mutation<ContactGroup, { id: string; data: ContactGroupBody }>({
      query: ({ id, data }) => ({ url: `/contact-group/${id}`, method: 'POST', data }),
      invalidatesTags: ['ContactGroup', 'Contact'],
    }),
    deleteContactGroup: build.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/contact-group/${id}/delete`, method: 'POST' }),
      invalidatesTags: ['ContactGroup', 'Contact'],
    }),
  }),
});

export const {
  useGetContactGroupsQuery,
  useCreateContactGroupMutation,
  useUpdateContactGroupMutation,
  useDeleteContactGroupMutation,
} = contactGroupApi;
