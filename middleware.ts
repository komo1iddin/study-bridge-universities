import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

// This middleware handles i18n routing
export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,
  
  // Locale prefix strategy - use always to avoid redirect loops
  localePrefix: 'always',
  
  // Normalize pathnames to avoid inconsistencies
  pathnames: {
    '/': '/',
    '/universities': '/universities',
    '/programs': '/programs',
    '/about': '/about',
    '/contact': '/contact',
  }
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 