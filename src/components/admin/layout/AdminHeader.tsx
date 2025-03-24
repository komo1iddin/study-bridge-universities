'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from '@/lib/auth';
import { useRouter, Link } from '@/i18n/utils';

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

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          
          {breadcrumbs.length > 0 && (
            <nav className="flex mt-1" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={index} className="inline-flex items-center">
                    {index > 0 && (
                      <svg className="w-3 h-3 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                    )}
                    {breadcrumb.href ? (
                      <Link href={breadcrumb.href} className="text-blue-600 hover:underline">
                        {breadcrumb.name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">{breadcrumb.name}</span>
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
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {profile?.first_name ? profile.first_name[0] : 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {profile?.first_name || 'Admin'}
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
            
            <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50 hidden group-hover:block">
              <Link
                href="/admin/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 