
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'fa'] as const;

export const pathnames = {
  '/': '/',
  '/dashboard': {
    en: '/dashboard',
    fa: '/dashboard',
  },
  '/zen-sphere': {
    en: '/zen-sphere',
    fa: '/zen-sphere',
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
