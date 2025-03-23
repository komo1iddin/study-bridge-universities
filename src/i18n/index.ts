import { createNavigation } from 'next-intl/navigation';
import { defaultLocale, locales } from './config';

// This file serves as the main configuration for next-intl
// Export the configuration that next-intl expects
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
}); 