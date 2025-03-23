-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES
  ('university-logos', 'university-logos', true, false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('campus-images', 'campus-images', true, false, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('documents', 'documents', false, false, 20971520, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
  ('avatars', 'avatars', true, false, 2097152, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
-- University logos (public)
CREATE POLICY "University logos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'university-logos');

CREATE POLICY "Authenticated users can upload university logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'university-logos' AND (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  ));

CREATE POLICY "Admins and managers can update university logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'university-logos' AND (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  ));

-- Campus images (public)
CREATE POLICY "Campus images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'campus-images');

CREATE POLICY "Authenticated users can upload campus images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'campus-images' AND (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  ));

CREATE POLICY "Admins and managers can update campus images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'campus-images' AND (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  ));

-- Documents (private)
CREATE POLICY "Users can view their own documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      -- Match by user ID in the path pattern user/{user_id}/...
      auth.uid()::text = (storage.foldername(name))[2]
      OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

CREATE POLICY "Users can upload their own documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- Avatars (public)
CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[2]
  ); 