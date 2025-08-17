
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import type {Pathnames} from 'next-intl/navigation';

export const locales = ['en', 'fa'] as const;

export const pathnames = {
  '/': '/',
  '/dashboard': {
    en: '/dashboard',
    fa: '/dashboard',
  },
  '/login': {
    en: '/login',
    fa: '/login',
  },
} satisfies Pathnames<typeof locales>;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, pathnames});

export type AppPathnames = keyof typeof pathnames;
