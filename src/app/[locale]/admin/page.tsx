import AdminHeader from '@/components/admin/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n/config';
import { Link } from '@/i18n/utils';
import { useTranslations } from 'next-intl';
import { getTranslations } from '@/i18n/utils';

interface PageParams {
  params: {
    locale: Locale;
  };
}

export default async function AdminDashboardPage({ params }: PageParams) {
  // In Next.js 15, we need to ensure params is fully resolved
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  const t = await getTranslations(locale, ['admin']);

  // Stats data (would be fetched from API in a real scenario)
  const stats = [
    { key: 'totalUniversities', value: '32', icon: '🏛️', href: '/admin/universities' },
    { key: 'activePrograms', value: '124', icon: '📚', href: '/admin/programs' },
    { key: 'availableScholarships', value: '18', icon: '🎓', href: '/admin/scholarships' },
    { key: 'registeredUsers', value: '215', icon: '👥', href: '/admin/users' },
  ];

  // Recent activity data (would be fetched from API)
  const recentActivity = [
    { action: 'newUser', time: '5', timeUnit: 'minutesAgo', user: 'john.doe@example.com' },
    { action: 'programUpdated', time: '2', timeUnit: 'hoursAgo', user: 'admin@studybridge.com', item: 'Computer Science (Tsinghua University)' },
    { action: 'newUniversity', time: '1', timeUnit: 'daysAgo', user: 'admin@studybridge.com', item: 'Beijing Normal University' },
    { action: 'scholarshipUpdated', time: '2', timeUnit: 'daysAgo', user: 'manager@studybridge.com', item: 'CSC Scholarship 2023' },
  ];

  return (
    <div>
      <AdminHeader 
        title={t.admin.dashboard.title} 
        breadcrumbs={[
          { name: t.admin.common.admin, href: '/admin' },
          { name: t.admin.dashboard.title }
        ]}
      />
      
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.href} className="block">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">{t.admin.dashboard.stats[stat.key]}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      </dd>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">{t.admin.common.viewAll} <span aria-hidden="true">&rarr;</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Main content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">{t.admin.dashboard.recentActivity.title}</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{t.admin.dashboard.recentActivity[activity.action]}</p>
                    <p className="text-sm text-gray-500">{activity.time} {t.admin.dashboard.recentActivity.time[activity.timeUnit]}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{t.admin.dashboard.recentActivity.by}: {activity.user}</p>
                    {activity.item && <p className="text-sm text-gray-500">{t.admin.dashboard.recentActivity.item}: {activity.item}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">{t.admin.dashboard.recentActivity.viewAll}</Button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">{t.admin.dashboard.quickActions.title}</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/universities/new">
                <Button variant="outline" className="w-full justify-start h-auto py-3 border-blue-200 hover:border-blue-300">
                  <div className="flex flex-col items-start">
                    <span className="text-blue-600 text-lg mb-1">{t.admin.dashboard.quickActions.addUniversity}</span>
                    <span className="text-xs text-gray-500">{t.admin.dashboard.quickActions.addUniversityDesc}</span>
                  </div>
                </Button>
              </Link>
              
              <Link href="/admin/programs/new">
                <Button variant="outline" className="w-full justify-start h-auto py-3 border-green-200 hover:border-green-300">
                  <div className="flex flex-col items-start">
                    <span className="text-green-600 text-lg mb-1">{t.admin.dashboard.quickActions.addProgram}</span>
                    <span className="text-xs text-gray-500">{t.admin.dashboard.quickActions.addProgramDesc}</span>
                  </div>
                </Button>
              </Link>
              
              <Link href="/admin/scholarships/new">
                <Button variant="outline" className="w-full justify-start h-auto py-3 border-purple-200 hover:border-purple-300">
                  <div className="flex flex-col items-start">
                    <span className="text-purple-600 text-lg mb-1">{t.admin.dashboard.quickActions.addScholarship}</span>
                    <span className="text-xs text-gray-500">{t.admin.dashboard.quickActions.addScholarshipDesc}</span>
                  </div>
                </Button>
              </Link>
              
              <Link href="/admin/users/new">
                <Button variant="outline" className="w-full justify-start h-auto py-3 border-orange-200 hover:border-orange-300">
                  <div className="flex flex-col items-start">
                    <span className="text-orange-600 text-lg mb-1">{t.admin.dashboard.quickActions.addAdminUser}</span>
                    <span className="text-xs text-gray-500">{t.admin.dashboard.quickActions.addAdminUserDesc}</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 