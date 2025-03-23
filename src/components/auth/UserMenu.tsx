'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/utils';
import { useAuth } from './AuthProvider';
import { useTranslations } from 'next-intl';
import LogoutButton from './LogoutButton';

export default function UserMenu({ locale }: { locale: string }) {
  const { user, profile } = useAuth();
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link
          href={`/${locale}/auth/login`}
          className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
        >
          {t('auth.login')}
        </Link>
        <Link
          href={`/${locale}/auth/register`}
          className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          {t('auth.register')}
        </Link>
      </div>
    );
  }

  // User is authenticated
  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          {profile?.first_name ? profile.first_name[0].toUpperCase() : user.email?.[0].toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium">
          {profile?.first_name || user.email?.split('@')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 text-xs text-gray-500">
              {user.email}
            </div>
            
            <Link
              href={`/${locale}/profile`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              {t('auth.profile')}
            </Link>
            
            <Link
              href={`/${locale}/applications`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              {t('auth.myApplications')}
            </Link>
            
            <div className="border-t border-gray-100"></div>
            
            <div className="px-4 py-2">
              <LogoutButton locale={locale} className="w-full text-left block px-0 py-0 text-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 