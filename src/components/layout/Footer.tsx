'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/utils';
import { useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common');
  const locale = useLocale();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href={`/${locale}`} className="text-xl font-bold text-blue-600">
              {t('appName')}
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              {t('footer.copyright')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <Link
              href={`/${locale}/about`}
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              {t('footer.about')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              {t('navigation.contact')}
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              {t('footer.terms')}
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 