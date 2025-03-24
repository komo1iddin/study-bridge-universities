// Redirect exports from index.ts
export { Link, redirect, usePathname, useRouter } from './index';

import { getRequestConfig } from 'next-intl/server';
import type { RequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

// Create getTranslations function for server components
export async function getTranslations(
  locale: string,
  namespaces: string[] = ['common']
) {
  const translations: Record<string, any> = {};
  
  for (const namespace of namespaces) {
    try {
      const module = await import(`./locales/${locale}/${namespace}.json`);
      translations[namespace] = module.default || module;
    } catch (error) {
      console.error(`Could not load translations for namespace ${namespace} in locale ${locale}`, error);
      
      // Fallback to default locale if translation is missing
      if (locale !== defaultLocale) {
        try {
          const fallbackModule = await import(`./locales/${defaultLocale}/${namespace}.json`);
          translations[namespace] = fallbackModule.default || fallbackModule;
        } catch (fallbackError) {
          console.error(`Could not load fallback translations for namespace ${namespace}`, fallbackError);
          translations[namespace] = {};
        }
      } else {
        translations[namespace] = {};
      }
    }
  }
  
  return translations;
}

// Function to get messages for client components
export async function getMessages(locale: string = defaultLocale) {
  return {
    messages: await getTranslations(locale, ['common', 'admin'])
  };
}

// Request config for next-intl
