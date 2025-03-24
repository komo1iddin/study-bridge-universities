'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLoopReset from '../debug/AdminLoopReset';

interface AdminControlsProps {
  isMainAdmin: boolean;
  userEmail?: string | null;
  showLoopReset: boolean;
}

export function AdminControls({ isMainAdmin, userEmail, showLoopReset }: AdminControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('layout');

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings className="h-4 w-4" />
        <span className="hidden md:inline">{t('adminControls')}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900">{t('adminControls')}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {isMainAdmin
                  ? `${t('authorizedVia')} ${t('email')} (${userEmail})`
                  : `${t('authorizedVia')} ${t('specialPrivileges')}`}
              </p>
            </div>

            {showLoopReset && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-start gap-2 text-amber-600 mb-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <h3 className="text-sm font-medium">{t('loopDetected')}</h3>
                </div>
                <AdminLoopReset />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 