'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

// Dynamically import the AdminLoginForm component
const AdminLoginForm = dynamic(
  () => import('./AdminLoginForm'),
  { ssr: false }
);

interface AdminLoginFormWrapperProps {
  locale?: string;
}

export default function AdminLoginFormWrapper({ locale: propLocale }: AdminLoginFormWrapperProps) {
  // Get locale from params if not provided as a prop
  const params = useParams();
  const localeFromParams = params?.locale as string;
  const locale = propLocale || localeFromParams;
  
  console.log('[AdminLoginFormWrapper] Rendering with locale:', { 
    propLocale, 
    localeFromParams, 
    finalLocale: locale 
  });
  
  return (
    <Suspense fallback={<div className="py-4 text-center">Loading login form...</div>}>
      <AdminLoginForm localeOverride={locale} />
    </Suspense>
  );
} 