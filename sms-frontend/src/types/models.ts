import type {
  AutoReplyMatchType,
  AutoReplyStatus,
  CampaignStatus,
  ContactStatus,
  DevicePlatform,
  DeviceStatus,
  MemberAuthType,
  MemberRole,
  MemberStatus,
  SmsLogStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  TemplateStatus,
} from './enums';

export interface Member {
  _id: string;
  memberStatus: MemberStatus;
  memberRole: MemberRole;
  memberAuthType: MemberAuthType;
  memberEmail: string;
  memberPhone?: string;
  memberFirstName: string;
  memberLastName?: string;
  memberCompanyName?: string;
  memberImage?: string;
  memberDevices: number;
  memberContacts: number;
  memberCampaigns: number;
  memberSentSms: number;
  memberFailedSms: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  member: Member;
}

export interface Device {
  _id: string;
  memberId: string;
  code: string;
  name: string;
  status: DeviceStatus;
  platform?: DevicePlatform;
  phone?: string;
  carrier?: string;
  networkType?: string;
  batteryLevel?: number;
  appVersion?: string;
  lastSeenAt?: string;
  pairedAt?: string;
  currentLoad: number;
  sendLimitPerMinute: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceCreated {
  deviceId: string;
  code: string;
  name: string;
  status: DeviceStatus;
}

export interface Campaign {
  _id: string;
  memberId: string;
  title: string;
  message: string;
  status: CampaignStatus;
  scheduledAt?: string;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignProgress {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
}

export interface CampaignDetail extends Campaign {
  progress: CampaignProgress;
}

export interface Contact {
  _id: string;
  memberId: string;
  name?: string;
  phone: string;
  status: ContactStatus;
  tags: string[];
  groupIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactGroup {
  _id: string;
  memberId: string;
  name: string;
  description?: string;
  color: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  memberId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startsAt: string;
  expiresAt?: string;
  deviceLimit?: number | null;
  dailySmsLimit?: number | null;
  note?: string;
  activatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  _id: string;
  code: SubscriptionPlan;
  name: string;
  price: number | null;
  currency: string;
  dailySmsLimit: number | null;
  deviceLimit: number | null;
  durationDays: number | null;
  description: string;
  features: string[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SmsLog {
  _id: string;
  memberId?: string;
  deviceId?: string;
  campaignId?: string;
  contactId?: string;
  phone?: string;
  message?: string;
  status: SmsLogStatus;
  providerResponse?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  _id: string;
  memberId: string;
  name: string;
  body: string;
  variables: string[];
  locale?: string;
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AutoReply {
  _id: string;
  memberId: string;
  triggerText: string;
  replyBody: string;
  matchType: AutoReplyMatchType;
  enabled: boolean;
  deviceId?: string;
  status: AutoReplyStatus;
  createdAt: string;
  updatedAt: string;
}
