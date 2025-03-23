'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile, getUserProfile } from '@/lib/auth';
import { useTranslations } from 'next-intl';
import { User } from '@/types/database.types';
import { useAuth } from './AuthProvider';

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

  // Check if we need to create a profile
  useEffect(() => {
    if (profileMissing && user) {
      const createProfile = async () => {
        try {
          setIsLoading(true);
          
          // Try to create the profile using the API endpoint
          const response = await fetch('/api/auth/create-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              userData: {
                email: user.email,
                role: 'client',
              },
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Profile created or found:', data.message);
            
            // Try to load the profile after creation
            const { profile, error } = await getUserProfile();
            
            if (error) {
              console.warn('Error getting user profile after creation:', error.message);
              setError('Please fill in your profile information to complete registration.');
            } else if (profile) {
              // We found a profile, update state
              setFirstName(profile.first_name || '');
              setLastName(profile.last_name || '');
              setPhone(profile.phone || '');
              setAddress(profile.address || '');
              setProfileMissing(false);
            }
          } else {
            const errorData = await response.json();
            console.error('Error creating profile:', errorData);
            setError('Failed to create your profile. Please try again.');
          }
        } catch (err) {
          console.error('Unexpected error checking/creating profile:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      createProfile();
    }
  }, [profileMissing, user]);

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
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-md text-sm">
          {success}
        </div>
      )}
      
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
    </div>
  );
} 