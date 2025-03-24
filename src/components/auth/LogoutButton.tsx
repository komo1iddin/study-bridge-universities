'use client';

import { useState, useCallback } from 'react';
import { signOut } from '@/lib/auth';
import { useLocale, useTranslations } from 'next-intl';
import { useToast } from '@/contexts/ToastContext';
import { redirectWithLocale } from '@/lib/session-utils';

export default function LogoutButton({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations('common');
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      console.log('Starting logout process...');
      const { success, error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        showToast(error.message, 'error');
        setIsLoading(false);
        return;
      }
      
      if (success) {
        console.log('Logout successful');
        showToast('Logged out successfully', 'success');
        setIsSuccess(true);
        
        // Use our utility function for redirection
        redirectWithLocale(locale, '/');
      }
    } catch (err) {
      console.error('Unexpected error during logout:', err);
      setIsLoading(false);
      const errorMsg = (err as Error).message;
      showToast(errorMsg, 'error');
    }
  }, [locale, showToast]);

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading || isSuccess}
      className={`flex items-center text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      {isLoading ? t('auth.loggingOut') : isSuccess ? 'Redirecting...' : t('auth.signOut')}
    </button>
  );
} 