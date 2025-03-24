import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { Providers } from '@/providers/Providers';

export const metadata: Metadata = {
  title: "StudyBridge",
  description: "StudyBridge - Your Bridge to Global Education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
