'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Locale } from '@/i18n/config';
import { supabase } from '@/lib/supabase';

interface PageParams {
  params: {
    locale: Locale;
  };
}

// Define types for our state
interface DashboardStats {
  universitiesCount: number;
  programsCount: number;
  usersCount: number;
  applicationsCount: number;
}

interface Application {
  id: string;
  status: string;
  created_at: string;
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  program?: {
    name?: string;
  };
}

export default function AdminDashboardPage({ params }: PageParams) {
  const { locale } = params;
  
  // Dashboard stats
  const [stats, setStats] = useState<DashboardStats>({
    universitiesCount: 0,
    programsCount: 0,
    usersCount: 0,
    applicationsCount: 0,
  });
  
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnosticLog, setDiagnosticLog] = useState<string[]>([]);

  // Add log message function
  const addLog = (message: string) => {
    setDiagnosticLog(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`]);
    console.log(message);
  };

  // Load dashboard data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);
        addLog("Starting dashboard data loading...");
        
        // Initialize stats object
        let newStats = {
          universitiesCount: 0,
          programsCount: 0,
          usersCount: 0,
          applicationsCount: 0,
        };
        
        // Direct queries with error handling for each table separately
        try {
          addLog("Querying universities...");
          const { data: universities, error: univError } = await supabase
            .from('universities')
            .select('id');
          
          if (univError) {
            addLog(`Universities error: ${univError.message}`);
          } else {
            newStats.universitiesCount = universities?.length || 0;
            addLog(`Universities count: ${newStats.universitiesCount}`);
          }
        } catch (univErr) {
          addLog(`Universities exception: ${(univErr as Error).message}`);
        }
        
        try {
          addLog("Querying programs...");
          const { data: programs, error: programError } = await supabase
            .from('programs')
            .select('id');
          
          if (programError) {
            addLog(`Programs error: ${programError.message}`);
          } else {
            newStats.programsCount = programs?.length || 0;
            addLog(`Programs count: ${newStats.programsCount}`);
          }
        } catch (programErr) {
          addLog(`Programs exception: ${(programErr as Error).message}`);
        }
        
        try {
          addLog("Querying users...");
          const { data: users, error: userError } = await supabase
            .from('users')
            .select('id');
          
          if (userError) {
            addLog(`Users error: ${userError.message}`);
          } else {
            newStats.usersCount = users?.length || 0;
            addLog(`Users count: ${newStats.usersCount}`);
          }
        } catch (userErr) {
          addLog(`Users exception: ${(userErr as Error).message}`);
        }
        
        try {
          addLog("Querying applications...");
          const { data: applications, error: appError } = await supabase
            .from('applications')
            .select('id');
          
          if (appError) {
            addLog(`Applications error: ${appError.message}`);
          } else {
            newStats.applicationsCount = applications?.length || 0;
            addLog(`Applications count: ${newStats.applicationsCount}`);
          }
        } catch (appErr) {
          addLog(`Applications exception: ${(appErr as Error).message}`);
        }
        
        // Update stats
        setStats(newStats);
        
        // Get recent applications
        try {
          addLog("Querying recent applications...");
          const { data: recentApps, error: recentAppsError } = await supabase
            .from('applications')
            .select('id, status, created_at, user:users(first_name, last_name, email), program:programs(name)')
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (recentAppsError) {
            addLog(`Recent applications error: ${recentAppsError.message}`);
          } else {
            addLog(`Recent applications: ${recentApps ? recentApps.length : 0} found`);
            const formattedApps = recentApps?.map(app => ({
              id: app.id,
              status: app.status,
              created_at: app.created_at,
              user: app.user || {},
              program: app.program || {}
            })) || [];
            setRecentApplications(formattedApps as Application[]);
          }
        } catch (recentErr) {
          addLog(`Recent applications exception: ${(recentErr as Error).message}`);
        }
        
        addLog("Dashboard data loading completed");
      } catch (err) {
        const errorMessage = (err as Error).message || 'Unknown error';
        addLog(`Fatal error: ${errorMessage}`);
        console.error('Error loading dashboard data:', err);
        setError(`Failed to load dashboard data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

  return (
    <div>
      <AdminHeader 
        title="Admin Dashboard" 
        breadcrumbs={[
          { name: 'Admin', href: '/admin' },
          { name: 'Dashboard' }
        ]}
      />
      
      <div className="p-6">
        {/* Diagnostic Logs */}
        <div className="bg-gray-50 border border-gray-200 rounded-md mb-6">
          <div className="px-4 py-2 bg-gray-100 font-semibold border-b border-gray-200">
            Diagnostic Logs
          </div>
          <div className="p-4 overflow-auto max-h-40 text-xs font-mono whitespace-pre-wrap">
            {diagnosticLog.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              diagnosticLog.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && !error && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Dashboard content */}
        {!isLoading && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Universities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.universitiesCount}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total universities in the system
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.programsCount}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total academic programs available
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.usersCount}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Registered users on the platform
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.applicationsCount}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total program applications submitted
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Applications */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Applications</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentApplications.length === 0 ? (
                  <div className="px-6 py-4 text-gray-500 text-center">
                    No recent applications found.
                  </div>
                ) : (
                  recentApplications.map((application) => (
                    <div key={application.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {application.user?.first_name || ''} {application.user?.last_name || ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          {application.program?.name || 'Unknown Program'}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          application.status === 'approved' || application.status === 'accepted'
                            ? 'bg-green-100 text-green-800' 
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 