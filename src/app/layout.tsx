import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export const metadata: Metadata = {
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Redirect to the default locale route
  redirect(`/${defaultLocale}`);
  
  // This will never be rendered due to the redirect
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
