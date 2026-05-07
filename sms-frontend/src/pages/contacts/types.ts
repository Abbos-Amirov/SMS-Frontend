export type ContactGroupOption = {
  id: string;
  label: string;
};

export type ContactRecord = {
  id: string;
  name: string;
  mobile: string;
  /** Xabar berish uchun ruxsat / status — demo */
  messageOk: boolean;
  groupId: string;
};
