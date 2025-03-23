import createMiddleware from 'next-intl/middleware';
import { locales } from './src/i18n/config';

// Define the default locale explicitly here to avoid import issues
const defaultLocale = 'en';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ru', 'uz'],
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en',
  
  // Locale prefix strategy
  localePrefix: 'as-needed'
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 