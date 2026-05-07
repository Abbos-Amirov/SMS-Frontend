import type { ContactGroupOption, ContactRecord } from './types';

export const DEMO_GROUPS: ContactGroupOption[] = [
  { id: 'g_all', label: 'Barcha guruhlar' },
  { id: 'g1002', label: '[1002] Mijozlar bazasi 1' },
  { id: 'gvip', label: '[1003] VIP mijozlar' },
];

/** Demo serverlar uchun select */
export const DEMO_SERVERS_TAGS = ['Galaxy S5 [108]', 'Gateway-UZ [12]'];

export const DEMO_CONTACTS: ContactRecord[] = [
  {
    id: '1',
    name: 'Mijoz',
    mobile: '+998999999999',
    messageOk: true,
    groupId: 'g1002',
  },
  {
    id: '2',
    name: 'Dilshoda Q.',
    mobile: '+998901112233',
    messageOk: true,
    groupId: 'g1002',
  },
  {
    id: '3',
    name: 'Sardor T.',
    mobile: '+998977007700',
    messageOk: false,
    groupId: 'gvip',
  },
];
