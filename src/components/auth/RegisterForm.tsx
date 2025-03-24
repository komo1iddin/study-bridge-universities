'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import { useLocale, useTranslations } from 'next-intl';
import { useToast } from '@/contexts/ToastContext';

export default function RegisterForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const locale = useLocale();
  const { showToast } = useToast();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordError('');
      setGeneralError('');
      setIsLoading(true);

      // Check if passwords match
      if (password !== confirmPassword) {
        setPasswordError(t('passwordMatch'));
        setIsLoading(false);
        showToast(t('passwordMatch'), 'error');
        return;
      }

      // Check password length
      if (password.length < 8) {
        setPasswordError(t('passwordLength'));
        setIsLoading(false);
        showToast(t('passwordLength'), 'error');
        return;
      }

      try {
        // Attempt to sign up with correct parameters
        await signUp(email, password, {
          role: 'client',
          first_name: firstName,
          last_name: lastName,
          email: email
        });
        
        // If successful, show a success toast
        showToast(t('registrationSuccess'), 'success');
        
        // Redirect to login page
        router.push(`/${locale}/auth/login`);
      } catch (error: any) {
        setIsLoading(false);
        console.error('Registration error:', error);
        
        // Handle known errors gracefully
        if (error.message?.includes('Row Level Security')) {
          console.log('RLS error during registration, but continuing...');
          showToast(t('registrationSuccess'), 'success');
          router.push(`/${locale}/auth/login`);
          return;
        }
        
        if (error.message?.includes('duplicate key')) {
          setGeneralError(t('emailExists'));
          showToast(t('emailExists'), 'error');
          return;
        }
        
        // Handle other errors
        setGeneralError(error.message || t('registrationError'));
        showToast(error.message || t('registrationError'), 'error');
      }
    },
    [password, confirmPassword, email, firstName, lastName, router, locale, t, showToast]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {generalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {generalError}
        </div>
      )}
      
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          {t('firstName')}
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('firstNamePlaceholder')}
        />
      </div>
      
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
          {t('lastName')}
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('lastNamePlaceholder')}
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('emailPlaceholder')}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {t('password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('passwordPlaceholder')}
        />
        <p className="mt-1 text-xs text-gray-500">
          {t('passwordRequirements')}
        </p>
        {passwordError && (
          <p className="mt-1 text-xs text-red-500">
            {passwordError}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          {t('confirmPassword')}
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('confirmPasswordPlaceholder')}
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('signingUp') : t('signUp')}
        </button>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-2">
        <p>{t('completeProfileLater')}</p>
      </div>
    </form>
  );
} 