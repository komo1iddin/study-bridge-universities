export const defaultLocale = 'en';
export const locales = ['en', 'ru', 'uz'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  uz: 'O\'zbekcha',
};

export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return 'ltr'; // All our supported languages are left-to-right
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
} 