-- ============================================================
-- StudyX: Seed Gujarat Colleges, Branches & Semesters
-- ============================================================
-- Run this ONCE in your Supabase SQL Editor (Dashboard → SQL Editor → New query → Paste → Run)
-- It inserts all Gujarat colleges and common engineering branches.
-- Semesters 1-8 are already created by the initial migration.
-- ============================================================

-- ── Colleges ──
INSERT INTO public.colleges (name, slug, city, state, country, is_active)
VALUES
  -- Ahmedabad
  ('Nirma University',                                              'nirma',          'Ahmedabad',    'Gujarat', 'India', true),
  ('LDRP Institute of Technology and Research',                     'ldrp',           'Ahmedabad',    'Gujarat', 'India', true),
  ('Silver Oak University',                                         'silver-oak',     'Ahmedabad',    'Gujarat', 'India', true),
  ('SAL College of Engineering',                                    'sal',            'Ahmedabad',    'Gujarat', 'India', true),
  ('GIFT University',                                               'gift',           'Ahmedabad',    'Gujarat', 'India', true),
  ('LD College of Engineering',                                     'ld',             'Ahmedabad',    'Gujarat', 'India', true),
  ('Ahmedabad College of Engineering & Technology (ACET)',           'acet',           'Ahmedabad',    'Gujarat', 'India', true),
  ('Karnavati University',                                          'karnavati',      'Ahmedabad',    'Gujarat', 'India', true),
  ('L.J. University',                                               'lj',             'Ahmedabad',    'Gujarat', 'India', true),
  ('Ahmedabad University',                                          'ahmedabad-u',    'Ahmedabad',    'Gujarat', 'India', true),
  ('Gujarat University',                                            'gu',             'Ahmedabad',    'Gujarat', 'India', true),

  -- Gandhinagar
  ('IIT Gandhinagar',                                               'iit-gn',         'Gandhinagar',  'Gujarat', 'India', true),
  ('DA-IICT (Dhirubhai Ambani Institute)',                          'daiict',         'Gandhinagar',  'Gujarat', 'India', true),
  ('Pandit Deendayal Energy University (PDEU)',                     'pdeu',           'Gandhinagar',  'Gujarat', 'India', true),
  ('Gujarat Technological University (GTU)',                        'gtu',            'Gandhinagar',  'Gujarat', 'India', true),

  -- Surat
  ('SVNIT (Sardar Vallabhbhai National Institute of Technology)',   'svnit',          'Surat',        'Gujarat', 'India', true),
  ('Uka Tarsadia University',                                       'utu',            'Surat',        'Gujarat', 'India', true),
  ('Veer Narmad South Gujarat University',                          'vnsgu',          'Surat',        'Gujarat', 'India', true),
  ('P P Savani University',                                         'ppsu',           'Surat',        'Gujarat', 'India', true),
  ('SIET (Surat Institute of Engineering & Technology)',             'siet',           'Surat',        'Gujarat', 'India', true),
  ('Sarvajanik College of Engineering & Technology',                'scet-surat',     'Surat',        'Gujarat', 'India', true),

  -- Vadodara
  ('The Maharaja Sayajirao University of Baroda',                   'msu',            'Vadodara',     'Gujarat', 'India', true),
  ('Parul University',                                              'parul',          'Vadodara',     'Gujarat', 'India', true),
  ('Government Engineering College Vadodara',                       'gec-vadodara',   'Vadodara',     'Gujarat', 'India', true),
  ('Navrachana University',                                         'navrachana',     'Vadodara',     'Gujarat', 'India', true),

  -- Rajkot
  ('Marwadi University',                                            'marwadi',        'Rajkot',       'Gujarat', 'India', true),
  ('RK University',                                                 'rku',            'Rajkot',       'Gujarat', 'India', true),
  ('Saurashtra University',                                         'saurashtra-u',   'Rajkot',       'Gujarat', 'India', true),
  ('Government Engineering College Rajkot',                         'gec-rajkot',     'Rajkot',       'Gujarat', 'India', true),

  -- Anand / Vallabh Vidyanagar
  ('BVM Engineering College (Vallabh Vidyanagar)',                  'bvm',            'Anand',        'Gujarat', 'India', true),
  ('A.D. Patel Institute of Technology (ADIT)',                     'adit',           'Anand',        'Gujarat', 'India', true),
  ('Birla Vishvakarma Mahavidyalaya',                               'bvm-anand',      'Anand',        'Gujarat', 'India', true),
  ('Sardar Patel University',                                       'spu',            'Anand',        'Gujarat', 'India', true),

  -- Bhavnagar
  ('Bhavnagar University',                                          'bhavnagar-u',    'Bhavnagar',    'Gujarat', 'India', true),
  ('Government Engineering College Bhavnagar',                     'gec-bhavnagar',  'Bhavnagar',    'Gujarat', 'India', true),

  -- Junagadh
  ('Government Engineering College Junagadh',                      'gec-junagadh',   'Junagadh',     'Gujarat', 'India', true),

  -- Jamnagar
  ('Government Engineering College Jamnagar',                      'gec-jamnagar',   'Jamnagar',     'Gujarat', 'India', true),

  -- Morbi
  ('Government Engineering College Morbi',                         'gec-morbi',      'Morbi',        'Gujarat', 'India', true),

  -- Palanpur
  ('Government Engineering College Palanpur',                      'gec-palanpur',   'Palanpur',     'Gujarat', 'India', true),

  -- Modasa
  ('Government Engineering College Modasa',                        'gec-modasa',     'Modasa',       'Gujarat', 'India', true),

  -- Mehsana
  ('Government Engineering College Mehsana',                       'gec-mehsana',    'Mehsana',      'Gujarat', 'India', true),

  -- Bharuch
  ('Government Engineering College Bharuch',                       'gec-bharuch',    'Bharuch',      'Gujarat', 'India', true)

ON CONFLICT (slug) DO NOTHING;


-- ── Branches for every college ──
-- This inserts the same set of common branches for each college.
DO $$
DECLARE
  college_row RECORD;
  branch_names TEXT[] := ARRAY[
    'Computer Engineering',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'BCA (Bachelor of Computer Applications)',
    'MCA (Master of Computer Applications)',
    'Artificial Intelligence & Data Science',
    'Cyber Security',
    'Chemical Engineering',
    'Automobile Engineering'
  ];
  branch_name TEXT;
BEGIN
  FOR college_row IN SELECT id FROM public.colleges LOOP
    FOREACH branch_name IN ARRAY branch_names LOOP
      INSERT INTO public.branches (college_id, name, is_active)
      VALUES (college_row.id, branch_name, true)
      ON CONFLICT (college_id, name) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;


-- ── Verify ──
-- After running, you should see colleges with:
SELECT name, city FROM public.colleges ORDER BY city, name;
