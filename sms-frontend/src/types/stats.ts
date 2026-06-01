export interface CampaignCounts {
  draft: number;
  scheduled: number;
  sending: number;
  done: number;
  total: number;
}

export interface DeviceCounts {
  online: number;
  offline: number;
  blocked: number;
  total: number;
}

export interface SmsCounts {
  sent: number;
  failed: number;
  delivered: number;
}

export interface SmsSeriesPoint {
  date: string;
  sent: number;
  failed: number;
}

export interface MemberStats {
  campaigns: CampaignCounts;
  devices: DeviceCounts;
  sms: SmsCounts;
  smsSeries: SmsSeriesPoint[];
}

export interface MemberCounts {
  active: number;
  blocked: number;
  deleted: number;
  total: number;
}

export interface AdminStats {
  members: MemberCounts;
  campaigns: CampaignCounts;
  devicesOnline: number;
  sms: SmsCounts;
  subscriptions: {
    byPlan: { BASIC: number; PRO: number; ENTERPRISE: number };
    byStatus: { ACTIVE: number; EXPIRED: number; CANCELLED: number };
  };
  smsSeries: SmsSeriesPoint[];
}
