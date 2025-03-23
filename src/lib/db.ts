import { supabase } from '@/lib/supabase';
import { University, Program, Scholarship, User, Application } from '@/types/database.types';

// Universities
export async function getUniversities() {
  const { data, error } = await supabase
    .from('universities')
    .select('*');
  
  if (error) {
    console.error('Error fetching universities:', error);
    return getSampleUniversities();
  }
  
  if (!data || data.length === 0) {
    return getSampleUniversities();
  }
  
  return data as University[];
}

// Sample universities for development purposes
function getSampleUniversities(): University[] {
  return [
    {
      id: '1',
      name: 'Tsinghua University',
      chinese_name: '清华大学',
      logo_url: 'https://upload.wikimedia.org/wikipedia/en/f/ff/Tsinghua_University_Logo.svg',
      province: 'Beijing',
      city: 'Beijing',
      ranking: 1,
      type: 'government',
      specialization: ['Engineering', 'Science', 'Business'],
      has_english_programs: true,
      has_dormitory: true,
      tuition_min: 26000,
      tuition_max: 40000,
      description: 'Tsinghua University is one of the most prestigious universities in China, renowned for its engineering and computer science programs. It consistently ranks among the top universities worldwide.',
      foreign_students_count: 3000,
      website_url: 'https://www.tsinghua.edu.cn/en/',
    },
    {
      id: '2',
      name: 'Peking University',
      chinese_name: '北京大学',
      logo_url: 'https://upload.wikimedia.org/wikipedia/en/0/03/Peking_University_logo.svg',
      province: 'Beijing',
      city: 'Beijing',
      ranking: 2,
      type: 'government',
      specialization: ['Arts', 'Sciences', 'Medicine'],
      has_english_programs: true,
      has_dormitory: true,
      tuition_min: 24000,
      tuition_max: 38000,
      description: 'Peking University is a major research university in Beijing, China, and a member of the C9 League of Chinese universities. It is the first modern national university established in China.',
      foreign_students_count: 2800,
      website_url: 'https://english.pku.edu.cn/',
    },
    {
      id: '3',
      name: 'Shanghai Jiao Tong University',
      chinese_name: '上海交通大学',
      logo_url: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Shanghai_Jiao_Tong_University_Logo.svg',
      province: 'Shanghai',
      city: 'Shanghai',
      ranking: 3,
      type: 'government',
      specialization: ['Engineering', 'Medicine', 'Business'],
      has_english_programs: true,
      has_dormitory: true,
      tuition_min: 23000,
      tuition_max: 35000,
      description: 'Shanghai Jiao Tong University is one of the oldest and most prestigious universities in China, particularly known for its engineering and business programs.',
      foreign_students_count: 2500,
      website_url: 'https://en.sjtu.edu.cn/',
    }
  ];
}

