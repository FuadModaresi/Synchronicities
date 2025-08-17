
import createMiddleware from 'next-intl/middleware';
import {locales, pathnames} from './navigation';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  pathnames,
});

export const config = {
  matcher: [
    '/',
    '/(en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
