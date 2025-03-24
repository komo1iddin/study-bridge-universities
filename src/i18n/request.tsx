import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';
import { getTranslations } from './utils';

// Request config for next-intl
export default getRequestConfig(async ({ locale = defaultLocale }) => {
  return {
    locale,
    messages: await getTranslations(locale, ['common', 'admin']),
    timeZone: 'UTC'
  };
}); 