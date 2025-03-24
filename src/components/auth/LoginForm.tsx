'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth';
import { useLocale, useTranslations } from 'next-intl';
import { useToast } from '@/contexts/ToastContext';
import { redirectWithLocale } from '@/lib/session-utils';
import { createClient } from '@/lib/supabase-client';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('common');
  const { showToast } = useToast();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      console.log('Starting login process...');
      const { user, error } = await signIn(email, password);
      
      if (error) {
        console.error('Sign-in error:', error.message);
        setError(error.message);
        showToast(error.message, 'error');
        setIsLoading(false);
        return;
      }
      
      if (user) {
        console.log('Login successful for user:', user.id);
        // Show success toast and set success state
        showToast('Login successful', 'success');
        setIsSuccess(true);
        
        // Get the redirect URL from search params, or default to profile
        const redirectPath = searchParams.get('redirect') || `/profile`;
        console.log('Will redirect to:', redirectPath);
        
        // DEBUGGING: Check session before redirect
        try {
          // Call our session API to ensure cookies are set properly
          const sessionResponse = await fetch('/api/auth/session');
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            console.log('API session check:', sessionData.user ? 'Authenticated' : 'No session');
          } else {
            console.warn('Session API check failed:', await sessionResponse.text());
          }
          
          // Also check client session
          const { data } = await supabase.auth.getSession();
          console.log('Client session check:', data.session ? 'Valid' : 'Invalid');
          if (data.session) {
            console.log('Client session details:', {
              userId: data.session.user.id,
              expiresAt: data.session.expires_at,
              hasAuthToken: !!data.session.access_token,
              hasRefreshToken: !!data.session.refresh_token
            });
          }
        } catch (sessionErr) {
          console.error('Error checking session:', sessionErr);
        }
        
        // Redirect with hash to help preserve session
        setTimeout(async () => {
          console.log('After delay, redirecting to:', redirectPath);
          try {
            // Force a final session refresh before redirect
            await supabase.auth.refreshSession();
            
            // Add a hash to help preserve session state during redirect
            redirectWithLocale(locale, `${redirectPath}#session-preserved`);
          } catch (err) {
            console.error('Error before redirect:', err);
            // Redirect anyway
            redirectWithLocale(locale, redirectPath);
          }
        }, 1500); // Wait 1.5 seconds
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setIsLoading(false);
      const errorMsg = (err as Error).message;
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  }, [email, password, locale, searchParams, showToast, supabase.auth]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {isSuccess && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
          Login successful! Redirecting you...
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
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            {t('auth.rememberMe')}
          </label>
        </div>
        
        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            {t('auth.forgotPassword')}
          </a>
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('auth.signingIn') : isSuccess ? 'Redirecting...' : t('auth.signIn')}
        </button>
      </div>
    </form>
  );
} 