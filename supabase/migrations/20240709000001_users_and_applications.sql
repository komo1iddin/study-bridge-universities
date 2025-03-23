-- Users Table (extending auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role TEXT CHECK (role IN ('client', 'manager', 'admin')) DEFAULT 'client',
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up row-level security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('draft', 'submitted', 'reviewing', 'accepted', 'rejected')) DEFAULT 'draft',
  submission_date TIMESTAMP WITH TIME ZONE,
  documents JSONB DEFAULT '{}',
  notes TEXT,
  assigned_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up row-level security for applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up row-level security for documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Communications Table
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up row-level security for communications table
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Favorites Table (for users to save favorite programs)
CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, program_id)
);

-- Set up row-level security for favorites table
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Managers can view assigned applications" ON applications
  FOR SELECT USING (
    auth.uid() = assigned_manager_id OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- RLS Policies for documents
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications WHERE id = application_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view assigned application documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN users u ON u.id = auth.uid()
      WHERE a.id = application_id AND 
      (a.assigned_manager_id = auth.uid() OR u.role IN ('admin', 'manager'))
    )
  );

-- RLS Policies for communications
CREATE POLICY "Users can view their own communications" ON communications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications WHERE id = application_id AND user_id = auth.uid()
    ) OR user_id = auth.uid() OR manager_id = auth.uid()
  );

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_communications_updated_at
BEFORE UPDATE ON communications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 