'use client';

import dynamic from 'next/dynamic';

// Import SupabaseConnectionTest with dynamic import in this client component
const SupabaseConnectionTest = dynamic(
  () => import('@/components/SupabaseConnectionTest'),
  { ssr: false }
);

export default function ClientComponentWrapper() {
  return <SupabaseConnectionTest />;
} 