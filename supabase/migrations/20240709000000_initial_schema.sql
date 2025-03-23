-- Universities Table
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  chinese_name TEXT,
  logo_url TEXT,
  province TEXT,
  city TEXT,
  ranking INTEGER,
  type TEXT CHECK (type IN ('government', 'private')),
  specialization TEXT[],
  has_english_programs BOOLEAN DEFAULT FALSE,
  has_dormitory BOOLEAN DEFAULT TRUE,
  tuition_min NUMERIC,
  tuition_max NUMERIC,
  description TEXT,
  foreign_students_count INTEGER,
  campus_images TEXT[],
  facilities JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up row-level security for universities table
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  education_level TEXT CHECK (education_level IN ('language', 'bachelor', 'master', 'doctorate')),
  duration INTEGER, -- in months
  language TEXT CHECK (language IN ('chinese', 'english', 'mixed')),
  format TEXT CHECK (format IN ('fulltime', 'online', 'mixed')),
  tuition NUMERIC,
  start_dates DATE[],
  specialization TEXT,
  description TEXT,
  curriculum JSONB DEFAULT '{}',
  requirements JSONB DEFAULT '{}',
  employment_prospects TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up row-level security for programs table
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Scholarships Table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('government', 'university', 'regional')),
  coverage TEXT CHECK (coverage IN ('full', 'partial')),
  education_levels TEXT[],
  language_requirements JSONB DEFAULT '{}',
  academic_requirements JSONB DEFAULT '{}',
  application_deadline DATE,
  documents_required TEXT[],
  selection_process TEXT,
  success_rate NUMERIC,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up row-level security for scholarships table
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Programs_Scholarships junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS programs_scholarships (
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  PRIMARY KEY (program_id, scholarship_id)
);

-- Set up row-level security for programs_scholarships table
ALTER TABLE programs_scholarships ENABLE ROW LEVEL SECURITY;

-- RLS Policies (default: only authenticated users can read)
CREATE POLICY "Anyone can read universities" ON universities
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read programs" ON programs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read scholarships" ON scholarships
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read programs_scholarships" ON programs_scholarships
  FOR SELECT USING (true);

-- Create filter functions
CREATE OR REPLACE FUNCTION filter_universities(
  p_province TEXT[] DEFAULT NULL,
  p_city TEXT[] DEFAULT NULL,
  p_ranking_max INTEGER DEFAULT NULL,
  p_university_type TEXT[] DEFAULT NULL,
  p_has_english_programs BOOLEAN DEFAULT NULL,
  p_tuition_min NUMERIC DEFAULT NULL,
  p_tuition_max NUMERIC DEFAULT NULL,
  p_has_dormitory BOOLEAN DEFAULT NULL,
  p_specialization TEXT[] DEFAULT NULL
) RETURNS SETOF universities AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM universities
  WHERE
    (p_province IS NULL OR province = ANY(p_province)) AND
    (p_city IS NULL OR city = ANY(p_city)) AND
    (p_ranking_max IS NULL OR ranking <= p_ranking_max) AND
    (p_university_type IS NULL OR type = ANY(p_university_type)) AND
    (p_has_english_programs IS NULL OR has_english_programs = p_has_english_programs) AND
    (p_tuition_min IS NULL OR tuition_max >= p_tuition_min) AND
    (p_tuition_max IS NULL OR tuition_min <= p_tuition_max) AND
    (p_has_dormitory IS NULL OR has_dormitory = p_has_dormitory) AND
    (p_specialization IS NULL OR specialization && p_specialization);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION filter_programs(
  p_university_id UUID DEFAULT NULL,
  p_education_level TEXT[] DEFAULT NULL,
  p_language TEXT[] DEFAULT NULL,
  p_duration_min INTEGER DEFAULT NULL,
  p_duration_max INTEGER DEFAULT NULL,
  p_specialization TEXT[] DEFAULT NULL,
  p_format TEXT[] DEFAULT NULL,
  p_tuition_min NUMERIC DEFAULT NULL,
  p_tuition_max NUMERIC DEFAULT NULL,
  p_start_date DATE DEFAULT NULL
) RETURNS SETOF programs AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM programs
  WHERE
    (p_university_id IS NULL OR university_id = p_university_id) AND
    (p_education_level IS NULL OR education_level = ANY(p_education_level)) AND
    (p_language IS NULL OR language = ANY(p_language)) AND
    (p_duration_min IS NULL OR duration >= p_duration_min) AND
    (p_duration_max IS NULL OR duration <= p_duration_max) AND
    (p_specialization IS NULL OR specialization = ANY(p_specialization)) AND
    (p_format IS NULL OR format = ANY(p_format)) AND
    (p_tuition_min IS NULL OR tuition >= p_tuition_min) AND
    (p_tuition_max IS NULL OR tuition <= p_tuition_max) AND
    (p_start_date IS NULL OR start_dates @> ARRAY[p_start_date]);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION filter_scholarships(
  p_type TEXT[] DEFAULT NULL,
  p_coverage TEXT[] DEFAULT NULL,
  p_education_levels TEXT[] DEFAULT NULL,
  p_application_deadline DATE DEFAULT NULL
) RETURNS SETOF scholarships AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM scholarships
  WHERE
    (p_type IS NULL OR type = ANY(p_type)) AND
    (p_coverage IS NULL OR coverage = ANY(p_coverage)) AND
    (p_education_levels IS NULL OR education_levels && p_education_levels) AND
    (p_application_deadline IS NULL OR application_deadline >= p_application_deadline);
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER set_universities_updated_at
BEFORE UPDATE ON universities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_programs_updated_at
BEFORE UPDATE ON programs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_scholarships_updated_at
BEFORE UPDATE ON scholarships
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 