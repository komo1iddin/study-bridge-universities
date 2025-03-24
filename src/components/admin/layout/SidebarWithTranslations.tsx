'use client';

import { useState } from 'react';
import { Link } from '@/i18n/utils';
import { useRouter } from '@/i18n/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLocale } from 'next-intl';
import { signOut } from '@/lib/auth';
import { NextIntlClientProvider } from 'next-intl';

// Admin navigation items with icons
const navigationItems = [
  {
    id: 'dashboard',
    href: '/admin',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    id: 'universities',
    href: '/admin/universities',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    id: 'programs',
    href: '/admin/programs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    id: 'scholarships',
    href: '/admin/scholarships',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 'users',
    href: '/admin/users',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    id: 'settings',
    href: '/admin/settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

interface SidebarWithTranslationsProps {
  onToggleCollapse: (collapsed: boolean) => void;
}

export default function SidebarWithTranslations({ onToggleCollapse }: SidebarWithTranslationsProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useAuth();
  const locale = useLocale();
  const router = useRouter();

  console.log('[SidebarWithTranslations] Current locale:', locale);

  // Create translations object that matches the structure expected in the component
  const translations = {
    admin: {
      sidebar: {
        dashboard: locale === 'ru' ? "Панель управления" : locale === 'uz' ? "Boshqaruv paneli" : "Dashboard",
        universities: locale === 'ru' ? "Университеты" : locale === 'uz' ? "Universitetlar" : "Universities",
        programs: locale === 'ru' ? "Программы" : locale === 'uz' ? "Dasturlar" : "Programs",
        scholarships: locale === 'ru' ? "Стипендии" : locale === 'uz' ? "Stipendiyalar" : "Scholarships",
        users: locale === 'ru' ? "Пользователи" : locale === 'uz' ? "Foydalanuvchilar" : "Users",
        settings: locale === 'ru' ? "Настройки" : locale === 'uz' ? "Sozlamalar" : "Settings",
        returnToSite: locale === 'ru' ? "Вернуться на сайт" : locale === 'uz' ? "Saytga qaytish" : "Return to Site",
        logout: locale === 'ru' ? "Выйти" : locale === 'uz' ? "Chiqish" : "Logout",
        toggleSidebar: locale === 'ru' ? "Переключить боковую панель" : locale === 'uz' ? "Yon panelni almashtirish" : "Toggle Sidebar"
      },
      common: {
        admin: locale === 'ru' ? "Администратор" : locale === 'uz' ? "Administrator" : "Admin"
      }
    }
  };

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsedState);
    }
  };

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    // Remove locale from current path for comparison
    const currentPath = pathname.replace(new RegExp(`^/${locale}`), '');
    
    // Match exact path or sub-paths
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  // Add handleLogout function
  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <NextIntlClientProvider locale={locale} messages={translations}>
      <div
        className={`bg-white text-gray-700 shadow-lg ${
          collapsed ? 'w-20' : 'w-72'
        } h-screen overflow-y-auto flex-shrink-0 fixed top-0 left-0 z-40 border-r border-gray-200`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="text-xl font-bold text-blue-600 transition-all duration-300">
              StudyBridge <span className="text-blue-500">Admin</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className={`p-2 rounded-md hover:bg-gray-100 text-gray-500 ${collapsed ? 'mx-auto' : 'ml-auto'}`}
            aria-label="Toggle Sidebar"
          >
            {collapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>

        {/* User info */}
        <div className={`px-4 py-5 border-b border-gray-200 ${collapsed ? 'text-center' : ''}`}>
          <div className={`flex ${collapsed ? 'justify-center' : 'items-center'}`}>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-lg">
              {profile?.first_name ? profile.first_name[0] : 'A'}
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-800">
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.email || "Admin"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{profile?.role || 'admin'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = isPathActive(item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out 
                    ${isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <span className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{item.icon}</span>
                    {!collapsed && (
                      <span className={`ml-3 font-medium ${isActive ? 'text-blue-600' : ''}`}>
                        {translations.admin.sidebar[item.id as keyof typeof translations.admin.sidebar]}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom buttons at the bottom */}
        <div className={`absolute bottom-0 w-full border-t border-gray-200 p-4 bg-white ${collapsed ? 'space-y-4' : 'space-y-3'}`}>
          <Link
            href="/"
            className={`flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-100 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {!collapsed && <span className="ml-3 font-medium">{translations.admin.sidebar.returnToSite}</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200 w-full px-4 py-2 rounded-lg hover:bg-gray-100 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {!collapsed && <span className="ml-3 font-medium">{translations.admin.sidebar.logout}</span>}
          </button>
        </div>
      </div>
    </NextIntlClientProvider>
  );
} 