'use client';

import { useState, useCallback } from 'react';
import { signUp } from '@/lib/auth';
import { useLocale, useTranslations } from 'next-intl';
import { useToast } from '@/contexts/ToastContext';
import { redirectWithLocale } from '@/lib/session-utils';

export default function RegisterForm() {
  const locale = useLocale();
  const t = useTranslations('common');
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setIsSuccess(false);

    // Check if passwords match
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      setIsLoading(false);
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      console.log('Starting registration process...');
      const { user, error } = await signUp(email, password, { role: 'client' });
      
      if (error) {
        console.error('Registration error:', error.message);
        setError(error.message);
        showToast(error.message, 'error');
        setIsLoading(false);
        return;
      }
      
      if (user) {
        console.log('Registration successful for user:', user.id);
        showToast('Account created successfully', 'success');
        setIsSuccess(true);
        
        // Use our utility function for redirection
        redirectWithLocale(locale, '/auth/login');
      }
    } catch (err) {
      console.error('Unexpected error during registration:', err);
      setIsLoading(false);
      const errorMsg = (err as Error).message;
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  }, [email, password, passwordConfirm, locale, showToast]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {isSuccess && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
          Account created successfully! Redirecting you to login...
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
      </div>
      
      <div>
        <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.confirmPassword')}
        </label>
        <input
          id="password-confirm"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('auth.confirmPasswordPlaceholder')}
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('auth.signingUp') : isSuccess ? 'Redirecting...' : t('auth.signUp')}
        </button>
      </div>
    </form>
  );
} 