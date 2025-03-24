import { supabase } from '@/lib/supabase';
import { University, Program, Scholarship, User, Application } from '@/types/database.types';

/**
 * Admin database operations
 * These functions are used in the admin panel for CRUD operations
 */

// === UNIVERSITIES MANAGEMENT ===

/**
 * Get all universities with pagination
 */
export async function getAdminUniversities({ page = 1, limit = 10, search = '' }) {
  // Calculate offset based on page and limit
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('universities')
    .select('*', { count: 'exact' });
  
  // Add search filter if provided
  if (search) {
    query = query.or(`name.ilike.%${search}%, chinese_name.ilike.%${search}%, city.ilike.%${search}%`);
  }
  
  // Add pagination
  const { data, error, count } = await query
    .order('name')
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error fetching universities:', error);
    throw error;
  }
  
  return {
    universities: data || [],
    total: count || 0,
    page,
    limit
  };
}

/**
 * Get a single university by ID with related program count
 */
export async function getAdminUniversityById(id: string) {
  const { data, error } = await supabase
    .from('universities')
    .select('*, programs:programs(count)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching university ${id}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Create a new university
 */
export async function createUniversity(university: Partial<University>) {
  const { data, error } = await supabase
    .from('universities')
    .insert(university)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating university:', error);
    throw error;
  }
  
  return data;
}

/**
 * Update an existing university
 */
export async function updateUniversity(id: string, university: Partial<University>) {
  const { data, error } = await supabase
    .from('universities')
    .update(university)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating university ${id}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Delete a university
 */
export async function deleteUniversity(id: string) {
  const { error } = await supabase
    .from('universities')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting university ${id}:`, error);
    throw error;
  }
  
  return true;
}

// === PROGRAMS MANAGEMENT ===

/**
 * Get all programs with pagination
 */
export async function getAdminPrograms({ page = 1, limit = 10, search = '', university_id = null }) {
  // Calculate offset based on page and limit
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('programs')
    .select('*, university:universities(name)', { count: 'exact' });
  
  // Add search filter if provided
  if (search) {
    query = query.or(`name.ilike.%${search}%, specialization.ilike.%${search}%`);
  }
  
  // Filter by university if provided
  if (university_id) {
    query = query.eq('university_id', university_id);
  }
  
  // Add pagination
  const { data, error, count } = await query
    .order('name')
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
  
  return {
    programs: data || [],
    total: count || 0,
    page,
    limit
  };
}

/**
 * Get a single program by ID with related university
 */
export async function getAdminProgramById(id: string) {
  const { data, error } = await supabase
    .from('programs')
    .select('*, university:universities(*)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching program ${id}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Create a new program
 */
export async function createProgram(program: Partial<Program>) {
  const { data, error } = await supabase
    .from('programs')
    .insert(program)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating program:', error);
    throw error;
  }
  
  return data;
}

/**
 * Update an existing program
 */
export async function updateProgram(id: string, program: Partial<Program>) {
  const { data, error } = await supabase
    .from('programs')
    .update(program)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating program ${id}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Delete a program
 */
export async function deleteProgram(id: string) {
  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting program ${id}:`, error);
    throw error;
  }
  
  return true;
}

// === REQUIREMENTS MANAGEMENT ===

/**
 * Get requirements for a program
 */
export async function getProgramRequirements(program_id: string) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('program_id', program_id);
  
  if (error) {
    console.error(`Error fetching requirements for program ${program_id}:`, error);
    throw error;
  }
  
  return data || [];
}

/**
 * Create a new requirement
 */
export async function createRequirement(requirement: { program_id: string, type: string, value: string }) {
  const { data, error } = await supabase
    .from('requirements')
    .insert(requirement)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating requirement:', error);
    throw error;
  }
  
  return data;
}

/**
 * Update an existing requirement
 */
export async function updateRequirement(id: string, requirement: { type?: string, value?: string }) {
  const { data, error } = await supabase
    .from('requirements')
    .update(requirement)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating requirement ${id}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Delete a requirement
 */
export async function deleteRequirement(id: string) {
  const { error } = await supabase
    .from('requirements')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting requirement ${id}:`, error);
    throw error;
  }
  
  return true;
}

// === USERS MANAGEMENT ===

/**
 * Get all users with pagination
 */
export async function getAdminUsers({ page = 1, limit = 10, search = '', role = null }) {
  // Calculate offset based on page and limit
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('users')
    .select('*', { count: 'exact' });
  
  // Add search filter if provided
  if (search) {
    query = query.or(`email.ilike.%${search}%, first_name.ilike.%${search}%, last_name.ilike.%${search}%`);
  }
  
  // Filter by role if provided
  if (role) {
    query = query.eq('role', role);
  }
  
  // Add pagination
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  return {
    users: data || [],
    total: count || 0,
    page,
    limit
  };
}

/**
 * Get a single user by ID
 */
export async function getAdminUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Update a user's details
 */
export async function updateUser(id: string, user: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
  
  return data;
}

// === DASHBOARD ANALYTICS ===

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats() {
  try {
    // Fetch university count
    const { data: universities, error: univError } = await supabase
      .from('universities')
      .select('id');
    
    if (univError) {
      console.error('Error fetching universities:', univError);
      throw new Error('Failed to fetch university statistics');
    }
    
    // Fetch program count
    const { data: programs, error: programError } = await supabase
      .from('programs')
      .select('id');
    
    if (programError) {
      console.error('Error fetching programs:', programError);
      throw new Error('Failed to fetch program statistics');
    }
    
    // Fetch user count
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id');
    
    if (userError) {
      console.error('Error fetching users:', userError);
      throw new Error('Failed to fetch user statistics');
    }
    
    // Fetch application count
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('id');
    
    if (appError) {
      console.error('Error fetching applications:', appError);
      throw new Error('Failed to fetch application statistics');
    }
    
    // Calculate counts using array lengths
    return {
      universitiesCount: universities?.length || 0,
      programsCount: programs?.length || 0,
      usersCount: users?.length || 0,
      applicationsCount: applications?.length || 0
    };
  } catch (error) {
    console.error('Error in getAdminDashboardStats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}

/**
 * Get recent applications
 */
export async function getRecentApplications(limit = 5) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, user:users(email, first_name, last_name), program:programs(name, university_id), program_university:programs!inner(university:universities(name))')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching recent applications:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get application statistics by status
 */
export async function getApplicationStats() {
  const { data, error } = await supabase
    .from('applications')
    .select('status')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching application stats:', error);
    throw error;
  }
  
  // Calculate counts by status
  const stats = {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  };
  
  data?.forEach(app => {
    stats.total++;
    if (app.status === 'pending') stats.pending++;
    else if (app.status === 'approved') stats.approved++;
    else if (app.status === 'rejected') stats.rejected++;
  });
  
  return stats;
} 