// String-literal unions mirroring the backend enums verbatim.

export type MemberRole = 'OWNER' | 'ADMIN' | 'USER';
export type MemberStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED';
export type MemberAuthType = 'EMAIL' | 'PHONE';

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'BLOCKED';
export type DevicePlatform = 'ANDROID' | 'IOS';

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'DONE';
export type CampaignRecipientStatus = 'PENDING' | 'PROCESSING' | 'SENT' | 'FAILED';

export type ContactStatus = 'ACTIVE' | 'ARCHIVED';

export type SubscriptionPlan = 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export type SmsLogStatus = 'SENT' | 'FAILED' | 'DELIVERED';

export type TemplateStatus = 'ACTIVE' | 'ARCHIVED';

export type AutoReplyMatchType = 'EXACT' | 'CONTAINS' | 'PREFIX';
export type AutoReplyStatus = 'ACTIVE' | 'ARCHIVED';

export type Direction = 'asc' | 'desc';
