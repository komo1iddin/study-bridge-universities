'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/utils';
import React from 'react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export default function LanguageSwitcher({ 
  className = '', 
  variant = 'default' 
}: LanguageSwitcherProps) {
  const t = useTranslations('common');
  const locale = useLocale();

  const languages = [
    { code: 'en', name: 'English', shortName: 'EN' },
    { code: 'ru', name: 'Русский', shortName: 'RU' },
    { code: 'uz', name: 'O\'zbek', shortName: 'UZ' }
  ];

  // Compact variant for navbar
  if (variant === 'compact') {
    return (
      <div className={`flex gap-1 items-center ${className}`}>
        {languages.map((language) => (
          <Link 
            key={language.code}
            href="/" 
            locale={language.code} 
            className={`px-2 py-1 text-xs font-medium rounded ${
              locale === language.code 
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
            {language.shortName}
          </Link>
        ))}
      </div>
    );
  }

  // Default full variant
  return (
    <div className={`${className}`}>
      <p className="mb-2 font-medium">{t('languageSwitcher')}</p>
      <div className="flex gap-2">
        {languages.map((language) => (
          <Link 
            key={language.code}
            href="/" 
            locale={language.code} 
            className={`px-3 py-1 border rounded hover:bg-gray-100 ${
              locale === language.code ? 'bg-blue-50 border-blue-200' : ''
            }`}>
            {language.name}
          </Link>
        ))}
      </div>
    </div>
  );
} 