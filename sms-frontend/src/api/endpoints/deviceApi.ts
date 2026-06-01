import type { Device, DeviceCreated, DevicePlatform, InquiryParams, ListResponse } from '../../types';
import { apiSlice } from '../apiSlice';

export interface CreateDeviceBody {
  name: string;
  platform?: DevicePlatform;
  phone?: string;
}

export const deviceApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getDevices: build.query<ListResponse<Device>, InquiryParams | void>({
      query: (params) => ({ url: '/device', params: params ?? undefined }),
      providesTags: ['Device'],
    }),
    createDevice: build.mutation<DeviceCreated, CreateDeviceBody>({
      query: (data) => ({ url: '/device', method: 'POST', data }),
      invalidatesTags: ['Device'],
    }),
    resetDeviceCode: build.mutation<DeviceCreated, string>({
      query: (id) => ({ url: `/device/${id}/reset-code`, method: 'POST' }),
      invalidatesTags: ['Device'],
    }),
    revokeDevice: build.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/device/${id}/revoke`, method: 'POST' }),
      invalidatesTags: ['Device'],
    }),
  }),
});

export const { useGetDevicesQuery, useCreateDeviceMutation, useResetDeviceCodeMutation, useRevokeDeviceMutation } = deviceApi;
