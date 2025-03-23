import { createNavigation } from 'next-intl/navigation';
import { getRequestConfig } from 'next-intl/server';
import type { RequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

// Create navigation helpers
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix: 'as-needed'
});

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
    messages: await getTranslations(locale, ['common'])
  };
}

// Request config for next-intl
export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await getTranslations(locale || defaultLocale, ['common'])),
  } as RequestConfig;
}); 