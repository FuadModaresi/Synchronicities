
import createMiddleware from 'next-intl/middleware';
import {locales, pathnames} from './navigation';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale: 'en',
  pathnames,
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/(fa|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
