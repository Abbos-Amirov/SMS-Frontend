import { axiosClient } from './axiosClient';

export type ApiMessagesQuery = Record<string, string | number | boolean | undefined>;
export type ApiContactsQuery = Record<string, string | number | boolean | undefined>;
export type ApiSettingsPayload = Record<string, unknown>;

/** REST obertkalar — backend tayyor bo‘lganda URL lar moslashtiriladi */
export const smsService = {
  getStats() {
    return axiosClient.get('/stats');
  },

  getServers() {
    return axiosClient.get('/servers');
  },

  getMessages(params?: ApiMessagesQuery) {
    return axiosClient.get('/messages', { params });
  },

  getTemplates() {
    return axiosClient.get('/templates');
  },

  getContacts(params?: ApiContactsQuery) {
    return axiosClient.get('/contacts', { params });
  },

  updateApiSettings(payload: ApiSettingsPayload) {
    return axiosClient.put('/settings/api', payload);
  },
};
