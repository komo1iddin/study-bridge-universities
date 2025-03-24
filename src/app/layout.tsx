import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";

export const metadata: Metadata = {
  title: 'Study Bridge',
  description: 'Find universities, programs and scholarships in China for international students',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Just render children directly without HTML/body tags
  // The [locale]/layout.tsx will handle the HTML structure
  return children;
}
