'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter, usePathname, Link } from '@/i18n/utils';
import { useLocale, useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase-client';
import AdminLoopReset from '../debug/AdminLoopReset';
import SidebarWithTranslations from './SidebarWithTranslations';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { AdminControls } from './AdminControls';
import { motion, AnimatePresence } from 'framer-motion';

// Вынесем константы из компонента
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'my.main@example.com';
const TOKEN_EXPIRY = 60 * 60 * 24 * 7; // неделя

interface AdminLayoutProps {
  children: React.ReactNode;
  locale?: string;
}

export default function AdminLayout({ children, locale }: AdminLayoutProps) {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const currentLocale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('admin');
  
  // Use provided locale or fallback to current locale
  const activeLocale = locale || currentLocale;

  // Объединяем связанные состояния в один объект
  const [state, setState] = useState({
    sidebarCollapsed: false,
    isRedirecting: false,
    debugMode: false,
    hasAttemptedRefresh: false,
    isAdminViaSpecialCookie: false,
    adminAuthChecked: false,
    showLoopReset: false
  });

  // Вспомогательные функции для обновления состояния
  const updateState = useCallback((newState: Partial<typeof state>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  }, []);

  // Мемоизированные вычисления для предотвращения ререндеров
  const isAdminLoginPage = useMemo(() => pathname.endsWith('/admin/login'), [pathname]);
  const isMainAdminEmail = useMemo(() => user?.email === ADMIN_EMAIL, [user?.email]);
  const hasAdminAccess = useMemo(
    () => isMainAdminEmail || state.isAdminViaSpecialCookie,
    [isMainAdminEmail, state.isAdminViaSpecialCookie]
  );

  // Функция обнаружения циклов перенаправления
  const detectRedirectLoop = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const now = Date.now();
      const lastLoadTime = parseInt(localStorage.getItem('admin_last_load_time') || '0', 10);
      const loadCount = parseInt(localStorage.getItem('admin_load_count') || '0', 10);
      const timeSinceLastLoad = now - lastLoadTime;
      
      if (lastLoadTime > 0 && timeSinceLastLoad < 3000) {
        const newLoadCount = loadCount + 1;
        localStorage.setItem('admin_load_count', newLoadCount.toString());
        
        if (newLoadCount >= 3) {
          localStorage.setItem('loop_detected', 'true');
          updateState({ showLoopReset: true });
        }
      } else {
        localStorage.setItem('admin_load_count', '1');
      }
      
      localStorage.setItem('admin_last_load_time', now.toString());
    } catch (err) {
      // Избегаем console.log в продакшн-коде
      if (process.env.NODE_ENV !== 'production') {
        console.error('[AdminLayout] Error in loop detection:', err);
      }
    }
  }, []);

  // Проверка на администраторские права
  const checkAdminCookies = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Более централизованная проверка админ-куков
      const adminIndicators = [
        document.cookie.includes(`admin-auth-token=${ADMIN_EMAIL}`),
        document.cookie.includes(`admin-user-email=${ADMIN_EMAIL}`),
        localStorage.getItem('admin-auth-active') === 'true',
        sessionStorage.getItem('admin-auth-active') === 'true',
        localStorage.getItem('admin-user-email') === ADMIN_EMAIL,
        sessionStorage.getItem('admin-user-email') === ADMIN_EMAIL
      ];
      
      const hasAdminAccess = adminIndicators.some(Boolean);
      
      if (hasAdminAccess) {
        // Обновляем состояние один раз
        updateState({ 
          isAdminViaSpecialCookie: true,
          adminAuthChecked: true 
        });
        
        // Устанавливаем куки если необходимо
        if (!document.cookie.includes(`admin-auth-token=${ADMIN_EMAIL}`)) {
          document.cookie = `admin-auth-token=${ADMIN_EMAIL};path=/;max-age=${TOKEN_EXPIRY}`;
        }
        
        if (!document.cookie.includes(`admin-user-email=${ADMIN_EMAIL}`)) {
          document.cookie = `admin-user-email=${ADMIN_EMAIL};path=/;max-age=${TOKEN_EXPIRY}`;
        }
        
        // Упрощенная установка в хранилище
        const storageItems = {
          'admin-auth-active': 'true',
          'admin-user-email': ADMIN_EMAIL
        };
        
        Object.entries(storageItems).forEach(([key, value]) => {
          if (!localStorage.getItem(key)) localStorage.setItem(key, value);
          if (!sessionStorage.getItem(key)) sessionStorage.setItem(key, value);
        });
      } else {
        updateState({ adminAuthChecked: true });
      }
    } catch (err) {
      updateState({ adminAuthChecked: true });
    }
  }, []);

  // Проверка сессии и обновление при необходимости
  const checkForPotentialSession = useCallback(async () => {
    if (typeof window === 'undefined' || state.hasAttemptedRefresh || isAdminLoginPage) {
      return false;
    }
    
    try {
      // Проверка флага сессии
      if (localStorage.getItem('admin_session_checked') === 'true') {
        return false;
      }
      
      // Проверка наличия токенов
      const hasStorageToken = [
        localStorage.getItem('sb-auth-token'),
        sessionStorage.getItem('sb-auth-token'),
        localStorage.getItem('supabase-auth-token'),
        sessionStorage.getItem('supabase-auth-token'),
        localStorage.getItem('sb:token')
      ].some(Boolean);
      
      // Специальная проверка для админа
      if (state.isAdminViaSpecialCookie && !user) {
        // Вместо создания моковой сессии, перенаправляем на логин
        updateState({ hasAttemptedRefresh: true });
        localStorage.setItem('admin_session_checked', 'true');
        router.push('/admin/login');
        return true;
      }
      
      if (hasStorageToken && !user) {
        updateState({ hasAttemptedRefresh: true });
        localStorage.setItem('admin_session_checked', 'true');
        
        // Обновляем сессию
        const supabase = createClient();
        const { error } = await supabase.auth.refreshSession();
        
        if (!error) {
          setTimeout(() => window.location.reload(), 500);
          return true;
        }
      }
    } catch (err) {
      // Логгирование только в dev-режиме
      if (process.env.NODE_ENV !== 'production') {
        console.error('[AdminLayout] Error checking storage:', err);
      }
    }
    return false;
  }, [user, router, state.hasAttemptedRefresh, state.isAdminViaSpecialCookie, isAdminLoginPage]);

  // Эффект при монтировании компонента
  useEffect(() => {
    detectRedirectLoop();
    checkAdminCookies();
  }, [detectRedirectLoop, checkAdminCookies]);

  // Эффект авторизации 
  useEffect(() => {
    // Проверяем только когда загрузка завершена и проверка админ-куков выполнена
    if (isLoading || !state.adminAuthChecked || state.isRedirecting) {
      return;
    }

    // Пропускаем проверку для страницы логина
    if (isAdminLoginPage) {
      return;
    }

    // Проверяем на наличие потенциальной сессии 
    if (!user && !state.hasAttemptedRefresh) {
      checkForPotentialSession();
      return;
    }

    // Проверяем права доступа
    if (hasAdminAccess) {
      return; // У админа есть полный доступ
    }

    // Проверяем обычного пользователя
    if (!user || !profile || (profile.role !== 'admin' && profile.role !== 'manager')) {
      if (!state.debugMode) {
        updateState({ isRedirecting: true });
        router.push('/');
      }
    }
  }, [
    user, profile, isLoading, router, state.isRedirecting, state.debugMode,
    state.hasAttemptedRefresh, hasAdminAccess, isAdminLoginPage,
    state.adminAuthChecked, checkForPotentialSession
  ]);

  // Функция переключения сайдбара
  const handleSidebarToggle = useCallback((collapsed: boolean) => {
    updateState({ sidebarCollapsed: collapsed });
  }, [updateState]);

  const renderUserInfo = () => {
    if (!user) return null;
    
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {user?.email || 'Admin User'}
        </span>
      </div>
    );
  };

  const renderProfileMenuItem = () => {
    if (!user) return null;
    
    return (
      <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <Link href={`/profile/${user.id}`}>
          {t('profile')}
        </Link>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Отображение экрана загрузки
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>{t('common.loading')}...</p>
      </div>
    );
  }

  // Отображение сообщения о перенаправлении
  if (state.isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 font-medium">You don't have permission to access this area.</p>
          <p className="mt-2">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  // Отображение режима отладки для неавторизованных пользователей
  if (state.debugMode && (!user || !profile || (profile.role !== 'admin' && profile.role !== 'manager'))) {
    if (isAdminLoginPage) {
      return <>{children}</>;
    }
    
    if (hasAdminAccess) {
      return (
        <div className="flex min-h-screen bg-gray-100">
          <SidebarWithTranslations onToggleCollapse={handleSidebarToggle} />
          
          <div className={`flex-1 ${state.sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mx-4 mt-4">
              <div className="flex">
                <p className="text-sm font-bold mr-2">{t('layout.adminAccess')}:</p>
                <p className="text-sm">
                  {isMainAdminEmail && user
                    ? `${t('layout.authorizedVia')} ${t('layout.email')} (${user.email})`
                    : `${t('layout.authorizedVia')} ${t('layout.specialPrivileges')}`}
                </p>
              </div>
              <div className="text-xs mt-1">
                <span className="font-semibold">{t('layout.userId')}:</span> {user?.id || 'Not available'} | 
                <span className="font-semibold ml-2">{t('layout.profile')}:</span> {profile ? t('layout.found') : t('layout.notFound')} |
                <span className="font-semibold ml-2">{t('layout.metadataRole')}:</span> {user?.user_metadata?.role || t('layout.notSet')}
              </div>
            </div>
            <main className="p-0">{children}</main>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Admin Access Debug</h2>
          <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-60 text-sm">
            <h3 className="font-semibold mb-2">Authentication State:</h3>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
            <p><strong>Profile:</strong> {profile ? 'Loaded' : 'Not found'}</p>
            <p><strong>Role:</strong> {profile?.role || 'None'}</p>
            <p><strong>Admin Cookie:</strong> {state.isAdminViaSpecialCookie ? 'Present' : 'Not found'}</p>
            <p><strong>Path:</strong> {pathname}</p>
            <p><strong>Locale:</strong> {activeLocale}</p>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Home
            </button>
            <button 
              onClick={() => updateState({ debugMode: false })}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Для страницы логина отображаем без обертки
  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  // Финальный рендер для админов с дашбордом
  return (
    <div className="flex min-h-screen h-screen bg-gray-100 overflow-hidden">
      <SidebarWithTranslations onToggleCollapse={handleSidebarToggle} />
      
      <motion.div 
        className="flex flex-col flex-1"
        animate={{
          paddingLeft: state.sidebarCollapsed ? '5rem' : '18rem'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {/* Header with user info and admin controls */}
        <motion.div 
          className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6"
          variants={itemVariants}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center gap-4">
            {renderUserInfo()}
            {renderProfileMenuItem()}
          </div>
          
          {hasAdminAccess && (
            <AdminControls
              isMainAdmin={isMainAdminEmail}
              userEmail={user?.email}
              showLoopReset={
                state.showLoopReset ||
                localStorage?.getItem('loop_detected') === 'true' ||
                sessionStorage?.getItem('loop_detected') === 'true'
              }
            />
          )}
        </motion.div>

        {/* Main content */}
        <motion.main 
          className="flex-1 overflow-auto p-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </motion.div>
    </div>
  );
}
