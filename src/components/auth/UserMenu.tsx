'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/utils';
import { useAuth } from './AuthProvider';
import { useTranslations } from 'next-intl';
import LogoutButton from './LogoutButton';
import { createClient } from '@/lib/supabase-client';

export default function UserMenu({ locale }: { locale: string }) {
  const { user, profile, refreshProfile } = useAuth();
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [localUser, setLocalUser] = useState(user);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Check session status on initial render to ensure correct state
  useEffect(() => {
    const checkSession = async () => {
      console.log('[UserMenu] Component mounted, checking session status');
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[UserMenu] Session error:', error);
        }
        
        if (data.session) {
          console.log('[UserMenu] User is authenticated:', data.session.user.id);
          // If we have a session but no user in context, refresh the profile
          if (!user) {
            console.log('[UserMenu] Session exists but no user in context, refreshing profile');
            await refreshProfile();
          }
          setLocalUser(data.session.user);
        } else {
          console.log('[UserMenu] No active session found');
          setLocalUser(null);
        }
        
        setIsLoaded(true);
      } catch (e) {
        console.error('[UserMenu] Error checking session:', e);
        setIsLoaded(true);
      }
    };
    
    checkSession();
    
    // Set up session change listener
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[UserMenu] Auth state changed:', event);
      if (session) {
        setLocalUser(session.user);
      } else {
        setLocalUser(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [user, refreshProfile]);
  
  useEffect(() => {
    // Update local state when the auth context changes
    setLocalUser(user);
  }, [user]);

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

  // If the auth data is still loading, show a loading indicator
  if (!isLoaded) {
    return (
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="hidden md:block w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!localUser) {
    return (
      <div className="flex gap-2">
        <Link
          href="/auth/login"
          className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
        >
          {t('auth.login')}
        </Link>
        <Link
          href="/auth/register"
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
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          {profile?.first_name ? profile.first_name[0].toUpperCase() : localUser.email?.[0].toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium">
          {profile?.first_name || localUser.email?.split('@')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 text-xs text-gray-500">
              {localUser.email}
            </div>
            
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              {t('auth.profile')}
            </Link>
            
            <Link
              href="/applications"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              {t('auth.myApplications')}
            </Link>
            
            <div className="border-t border-gray-100"></div>
            
            <div className="px-4 py-2">
              <LogoutButton className="w-full text-left block px-0 py-0 text-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 