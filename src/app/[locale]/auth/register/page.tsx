import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { getTranslations } from '@/i18n/utils';

export const metadata: Metadata = {
  title: 'Sign Up | Study Bridge',
  description: 'Create a new account on Study Bridge to apply for universities in China and manage your applications.',
};

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // Await params if it's a Promise, otherwise use it directly
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
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
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-3">
            {t('auth.createAccount')}
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            Just enter your email and password to get started. You can add personal details later.
          </p>
          
          <RegisterForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.haveAccount')}{' '}
              <Link 
                href={`/${locale}/auth/login`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 