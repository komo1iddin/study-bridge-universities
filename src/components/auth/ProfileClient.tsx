'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile, getUserProfile } from '@/lib/auth';
import { useTranslations } from 'next-intl';
import { User } from '@/types/database.types';
import { useAuth } from './AuthProvider';
import { createBrowserClient } from '@supabase/ssr';

type ProfileClientProps = {
  locale: string;
  initialProfile: User | null;
};

export default function ProfileClient({ locale, initialProfile }: ProfileClientProps) {
  const router = useRouter();
  const t = useTranslations('common');
  const { user } = useAuth();
  
  const [firstName, setFirstName] = useState(initialProfile?.first_name || '');
  const [lastName, setLastName] = useState(initialProfile?.last_name || '');
  const [email, setEmail] = useState(initialProfile?.email || user?.email || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [address, setAddress] = useState(initialProfile?.address || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileMissing, setProfileMissing] = useState(!initialProfile && !!user);
  const [profile, setProfile] = useState<User | null>(initialProfile);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Debug session state on component mount
  useEffect(() => {
    const checkSession = async () => {
      console.log('[ProfileClient] Checking session on client side');
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log('[ProfileClient] Session check result:', data.session ? 'Authenticated' : 'No session');
        
        if (error) {
          console.error('[ProfileClient] Session error:', error);
          setError('Session error: ' + error.message);
        }
        
        if (!data.session) {
          console.warn('[ProfileClient] No active session found on client');
          setError('No active session found. Please login again.');
          return;
        }
        
        if (!profile) {
          console.log('[ProfileClient] No profile data found, will attempt to create/fetch');
          fetchOrCreateProfile(data.session.user.id);
        }
      } catch (e) {
        console.error('[ProfileClient] Unexpected error checking session:', e);
        setError('Unexpected error: ' + (e instanceof Error ? e.message : String(e)));
      }
    };
    
    checkSession();
  }, []);

  const fetchOrCreateProfile = async (userId: string) => {
    console.log('[ProfileClient] Fetching or creating profile for user:', userId);
    setLoading(true);
    setError(null);
    
    try {
      // First try to fetch existing profile
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        console.log('[ProfileClient] Existing profile found:', data);
        setProfile(data);
      } else if (error) {
        console.warn('[ProfileClient] Error fetching profile:', error.message);
        
        // Try to create a new profile
        console.log('[ProfileClient] Attempting to create new profile');
        
        // Get user email from session
        const { data: sessionData } = await supabase.auth.getSession();
        const email = sessionData.session?.user?.email;
        
        if (!email) {
          throw new Error('Could not determine user email from session');
        }
        
        // Call API to create profile
        const response = await fetch('/api/auth/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            userData: {
              email,
              role: 'student',
            }
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create profile');
        }
        
        const createdProfile = await response.json();
        console.log('[ProfileClient] Successfully created profile:', createdProfile);
        setProfile(createdProfile);
        setSuccessMessage('Profile created successfully');
      }
    } catch (e) {
      console.error('[ProfileClient] Profile fetch/create error:', e);
      setError('Error: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const { profile, error } = await updateUserProfile({
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (profile) {
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(null), 3000);
        setProfileMissing(false);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
        <p className="text-gray-500 text-sm">Update your personal information.</p>
        
        {profileMissing && (
          <div className="mt-2 p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
            Please complete your profile information to continue using all features.
          </div>
        )}
        
        {(!firstName || !lastName || !phone) && (
          <div className="mt-2 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
            Please complete your profile by adding your personal details.
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : profile ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.firstName')}
                {!firstName && <span className="text-blue-600 ml-1">*</span>}
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.firstNamePlaceholder')}
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.lastName')}
                {!lastName && <span className="text-blue-600 ml-1">*</span>}
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.lastNamePlaceholder')}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed directly.
            </p>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.phone')}
              {!phone && <span className="text-blue-600 ml-1">*</span>}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('auth.phonePlaceholder')}
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your address"
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-5">
          <p>No profile found. Creating a new profile...</p>
        </div>
      )}
    </div>
  );
} 