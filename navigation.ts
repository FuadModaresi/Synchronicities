
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'fa'] as const;

export const pathnames = {
  '/': '/',
  '/dashboard': {
    en: '/dashboard',
    fa: '/dashboard',
  },
  '/zen-room': {
    en: '/zen-room',
    fa: '/zen-room',
  },
  '/help': {
    en: '/help',
    fa: '/help',
  },
  '/settings': {
    en: '/settings',
    fa: '/settings',
  }
} satisfies Record<string, any>;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, pathnames});

export type AppPathnames = keyof typeof pathnames;
