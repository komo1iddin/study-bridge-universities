import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

// This page will only be shown if the middleware doesn't intercept the request
export default function RootPage() {
  // Redirect to the default locale
  redirect(`/${defaultLocale}`);
  
  // This will never be rendered due to the redirect
  return null;
}
