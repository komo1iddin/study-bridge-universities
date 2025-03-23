-- Insert test universities
INSERT INTO universities (name, chinese_name, province, city, ranking, type, specialization, has_english_programs, tuition_min, tuition_max, description)
VALUES
  ('Beijing University', '北京大学', 'Beijing', 'Beijing', 1, 'government', ARRAY['general', 'science', 'humanities'], TRUE, 3000, 5000, 'One of the most prestigious universities in China'),
  ('Shanghai Jiao Tong University', '上海交通大学', 'Shanghai', 'Shanghai', 5, 'government', ARRAY['engineering', 'medicine', 'economics'], TRUE, 3500, 6000, 'Top university specializing in engineering and technology'),
  ('Tsinghua University', '清华大学', 'Beijing', 'Beijing', 2, 'government', ARRAY['technology', 'science', 'engineering'], TRUE, 3200, 5500, 'World-class university with strengths in technology and engineering');

-- Insert test programs
INSERT INTO programs (university_id, name, education_level, duration, language, format, tuition, specialization, description)
VALUES
  ((SELECT id FROM universities WHERE name = 'Beijing University'), 'Computer Science', 'bachelor', 48, 'english', 'fulltime', 4500, 'Computer Science', 'Bachelor program in Computer Science taught in English'),
  ((SELECT id FROM universities WHERE name = 'Shanghai Jiao Tong University'), 'Business Administration', 'master', 24, 'english', 'fulltime', 5500, 'Business', 'Master program in Business Administration with global perspective'),
  ((SELECT id FROM universities WHERE name = 'Tsinghua University'), 'Chinese Language Program', 'language', 12, 'chinese', 'fulltime', 3000, 'Language', 'Intensive Chinese language program for foreign students'),
  ((SELECT id FROM universities WHERE name = 'Beijing University'), 'Medicine', 'bachelor', 60, 'english', 'fulltime', 5000, 'Medicine', 'Bachelor program in Medicine with clinical practice'),
  ((SELECT id FROM universities WHERE name = 'Shanghai Jiao Tong University'), 'Mechanical Engineering', 'master', 24, 'mixed', 'fulltime', 4500, 'Engineering', 'Master program in Mechanical Engineering with lab work');

-- Insert test scholarships
INSERT INTO scholarships (name, type, coverage, education_levels, application_deadline, selection_process, success_rate)
VALUES
  ('Chinese Government Scholarship', 'government', 'full', ARRAY['bachelor', 'master', 'doctorate'], '2024-12-15', 'Competitive selection process based on academic achievements', 0.15),
  ('University Merit Scholarship', 'university', 'partial', ARRAY['bachelor', 'master'], '2024-11-30', 'Selection based on academic excellence and motivation letter', 0.25),
  ('Provincial Government Scholarship', 'regional', 'partial', ARRAY['language', 'bachelor'], '2024-10-30', 'Selection focuses on need and academic potential', 0.30);

-- Link programs with scholarships
INSERT INTO programs_scholarships (program_id, scholarship_id)
VALUES
  ((SELECT id FROM programs WHERE name = 'Computer Science'), (SELECT id FROM scholarships WHERE name = 'Chinese Government Scholarship')),
  ((SELECT id FROM programs WHERE name = 'Computer Science'), (SELECT id FROM scholarships WHERE name = 'University Merit Scholarship')),
  ((SELECT id FROM programs WHERE name = 'Business Administration'), (SELECT id FROM scholarships WHERE name = 'Chinese Government Scholarship')),
  ((SELECT id FROM programs WHERE name = 'Chinese Language Program'), (SELECT id FROM scholarships WHERE name = 'Provincial Government Scholarship')),
  ((SELECT id FROM programs WHERE name = 'Medicine'), (SELECT id FROM scholarships WHERE name = 'Chinese Government Scholarship')),
  ((SELECT id FROM programs WHERE name = 'Mechanical Engineering'), (SELECT id FROM scholarships WHERE name = 'University Merit Scholarship')); 