import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'fa'] as const;
export const localePrefix = 'always'; // Default

export const pathnames = {
  '/': '/',
  '/dashboard': {
    en: '/dashboard',
    fa: '/dashboard',
  },
};

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createLocalizedPathnamesNavigation({
    locales,
    localePrefix,
    pathnames: pathnames as typeof pathnames & Record<string & {}, string>,
  });
