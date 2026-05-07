export type AutoReplyRule = {
  id: string;
  triggerMessage: string;
  replyBody: string;
  conditionLabel: string;
  allowed: boolean;
};

export type AutoReplySortKey = 'trigger' | 'reply' | 'condition' | 'allowed';

export const AUTO_REPLY_CONDITIONS: string[] = [
  '100% aniqlik (Katta-kichik harflar hisobga olinmasin)',
  'Qisman mos (so‘zlardan biri)',
  'Faqat boshlanishi bilan moslash',
];
