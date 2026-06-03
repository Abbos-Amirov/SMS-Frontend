// Admin contact shown in the "Administrator bilan bog'laning" dialog when a member
// requests a plan. Sales-led model: no self-serve checkout and no deep links that
// open another window — the member just sees the phone + Telegram to reach out.
// Configure in .env (falls back to the values below):
//   VITE_SUPPORT_PHONE=+998911786007
//   VITE_SUPPORT_TELEGRAM=Bunyod_IYB   (username without @)
const PHONE = (import.meta.env.VITE_SUPPORT_PHONE as string | undefined)?.trim() || '+998911786007';
const TELEGRAM = (import.meta.env.VITE_SUPPORT_TELEGRAM as string | undefined)?.trim() || 'Bunyod_IYB';

export interface SupportContact {
  phone: string;
  /** Telegram username including the leading @. */
  telegram: string;
}

export function getSupportContact(): SupportContact {
  return { phone: PHONE, telegram: '@' + TELEGRAM.replace(/^@/, '') };
}
