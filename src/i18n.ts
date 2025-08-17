import {getRequestConfig} from 'next-intl/server';
import {Pathnames} from 'next-intl/navigation';

export const locales = ['en', 'fa'] as const;

export const pathnames = {
  '/': '/',
  '/dashboard': {
    en: '/dashboard',
    fa: '/dashboard',
  },
} satisfies Pathnames<typeof locales>;

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

// Use the default export for consistency
export type AppPathnames = keyof typeof pathnames;