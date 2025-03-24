'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from '@/lib/auth';
import { useRouter, Link } from '@/i18n/utils';
import { useTranslations } from 'next-intl';

interface AdminHeaderProps {
  title: string;
  breadcrumbs?: {
    name: string;
    href?: string;
  }[];
  actions?: React.ReactNode;
}

export default function AdminHeader({ title, breadcrumbs = [], actions }: AdminHeaderProps) {
  const { profile } = useAuth();
  const router = useRouter();
  const t = useTranslations('admin');

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-white to-blue-50 border-b border-gray-200 shadow-sm mx-6 rounded-lg">
      <div className="px-6 py-4 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('layout.title')}</h1>
            
            {breadcrumbs.length > 0 && (
              <nav className="flex mt-1" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 text-sm">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index} className="inline-flex items-center">
                      {index > 0 && (
                        <svg className="w-3 h-3 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                      )}
                      {breadcrumb.href ? (
                        <Link href={breadcrumb.href} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                          {t(`sidebar.${breadcrumb.name.toLowerCase()}`)}
                        </Link>
                      ) : (
                        <span className="text-gray-500">{t(`sidebar.${breadcrumb.name.toLowerCase()}`)}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
          
          <div className="flex items-center">
            {actions && <div className="mr-4">{actions}</div>}
            
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none bg-white rounded-full pl-2 pr-4 py-1.5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {profile?.first_name ? profile.first_name[0] : 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {profile?.first_name || t('common.admin')}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-56 py-2 bg-white rounded-lg shadow-xl z-50 hidden group-hover:block border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 text-xs text-gray-500 border-b border-gray-100 bg-gray-50 uppercase font-semibold tracking-wider">
                  {t('header.profile')}
                </div>
                <Link
                  href="/admin/settings"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                >
                  <svg className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('header.settings')}
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                >
                  <svg className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('header.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg className="h-4 w-4 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('header.logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 