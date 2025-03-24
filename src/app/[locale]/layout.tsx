import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "../globals.css";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from '@/i18n/utils';
import { locales, Locale } from '@/i18n/config';
import Navbar from '@/components/layout/navigation/Navbar';
import ClientAuthWrapper from '@/components/auth/ClientAuthWrapper';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/contexts/ToastContext';

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
  const { locale } = await params;
  
  try {
    if (!locales.includes(locale)) {
      notFound();
    }

    const messages = await getTranslations(locale);

    return (
      <html 
        lang={locale} 
        className="antialiased"
        suppressHydrationWarning={true}
      >
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body 
          className={`${GeistSans.variable} ${GeistMono.variable}`}
          suppressHydrationWarning={true}
        >
          <NextIntlClientProvider 
            locale={locale} 
            messages={messages}
            timeZone="UTC"
          >
            <ClientAuthWrapper>
              <ToastProvider>
                <Navbar />
                <main>
                  {children}
                </main>
                <Footer />
              </ToastProvider>
            </ClientAuthWrapper>
          </NextIntlClientProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    notFound();
  }
}
