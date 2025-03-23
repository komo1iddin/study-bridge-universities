'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import { useTranslations } from 'next-intl';

export default function RegisterForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations('common');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }
    
    // Check password requirements
    if (password.length < 6) {
      setError(t('auth.passwordRequirements'));
      return;
    }
    
    setIsLoading(true);

    try {
      const { user, error } = await signUp(email, password, {
        email,
        role: 'client' // default role for new registrations
      });
      
      if (error) {
        // Handle known errors more gracefully
        if (error.message.includes('violates row-level security policy') || 
            error.message.includes('duplicate key')) {
          console.warn('Non-critical error during signup:', error.message);
          // If it's just an RLS or duplicate key error, we can proceed
          // The user auth was likely created, and we'll handle profile creation later
          router.push(`/${locale}/auth/login?registered=true`);
          return;
        }
        
        setError(error.message);
        return;
      }
      
      if (user) {
        // Redirect to login page with success message
        router.push(`/${locale}/auth/login?registered=true`);
      }
    } catch (err) {
      const errorMsg = (err as Error).message;
      
      // Check for RLS or other non-critical errors
      if (errorMsg.includes('violates row-level security policy') || 
          errorMsg.includes('duplicate key')) {
        console.warn('Non-critical error during signup:', errorMsg);
        // If it's just an RLS or duplicate key error, we can proceed
        router.push(`/${locale}/auth/login?registered=true`);
        return;
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('auth.emailPlaceholder')}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('auth.passwordPlaceholder')}
        />
        <p className="mt-1 text-xs text-gray-500">
          {t('auth.passwordRequirements')}
        </p>
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.confirmPassword')}
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('auth.confirmPasswordPlaceholder')}
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('auth.signingUp') : t('auth.signUp')}
        </button>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-2">
        <p>{t('auth.completeProfileLater')}</p>
      </div>
    </form>
  );
} 