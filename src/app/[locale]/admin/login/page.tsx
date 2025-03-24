import { Metadata } from 'next';
import { Link } from '@/i18n/utils';
import { getTranslations } from '@/i18n/utils';
import { Locale } from '@/i18n/config';
import AdminLoginFormWrapper from '@/components/admin/auth/AdminLoginFormWrapper';

export const metadata: Metadata = {
  title: 'Admin Login | Study Bridge',
  description: 'Log in to your Study Bridge admin dashboard.',
};

export default async function AdminLoginPage({
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
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-auto w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-600 mt-2">
              Sign in to access the admin dashboard
            </p>
          </div>
          
          <AdminLoginFormWrapper locale={locale} />
          
          <div className="mt-6 text-center text-sm">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to home page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}