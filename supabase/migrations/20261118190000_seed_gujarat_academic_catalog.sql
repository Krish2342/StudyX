-- StudyX: seed the Gujarat academic fallback catalog for first-login onboarding.
-- This migration makes static fallback selections valid database UUID references.

insert into public.colleges (name, slug, city, state, country, is_active)
values
  ('Nirma University', 'nirma', 'Ahmedabad', 'Gujarat', 'India', true),
  ('LDRP Institute of Technology and Research', 'ldrp', 'Ahmedabad', 'Gujarat', 'India', true),
  ('Silver Oak University', 'silver', 'Ahmedabad', 'Gujarat', 'India', true),
  ('SAL College of Engineering', 'sap', 'Ahmedabad', 'Gujarat', 'India', true),
  ('GIFT University', 'gift', 'Ahmedabad', 'Gujarat', 'India', true),
  ('ADIT - Anand College', 'adit', 'Ahmedabad', 'Gujarat', 'India', true),
  ('CGPIT - Uka Tarsadia University', 'cgpit', 'Ahmedabad', 'Gujarat', 'India', true),
  ('LD College of Engineering', 'ld', 'Ahmedabad', 'Gujarat', 'India', true),
  ('PVPIT - Pune Vidyarthi Griha', 'pvpit', 'Ahmedabad', 'Gujarat', 'India', true),
  ('Ahmedabad College of Engineering & Technology (ACET)', 'acet', 'Ahmedabad', 'Gujarat', 'India', true),
  ('Karnavati University', 'karnavati', 'Ahmedabad', 'Gujarat', 'India', true),
  ('Marwadi University (Ahmedabad Campus)', 'marwadi_a', 'Ahmedabad', 'Gujarat', 'India', true),
  ('SVNIT - Sardar Vallabhbhai National Institute of Technology', 'svnit', 'Surat', 'Gujarat', 'India', true),
  ('BVM Engineering College', 'bvm', 'Surat', 'Gujarat', 'India', true),
  ('Uka Tarsadia University', 'utu', 'Surat', 'Gujarat', 'India', true),
  ('Sardar Patel University (Surat)', 'siu', 'Surat', 'Gujarat', 'India', true),
  ('SGVU - Surat Campus', 'sgvu_s', 'Surat', 'Gujarat', 'India', true),
  ('Veer Narmad South Gujarat University', 'vnsgu', 'Surat', 'Gujarat', 'India', true),
  ('P P Savani University', 'ppsu', 'Surat', 'Gujarat', 'India', true),
  ('SIET - Surat Institute of Engineering & Technology', 'siet_s', 'Surat', 'Gujarat', 'India', true),
  ('The Maharaja Sayajirao University of Baroda', 'msu', 'Vadodara', 'Gujarat', 'India', true),
  ('BVM Engineering College (Vallabh Vidyanagar)', 'bvm_v', 'Vadodara', 'Gujarat', 'India', true),
  ('Parul University', 'parul', 'Vadodara', 'Gujarat', 'India', true),
  ('GTU - Government Engineering College Vadodara', 'gtu_v', 'Vadodara', 'Gujarat', 'India', true),
  ('MSU Faculty of Engineering', 'msv', 'Vadodara', 'Gujarat', 'India', true),
  ('PDEU - Pandit Deendayal Energy University', 'pdpu', 'Vadodara', 'Gujarat', 'India', true),
  ('Marwadi University', 'marwadi_r', 'Rajkot', 'Gujarat', 'India', true),
  ('RK University', 'rk_univ', 'Rajkot', 'Gujarat', 'India', true),
  ('K.R. Shah Degree Engineering College', 'kr_shah', 'Rajkot', 'Gujarat', 'India', true),
  ('GTU - Government Engineering College Rajkot', 'gtu_r', 'Rajkot', 'Gujarat', 'India', true),
  ('Saurashtra University (Rajkot)', 'sgvu_r', 'Rajkot', 'Gujarat', 'India', true),
  ('PDEU - Pandit Deendayal Energy University', 'pdpu_gn', 'Gandhinagar', 'Gujarat', 'India', true),
  ('DA-IICT - Dhirubhai Ambani Institute', 'da_iict', 'Gandhinagar', 'Gujarat', 'India', true),
  ('IIT Gandhinagar', 'iit_gn', 'Gandhinagar', 'Gujarat', 'India', true),
  ('Gujarat Technological University (GTU)', 'gtu_main', 'Gandhinagar', 'Gujarat', 'India', true),
  ('GIFT City College', 'gift_gn', 'Gandhinagar', 'Gujarat', 'India', true),
  ('BVM Engineering College (Vallabh Vidyanagar)', 'bvm_a', 'Anand', 'Gujarat', 'India', true),
  ('ADIT - A.D. Patel Institute of Technology', 'adit_a', 'Anand', 'Gujarat', 'India', true),
  ('Sardar Patel College of Engineering', 'spce', 'Anand', 'Gujarat', 'India', true),
  ('Bhavnagar University', 'bau', 'Bhavnagar', 'Gujarat', 'India', true),
  ('GTU - Government Engineering College Bhavnagar', 'gtu_b', 'Bhavnagar', 'Gujarat', 'India', true),
  ('Government Engineering College Jamnagar', 'gtu_j', 'Jamnagar', 'Gujarat', 'India', true),
  ('Government Engineering College Morbi', 'morbi', 'Morbi', 'Gujarat', 'India', true),
  ('Government Engineering College Palanpur', 'palanpur', 'Palanpur', 'Gujarat', 'India', true),
  ('Government Engineering College Modasa', 'modasa', 'Modasa', 'Gujarat', 'India', true),
  ('Hirak University', 'hirak', 'Hirak', 'Gujarat', 'India', true)
on conflict (slug) do update
set name = excluded.name,
    city = excluded.city,
    state = excluded.state,
    country = excluded.country,
    is_active = true,
    updated_at = now();

insert into public.branches (college_id, name, code, is_active)
select c.id, branch.name, branch.code, true
from public.colleges c
cross join (
  values
    ('Computer Engineering', 'CE'),
    ('Information Technology', 'IT'),
    ('Electronics & Communication Engineering', 'EC'),
    ('Mechanical Engineering', 'ME'),
    ('Civil Engineering', 'CE2'),
    ('Electrical Engineering', 'EE'),
    ('BCA (Bachelor of Computer Applications)', 'BCA'),
    ('MCA (Master of Computer Applications)', 'MCA'),
    ('Artificial Intelligence & Data Science', 'AI'),
    ('Cyber Security', 'CYBER')
) as branch(name, code)
where c.slug <> 'other'
on conflict (college_id, name) do update
set code = excluded.code,
    is_active = true,
    updated_at = now();
