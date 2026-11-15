import type { Student } from '@/types'

/* DEMO ONLY — a fake signed-in student. No authentication exists yet. */
export const demoStudent: Student = {
  id: 'stu_1042',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@vidyanagar.edu.in',
  role: 'student',
  avatarInitials: 'AS',
  college: 'Vidya Nagar Institute of Technology',
  branch: 'Computer Engineering',
  semester: 5,
  preferredLanguage: 'English',
  answerStyle: 'Exam Ready',
}

export const semesterSubjects = [
  'Operating Systems',
  'Database Management Systems',
  'Computer Networks',
  'Software Engineering',
  'Theory of Computation',
  'Web Technologies',
]
