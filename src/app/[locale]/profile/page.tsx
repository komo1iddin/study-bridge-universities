import { Metadata } from 'next';
import { getTranslations } from '@/i18n/utils';
import ProfileClient from '@/components/auth/ProfileClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/server-supabase';

export const metadata: Metadata = {
  title: 'My Profile | Study Bridge',
  description: 'Manage your Study Bridge profile and view your applications.',
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // Await params if it's a Promise, otherwise use it directly
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  // Use our enhanced server client
  const supabase = createServerSupabaseClient();
  
  // Check if the user is authenticated
  console.log('Checking authentication on profile page...');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Error checking session:', sessionError);
  }
  
  console.log('Session check result:', session ? 'User authenticated' : 'No session found');
  
  if (!session) {
    // If not authenticated, redirect to login page
    console.log('Redirecting to login page due to no session');
    redirect(`/${locale}/auth/login?redirect=/profile`);
  }
  
  console.log('User authenticated, proceeding to load profile data');
  
  // Get user profile data - might not exist due to RLS issues during signup
  let profile = null;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (!error) {
      profile = data;
      console.log('Profile loaded successfully');
    } else {
      console.warn('Could not load profile, will create in client component:', error.message);
    }
  } catch (error) {
    console.error('Unexpected error loading profile:', error);
  }
  
  const translations = await getTranslations(locale, ['common']);
  const t = (key: string) => {
    const parts = key.split('.');
    let current = translations.common;
    for (const part of parts) {
      if (current[part] === undefined) return key;
      current = current[part];
    }
    return current;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('auth.profile')}</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ProfileClient 
          locale={locale}
          initialProfile={profile}
        />
      </div>
    </div>
  );
} 