export type University = {
  id: string;
  name: string;
  chinese_name?: string | null;
  logo_url?: string | null;
  province?: string | null;
  city?: string | null;
  ranking?: number | null;
  type?: 'government' | 'private' | null;
  specialization?: string[] | null;
  has_english_programs?: boolean | null;
  has_dormitory?: boolean | null;
  tuition_min?: number | null;
  tuition_max?: number | null;
  description?: string | null;
  foreign_students_count?: number | null;
  campus_images?: string[] | null;
  facilities?: Record<string, any> | null;
  contact_info?: Record<string, any> | null;
  website_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Program = {
  id: string;
  university_id: string;
  name: string;
  education_level?: 'language' | 'bachelor' | 'master' | 'doctorate' | null;
  duration?: number | null;
  language?: 'chinese' | 'english' | 'mixed' | null;
  format?: 'fulltime' | 'online' | 'mixed' | null;
  tuition?: number;
  tuition_usd?: number;
  start_dates?: string[] | null;
  specialization?: string | null;
  description?: string | null;
  curriculum?: Record<string, any> | null;
  requirements?: Record<string, any> | null;
  employment_prospects?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Scholarship = {
  id: string;
  name: string;
  type?: 'government' | 'university' | 'regional' | null;
  coverage?: 'full' | 'partial' | null;
  education_levels?: string[] | null;
  language_requirements?: Record<string, any> | null;
  academic_requirements?: Record<string, any> | null;
  application_deadline?: string | null;
  documents_required?: string[] | null;
  selection_process?: string | null;
  success_rate?: number | null;
  tips?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type User = {
  id: string;
  role?: 'client' | 'manager' | 'admin' | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Application = {
  id: string;
  user_id: string;
  program_id: string;
  scholarship_id?: string | null;
  status?: 'draft' | 'submitted' | 'reviewing' | 'accepted' | 'rejected' | null;
  submission_date?: string | null;
  documents?: Record<string, any> | null;
  notes?: string | null;
  assigned_manager_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Document = {
  id: string;
  application_id: string;
  type: string;
  file_path: string;
  upload_date?: string | null;
  status?: 'pending' | 'approved' | 'rejected' | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Communication = {
  id: string;
  application_id: string;
  user_id?: string | null;
  manager_id?: string | null;
  message: string;
  timestamp?: string | null;
  is_read?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Favorite = {
  user_id: string;
  program_id: string;
  created_at?: string | null;
};