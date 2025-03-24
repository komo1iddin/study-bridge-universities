'use client';

import { Suspense } from 'react';
import { Locale } from '@/i18n/config';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { RecentApplicationsList } from '@/components/admin/dashboard/RecentApplicationsList';
import { useAdminDashboardStats, useRecentApplications } from '@/hooks/admin/useAdminDashboard';

interface PageParams {
  params: {
    locale: Locale;
  };
}

function DashboardContent() {
  // Use React Query hooks
  const { 
    data: stats,
    isLoading: isStatsLoading,
    error: statsError
  } = useAdminDashboardStats();

  const {
    data: recentApplications = [], // Provide empty array as default value
    isLoading: isApplicationsLoading,
    error: applicationsError
  } = useRecentApplications(1, 5);

  return (
    <div className="p-6">
      {/* Error messages */}
      {(statsError || applicationsError) && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
          {statsError instanceof Error ? statsError.message : ''}
          {applicationsError instanceof Error ? applicationsError.message : ''}
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Universities"
          value={stats?.universitiesCount}
          loading={isStatsLoading}
        />
        <StatsCard
          title="Active Programs"
          value={stats?.programsCount}
          loading={isStatsLoading}
        />
        <StatsCard
          title="Registered Users"
          value={stats?.usersCount}
          loading={isStatsLoading}
        />
        <StatsCard
          title="Total Applications"
          value={stats?.applicationsCount}
          loading={isStatsLoading}
        />
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow">
        <RecentApplicationsList
          applications={recentApplications}
          loading={isApplicationsLoading}
          error={applicationsError instanceof Error ? applicationsError : undefined}
        />
      </div>
    </div>
  );
}

export default function AdminDashboardPage({ params }: PageParams) {
  return (
    <div>
      <AdminHeader 
        title="Admin Dashboard" 
        breadcrumbs={[
          { name: 'Admin', href: '/admin' },
          { name: 'Dashboard' }
        ]}
      />
      
      <Suspense fallback={
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <StatsCard key={i} title="" loading={true} />
            ))}
          </div>
          <div className="bg-white rounded-lg shadow">
            <RecentApplicationsList applications={[]} loading={true} />
          </div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
} 