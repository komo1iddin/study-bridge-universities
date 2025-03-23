'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { useTranslations } from 'next-intl';

export default function LogoutButton({ locale, className = '' }: { locale: string, className?: string }) {
  const router = useRouter();
  const t = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const { success, error } = await signOut();
      
      if (error) {
        console.error('Error logging out:', error);
        return;
      }
      
      if (success) {
        router.push(`/${locale}`);
        router.refresh();
      }
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`text-red-600 hover:text-red-800 font-medium ${className}`}
    >
      {isLoading ? '...' : t('auth.signOut')}
    </button>
  );
} 