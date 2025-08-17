
import createMiddleware from 'next-intl/middleware';
import {locales, pathnames} from './navigation';
 
export default createMiddleware({
  defaultLocale: 'en',
  locales,
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
