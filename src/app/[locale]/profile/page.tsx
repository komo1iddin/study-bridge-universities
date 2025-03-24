import { Metadata } from 'next';
import { getTranslations } from '@/i18n/utils';
import ProfileClient from '@/components/auth/ProfileClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
  
  // Create a Supabase client for server-side rendering
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // This is a server component, we can't set cookies here
        },
        remove(name: string, options: any) {
          // This is a server component, we can't remove cookies here
        },
      },
    }
  );
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // If not authenticated, redirect to login page
    redirect(`/${locale}/auth/login`);
  }
  
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