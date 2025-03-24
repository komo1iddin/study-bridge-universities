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
    <div className="min-h-screen bg-gray-50 bg-[url('/assets/images/grid-pattern.svg')] bg-fixed">
      <AdminHeader 
        title={t.admin.dashboard.title} 
        breadcrumbs={[
          { name: t.admin.common.admin, href: '/admin' },
          { name: t.admin.dashboard.title }
        ]}
      />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome section */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-semibold mb-2">👋 {t.admin.dashboard.title}</h2>
          <p className="text-blue-100 max-w-3xl">
            Welcome to the StudyBridge admin dashboard. Here you can manage universities, programs, 
            scholarships, and users. Get started by viewing your recent activity below or using the quick actions.
          </p>
        </div>
      
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.href} className="block transform transition-all duration-300 hover:-translate-y-1 hover:scale-105">
              <div className="bg-white overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className={`px-6 py-6 ${
                  index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  index === 1 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                  'bg-gradient-to-r from-orange-500 to-orange-600'
                } text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <dt className="text-sm font-medium truncate opacity-90">{t.admin.dashboard.stats[stat.key]}</dt>
                      <dd className="mt-2">
                        <div className="text-3xl font-bold">{stat.value}</div>
                      </dd>
                    </div>
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-end items-center">
                  <span className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center">
                    {t.admin.common.viewAll} 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Summary section */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">
              The platform currently hosts <span className="font-semibold text-gray-900">32</span> universities with <span className="font-semibold text-gray-900">124</span> active programs. 
              There are <span className="font-semibold text-gray-900">18</span> available scholarships for students to apply for.
            </p>
          </div>
        </div>
        
        {/* Main content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm backdrop-filter border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{t.admin.dashboard.recentActivity.title}</h3>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1">Today</span>
            </div>
            <div className="px-6 py-4">
              <ul className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="relative pl-6 pb-6 last:pb-0 border-l border-gray-200 last:border-transparent">
                    {/* Activity dot */}
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white" 
                      style={{
                        backgroundColor: activity.action === 'newUser' ? '#3b82f6' : 
                                        activity.action === 'programUpdated' ? '#10b981' :
                                        activity.action === 'newUniversity' ? '#8b5cf6' : '#f97316'
                      }}>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {t.admin.dashboard.recentActivity[activity.action]}
                        </p>
                        <p className="text-xs font-medium text-gray-500 bg-gray-50 rounded-full px-2 py-1 ml-2">
                          {activity.time} {t.admin.dashboard.recentActivity.time[activity.timeUnit]}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="mb-1">
                          <span className="font-medium text-gray-700">{t.admin.dashboard.recentActivity.by}:</span> {activity.user}
                        </p>
                        {activity.item && (
                          <p>
                            <span className="font-medium text-gray-700">{t.admin.dashboard.recentActivity.item}:</span> {activity.item}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
              <Button variant="ghost" 
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium text-sm inline-flex items-center gap-1">
                {t.admin.dashboard.recentActivity.viewAll} 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-sm backdrop-filter border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{t.admin.dashboard.quickActions.title}</h3>
              <span className="text-xs font-medium text-gray-500">4 {t.admin.common.actions}</span>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/universities/new">
                <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-blue-100 hover:border-blue-200">
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                  <div className="p-5 pl-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-blue-600">{t.admin.dashboard.quickActions.addUniversity}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{t.admin.dashboard.quickActions.addUniversityDesc}</p>
                    <div className="flex justify-end">
                      <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.admin.common.create}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/programs/new">
                <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-green-100 hover:border-green-200">
                  <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                  <div className="p-5 pl-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg bg-green-50 text-green-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-green-600">{t.admin.dashboard.quickActions.addProgram}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{t.admin.dashboard.quickActions.addProgramDesc}</p>
                    <div className="flex justify-end">
                      <span className="text-xs uppercase tracking-wider text-green-600 font-semibold inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.admin.common.create}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/scholarships/new">
                <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-purple-100 hover:border-purple-200">
                  <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                  <div className="p-5 pl-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-purple-600">{t.admin.dashboard.quickActions.addScholarship}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{t.admin.dashboard.quickActions.addScholarshipDesc}</p>
                    <div className="flex justify-end">
                      <span className="text-xs uppercase tracking-wider text-purple-600 font-semibold inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.admin.common.create}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/users/new">
                <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-orange-100 hover:border-orange-200">
                  <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                  <div className="p-5 pl-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg bg-orange-50 text-orange-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-orange-600">{t.admin.dashboard.quickActions.addAdminUser}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{t.admin.dashboard.quickActions.addAdminUserDesc}</p>
                    <div className="flex justify-end">
                      <span className="text-xs uppercase tracking-wider text-orange-600 font-semibold inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.admin.common.create}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 