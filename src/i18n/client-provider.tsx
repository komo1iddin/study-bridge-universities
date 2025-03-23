'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface ClientProviderProps {
  locale: string;
  messages: Record<string, any>;
  children: ReactNode;
}

export default function ClientProvider({
  locale,
  messages,
  children
}: ClientProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
} 