export async function getUniversityById(id: string) {
  const { data, error } = await supabase
    .from('universities')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching university ${id}:`, error);
    return getSampleUniversityById(id);
  }
  
  return data as University;
}

// Find a sample university by ID
function getSampleUniversityById(id: string): University | null {
  const sampleUniversities = getSampleUniversities();
  return sampleUniversities.find(univ => univ.id === id) || null;
}

export async function filterUniversities({
  province,
  city,
  ranking_max,
  university_type,
  has_english_programs,
  tuition_min,
  tuition_max,
  has_dormitory,
  specialization
}: {
  province?: string[];
  city?: string[];
  ranking_max?: number;
  university_type?: string[];
  has_english_programs?: boolean;
  tuition_min?: number;
  tuition_max?: number;
  has_dormitory?: boolean;
  specialization?: string[];
}) {
  const { data, error } = await supabase
    .rpc('filter_universities', {
      p_province: province,
      p_city: city,
      p_ranking_max: ranking_max,
      p_university_type: university_type,
      p_has_english_programs: has_english_programs,
      p_tuition_min: tuition_min,
      p_tuition_max: tuition_max,
      p_has_dormitory: has_dormitory,
      p_specialization: specialization
    });
  
  if (error) {
    console.error('Error filtering universities:', error);
    return [];
  }
  
  return data as University[];
}

// Programs
export async function getPrograms() {
  const { data, error } = await supabase
    .from('programs')
    .select('*');
  
  if (error) {
    console.error('Error fetching programs:', error);
    return getSamplePrograms();
  }
  
  if (!data || data.length === 0) {
    return getSamplePrograms();
  }
  
  return data as Program[];
}

// Sample programs for development purposes
function getSamplePrograms(): Program[] {
  return [
    {
      id: '1',
      university_id: '1',
      name: 'Computer Science and Technology',
      education_level: 'bachelor',
      duration: 4,
      language: 'english',
      format: 'fulltime',
      tuition: 30000,
      start_dates: ['2024-09-01', '2025-02-15'],
      specialization: 'Computer Science',
      description: 'This program focuses on computer science fundamentals, programming languages, algorithms, data structures, and advanced topics like artificial intelligence and machine learning.',
      requirements: {
        gpa: 'Minimum 3.0/4.0',
        language: {
          english: 'IELTS 6.5 or TOEFL 90'
        },
        documents: ['Transcripts', 'Recommendation Letters', 'Personal Statement']
      }
    },
    {
      id: '2',
      university_id: '1',
      name: 'International Business Management',
      education_level: 'master',
      duration: 2,
      language: 'english',
      format: 'fulltime',
      tuition: 35000,
      start_dates: ['2024-09-01'],
      specialization: 'Business Administration',
      description: 'A comprehensive program covering global business strategies, international finance, cross-cultural management, and leadership skills for the global business environment.',
      requirements: {
        gpa: 'Minimum 3.2/4.0',
        language: {
          english: 'IELTS 7.0 or TOEFL 100'
        },
        documents: ['Transcripts', 'Recommendation Letters', 'CV', 'Research Proposal']
      }
    },
    {
      id: '3',
      university_id: '2',
      name: 'Chinese Language Program',
      education_level: 'language',
      duration: 1,
      language: 'chinese',
      format: 'fulltime',
      tuition: 15000,
      start_dates: ['2024-03-01', '2024-09-01', '2025-03-01'],
      specialization: 'Language Studies',
      description: 'Intensive Chinese language program designed for international students to gain proficiency in Mandarin Chinese, including speaking, listening, reading, and writing.',
      requirements: {
        language: {
          english: 'Basic English proficiency'
        },
        documents: ['Application Form', 'Copy of Passport', 'Health Certificate']
      }
    },
    {
      id: '4',
      university_id: '3',
      name: 'Mechanical Engineering',
      education_level: 'bachelor',
      duration: 4,
      language: 'english',
      format: 'fulltime',
      tuition: 28000,
      start_dates: ['2024-09-01'],
      specialization: 'Engineering',
      description: 'A comprehensive program covering mechanics, thermodynamics, materials science, manufacturing processes, and engineering design principles.',
      requirements: {
        gpa: 'Minimum 3.0/4.0',
        language: {
          english: 'IELTS 6.0 or TOEFL 85'
        },
        documents: ['Transcripts', 'Recommendation Letters', 'Personal Statement']
      }
    },
    {
      id: '5',
      university_id: '2',
      name: 'International Relations',
      education_level: 'master',
      duration: 2,
      language: 'english',
      format: 'fulltime',
      tuition: 32000,
      start_dates: ['2024-09-01', '2025-03-01'],
      specialization: 'Political Science',
      description: 'This program examines global politics, international law, diplomacy, and the role of international organizations in the modern world.',
      requirements: {
        gpa: 'Minimum 3.3/4.0',
        language: {
          english: 'IELTS 7.0 or TOEFL 100'
        },
        documents: ['Transcripts', 'Recommendation Letters', 'Research Proposal', 'CV']
      }
    }
  ];
}

export async function getProgramById(id: string) {
  const { data, error } = await supabase
    .from('programs')
    .select('*, universities(*)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching program ${id}:`, error);
    return getSampleProgramById(id);
  }
  
  return data as Program & { universities: University };
}

// Find a sample program by ID
function getSampleProgramById(id: string): (Program & { universities: University }) | null {
  const samplePrograms = getSamplePrograms();
  const program = samplePrograms.find(prog => prog.id === id);
  
  if (!program) return null;
  
  const university = getSampleUniversityById(program.university_id);
  if (!university) return null;
  
  return {
    ...program,
    universities: university
  };
}

