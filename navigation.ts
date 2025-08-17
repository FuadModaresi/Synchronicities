
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en'] as const;

export const pathnames = {
  '/': '/',
  '/dashboard': {
    en: '/dashboard',
  },
  '/login': {
    en: '/login',
  },
} satisfies Record<string, any>;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, pathnames});

export type AppPathnames = keyof typeof pathnames;
