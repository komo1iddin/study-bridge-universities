import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { getTranslations } from '@/i18n/utils';
import { Locale } from '@/i18n/config';

export const metadata: Metadata = {
  title: 'Login | Study Bridge',
  description: 'Log in to your Study Bridge account to manage your university applications and more.',
};

export default async function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
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
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {t('auth.signIn')}
          </h1>
          
          <LoginForm locale={locale} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.noAccount')}{' '}
              <Link 
                href={`/${locale}/auth/register`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('auth.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 