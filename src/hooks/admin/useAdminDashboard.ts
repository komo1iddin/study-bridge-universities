import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Types
export interface DashboardStats {
  universitiesCount: number;
  programsCount: number;
  usersCount: number;
  applicationsCount: number;
}

interface SupabaseUser {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

interface SupabaseProgram {
  name: string | null;
}

interface SupabaseApplication {
  id: string;
  status: string;
  created_at: string;
  user: SupabaseUser | null;
  program: SupabaseProgram | null;
}

export interface Application {
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

// Fetch functions
async function fetchDashboardStats(): Promise<DashboardStats> {
  // Fetch all counts in parallel
  const [
    { count: universitiesCount },
    { count: programsCount },
    { count: usersCount },
    { count: applicationsCount },
  ] = await Promise.all([
    supabase.from('universities').select('*', { count: 'exact', head: true }),
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
  ]);

  return {
    universitiesCount: universitiesCount || 0,
    programsCount: programsCount || 0,
    usersCount: usersCount || 0,
    applicationsCount: applicationsCount || 0,
  };
}

async function fetchRecentApplications(page = 1, pageSize = 5): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('id, status, created_at, user:users(first_name, last_name, email), program:programs(name)')
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) throw error;

  // First cast to unknown, then to our specific type
  const applications = (data as unknown) as SupabaseApplication[];
  
  return (applications || []).map(app => ({
    id: app.id,
    status: app.status,
    created_at: app.created_at,
    user: app.user ? {
      first_name: app.user.first_name || undefined,
      last_name: app.user.last_name || undefined,
      email: app.user.email || undefined,
    } : undefined,
    program: app.program ? {
      name: app.program.name || undefined,
    } : undefined,
  }));
}

// Hooks
export function useAdminDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: Infinity, // Never mark data as stale
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
}

export function useRecentApplications(page = 1, pageSize = 5) {
  return useQuery<Application[], Error>({
    queryKey: ['admin', 'applications', 'recent', { page, pageSize }],
    queryFn: () => fetchRecentApplications(page, pageSize),
    staleTime: Infinity, // Never mark data as stale
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
} 