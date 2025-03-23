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
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  // Validate that the locale is supported
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load common translations that will be available across the app
  const messages = await getTranslations(locale as Locale);

  return (
    <html lang={locale}>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
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
}