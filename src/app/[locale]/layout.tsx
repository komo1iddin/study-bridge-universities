import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "../globals.css";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from '@/i18n/utils';
import { locales, Locale } from '@/i18n/config';
import Navbar from '@/components/navigation/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'Study Bridge - Your Path to Education in China',
    template: '%s | Study Bridge'
  },
  description: 'Study Bridge helps international students find and apply to universities in China.',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  // Ожидаем получение параметров
  const { locale } = await params;
  
  try {
    if (!locales.includes(locale)) {
      notFound();
    }

    const messages = await getTranslations(locale);

    return (
      <html lang={locale} suppressHydrationWarning>
        <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
          <NextIntlClientProvider 
            locale={locale} 
            messages={messages}
            timeZone="UTC"
          >
            <Navbar />
            <main>
              {children}
            </main>
          </NextIntlClientProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    notFound();
  }
}
