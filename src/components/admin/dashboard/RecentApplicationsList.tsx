'use client';

import { FC } from 'react';
import { Application } from '@/hooks/admin/useAdminDashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTableToolbar } from '@/components/admin/data/DataTableToolbar';
import { DataTablePagination } from '@/components/admin/data/DataTablePagination';
import { useTranslations } from 'next-intl';

interface RecentApplicationsListProps {
  applications: Application[];
  loading?: boolean;
  error?: Error;
}

export function RecentApplicationsList({ applications, loading = false, error }: RecentApplicationsListProps) {
  const t = useTranslations('admin');

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-4">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          {t('applications.recent')}
        </h2>
      </div>

      <div className="min-h-[400px] relative"> {/* Add relative positioning */}
        {/* Loading skeleton with transition */}
        <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out bg-white ${loading ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}>
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content with transition */}
        <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${loading ? 'opacity-0 -z-10' : 'opacity-100 z-10'}`}>
          {applications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {t('applications.noResults')}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div 
                  key={application.id} 
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {application.user?.first_name?.[0] || 'U'}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {application.program?.name || t('applications.unknownProgram')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {application.user?.first_name} {application.user?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize transition-colors duration-200
                      ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {t(`status.${application.status}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 