import type { ReactNode } from 'react';
import {
  IconChart,
  IconContacts,
  IconCredit,
  IconDevice,
  IconGrid,
  IconInbox,
  IconReply,
  IconSend,
  IconShield,
  IconTemplate,
  IconUser,
} from '../icons/UiIcons';

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
}

export interface NavSection {
  title?: string;
  adminOnly?: boolean;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { to: '/', label: 'Boshqaruv paneli', icon: <IconChart />, end: true },
      { to: '/campaigns', label: 'Kampaniyalar', icon: <IconSend /> },
      { to: '/contacts', label: 'Kontaktlar', icon: <IconContacts /> },
      { to: '/devices', label: 'Qurilmalar', icon: <IconDevice /> },
    ],
  },
  {
    title: 'Avtomatlashtirish',
    items: [
      { to: '/templates', label: 'Shablonlar', icon: <IconTemplate /> },
      { to: '/auto-reply', label: 'Avto-javob', icon: <IconReply /> },
      { to: '/sms-logs', label: 'SMS jurnali', icon: <IconInbox /> },
    ],
  },
  {
    title: 'Hisob',
    items: [
      { to: '/subscription', label: 'Obuna', icon: <IconCredit /> },
      { to: '/profile', label: 'Profil', icon: <IconUser /> },
    ],
  },
  {
    title: 'Administrator',
    adminOnly: true,
    items: [
      { to: '/admin', label: 'Admin panel', icon: <IconGrid />, end: true },
      { to: '/admin/members', label: 'Aʼzolar', icon: <IconContacts /> },
      { to: '/admin/subscriptions', label: 'Obunalar', icon: <IconShield /> },
      { to: '/admin/sms-logs', label: 'Global SMS jurnali', icon: <IconInbox /> },
    ],
  },
];
