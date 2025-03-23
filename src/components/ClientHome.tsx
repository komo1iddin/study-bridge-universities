'use client';

import { Link } from '@/i18n/utils';
import React from 'react';

interface ClientHomeProps {
  translations: {
    home?: Record<string, any>;
    common?: Record<string, any>;
  };
}

export default function ClientHome({ translations }: ClientHomeProps) {
  const t = (key: string): string => {
    const parts = key.split('.');
    let result: any = translations.home;
    
    for (const part of parts) {
      if (result && typeof result === 'object') {
        result = result[part];
      } else {
        return key; // Fallback to the key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : key;
  };
  
  const commonT = (key: string): string => {
    const parts = key.split('.');
    let result: any = translations.common;
    
    for (const part of parts) {
      if (result && typeof result === 'object') {
        result = result[part];
      } else {
        return key; // Fallback to the key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : key;
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="container mx-auto">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('hero.title')}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/universities" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
              {t('hero.browseButton')}
            </Link>
            <Link href="/contact" className="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg font-medium">
              {t('hero.contactButton')}
            </Link>
          </div>
        </section>

        {/* Universities Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('universities.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto">{t('universities.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* University cards would go here */}
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="h-40 bg-gray-100 rounded-md mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Tsinghua University</h3>
              <p className="text-gray-600 mb-4">Beijing, China | Rank: #1</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="h-40 bg-gray-100 rounded-md mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Peking University</h3>
              <p className="text-gray-600 mb-4">Beijing, China | Rank: #2</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="h-40 bg-gray-100 rounded-md mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Fudan University</h3>
              <p className="text-gray-600 mb-4">Shanghai, China | Rank: #3</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/universities" className="text-blue-600 hover:text-blue-800 font-medium">
              {t('universities.viewAllButton')} →
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 rounded-xl p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto">{t('features.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.info.title')}</h3>
              <p className="text-gray-600">{t('features.info.description')}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.search.title')}</h3>
              <p className="text-gray-600">{t('features.search.description')}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.tracking.title')}</h3>
              <p className="text-gray-600">{t('features.tracking.description')}</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">{t('cta.subtitle')}</p>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
            {t('cta.button')}
          </Link>
        </section>
      </div>
    </main>
  );
} 