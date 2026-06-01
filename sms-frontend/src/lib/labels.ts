// Uzbek display labels + status → pill-tone mappings for all enums.
import type {
  AutoReplyMatchType,
  CampaignStatus,
  ContactStatus,
  DeviceStatus,
  MemberRole,
  MemberStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  SmsLogStatus,
} from '../types';

export type PillTone = 'success' | 'warn' | 'danger' | 'neutral' | 'accent';

export const campaignStatusLabel: Record<CampaignStatus, string> = {
  DRAFT: 'Qoralama',
  SCHEDULED: 'Rejalashtirilgan',
  SENDING: 'Yuborilmoqda',
  DONE: 'Yakunlangan',
};
export const campaignStatusTone: Record<CampaignStatus, PillTone> = {
  DRAFT: 'neutral',
  SCHEDULED: 'accent',
  SENDING: 'warn',
  DONE: 'success',
};

export const deviceStatusLabel: Record<DeviceStatus, string> = {
  ONLINE: 'Onlayn',
  OFFLINE: 'Oflayn',
  BLOCKED: 'Bloklangan',
};
export const deviceStatusTone: Record<DeviceStatus, PillTone> = {
  ONLINE: 'success',
  OFFLINE: 'neutral',
  BLOCKED: 'danger',
};

export const contactStatusLabel: Record<ContactStatus, string> = {
  ACTIVE: 'Faol',
  ARCHIVED: 'Arxivlangan',
};
export const contactStatusTone: Record<ContactStatus, PillTone> = {
  ACTIVE: 'success',
  ARCHIVED: 'neutral',
};

export const memberStatusLabel: Record<MemberStatus, string> = {
  ACTIVE: 'Faol',
  BLOCKED: 'Bloklangan',
  DELETED: "O'chirilgan",
};
export const memberStatusTone: Record<MemberStatus, PillTone> = {
  ACTIVE: 'success',
  BLOCKED: 'danger',
  DELETED: 'neutral',
};

export const memberRoleLabel: Record<MemberRole, string> = {
  OWNER: 'Egasi',
  ADMIN: 'Administrator',
  USER: 'Foydalanuvchi',
};

export const subscriptionStatusLabel: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Faol',
  EXPIRED: 'Muddati tugagan',
  CANCELLED: 'Bekor qilingan',
};
export const subscriptionStatusTone: Record<SubscriptionStatus, PillTone> = {
  ACTIVE: 'success',
  EXPIRED: 'warn',
  CANCELLED: 'danger',
};

export const subscriptionPlanLabel: Record<SubscriptionPlan, string> = {
  BASIC: 'Basic',
  PRO: 'Pro',
  ENTERPRISE: 'Enterprise',
};

export const smsLogStatusLabel: Record<SmsLogStatus, string> = {
  SENT: 'Yuborildi',
  FAILED: 'Xato',
  DELIVERED: 'Yetkazildi',
};
export const smsLogStatusTone: Record<SmsLogStatus, PillTone> = {
  SENT: 'success',
  FAILED: 'danger',
  DELIVERED: 'accent',
};

export const autoReplyMatchLabel: Record<AutoReplyMatchType, string> = {
  EXACT: 'Aniq mos',
  CONTAINS: 'Ichida bor',
  PREFIX: 'Boshlanishi',
};