export async function getProgramsByUniversityId(universityId: string) {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('university_id', universityId);
  
  if (error) {
    console.error(`Error fetching programs for university ${universityId}:`, error);
    return getSampleProgramsByUniversityId(universityId);
  }
  
  if (!data || data.length === 0) {
    return getSampleProgramsByUniversityId(universityId);
  }
  
  return data as Program[];
}

// Find sample programs by university ID
function getSampleProgramsByUniversityId(universityId: string): Program[] {
  const samplePrograms = getSamplePrograms();
  return samplePrograms.filter(prog => prog.university_id === universityId);
}

export async function filterPrograms({
  university_id,
  education_level,
  language,
  duration_min,
  duration_max,
  specialization,
  format,
  tuition_min,
  tuition_max,
  start_date
}: {
  university_id?: string;
  education_level?: string[];
  language?: string[];
  duration_min?: number;
  duration_max?: number;
  specialization?: string[];
  format?: string[];
  tuition_min?: number;
  tuition_max?: number;
  start_date?: string;
}) {
  const { data, error } = await supabase
    .rpc('filter_programs', {
      p_university_id: university_id,
      p_education_level: education_level,
      p_language: language,
      p_duration_min: duration_min,
      p_duration_max: duration_max,
      p_specialization: specialization,
      p_format: format,
      p_tuition_min: tuition_min,
      p_tuition_max: tuition_max,
      p_start_date: start_date
    });
  
  if (error) {
    console.error('Error filtering programs:', error);
    return [];
  }
  
  return data as Program[];
}

// Scholarships
export async function getScholarships() {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*');
  
  if (error) {
    console.error('Error fetching scholarships:', error);
    return [];
  }
  
  return data as Scholarship[];
}

export async function getScholarshipById(id: string) {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching scholarship ${id}:`, error);
    return null;
  }
  
  return data as Scholarship;
}

export async function getScholarshipsForProgram(programId: string) {
  const { data, error } = await supabase
    .from('programs_scholarships')
    .select('scholarships(*)')
    .eq('program_id', programId);
  
  if (error) {
    console.error(`Error fetching scholarships for program ${programId}:`, error);
    return [];
  }
  
  return data.map(item => item.scholarships as unknown as Scholarship);
}

export async function filterScholarships({
  type,
  coverage,
  education_levels,
  application_deadline
}: {
  type?: string[];
  coverage?: string[];
  education_levels?: string[];
  application_deadline?: string;
}) {
  const { data, error } = await supabase
    .rpc('filter_scholarships', {
      p_type: type,
      p_coverage: coverage,
      p_education_levels: education_levels,
      p_application_deadline: application_deadline
    });
  
  if (error) {
    console.error('Error filtering scholarships:', error);
    return [];
  }
  
  return data as Scholarship[];
}

// User profile and applications
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as User;
}

export async function updateUserProfile(profile: Partial<User>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('users')
    .update(profile)
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
  
  return data as User;
}

export async function getUserApplications() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      programs(*),
      scholarships(*)
    `)
    .eq('user_id', user.id);
  
  if (error) {
    console.error('Error fetching user applications:', error);
    return [];
  }
  
  return data as (Application & {
    programs: Program;
    scholarships: Scholarship | null;
  })[];
}

export async function createApplication(application: Partial<Application>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('applications')
    .insert({ ...application, user_id: user.id })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating application:', error);
    return null;
  }
  
  return data as Application;
}

export async function updateApplication(id: string, application: Partial<Application>) {
  const { data, error } = await supabase
    .from('applications')
    .update(application)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating application ${id}:`, error);
    return null;
  }
  
  return data as Application;
}

// Favorites
export async function addFavoriteProgram(programId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }
  
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: user.id, program_id: programId });
  
  if (error) {
    console.error('Error adding favorite program:', error);
    return false;
  }
  
  return true;
}

export async function removeFavoriteProgram(programId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }
  
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('program_id', programId);
  
  if (error) {
    console.error('Error removing favorite program:', error);
    return false;
  }
  
  return true;
}

export async function getFavoritePrograms() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('favorites')
    .select('programs(*)')
    .eq('user_id', user.id);
  
  if (error) {
    console.error('Error fetching favorite programs:', error);
    return [];
  }
  
  return data.map(item => item.programs as unknown as Program);
} 