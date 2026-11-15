import type { AiTool, AppNotification, CommunityPost, ContinueItem, Resource, ResourceRequest } from '@/types'

/* DEMO ONLY — every record below is hardcoded sample data. */

export const demoResources: Resource[] = [
  {
    id: 'res_01',
    title: 'Operating Systems — Unit 3 Complete Notes',
    category: 'Notes',
    college: 'Vidya Nagar Institute of Technology',
    branch: 'Computer Engineering',
    semester: 5,
    subject: 'Operating Systems',
    rating: 4.8,
    downloads: 1240,
    addedBy: 'Riya P.',
    addedAt: '2 days ago',
    description:
      'Handwritten and typed notes covering process scheduling, deadlock avoidance and memory management with solved examples.',
  },
  {
    id: 'res_02',
    title: 'DBMS Previous Year Papers (2021 – 2024)',
    category: 'Previous Year Papers',
    college: 'Vidya Nagar Institute of Technology',
    branch: 'Computer Engineering',
    semester: 5,
    subject: 'Database Management Systems',
    rating: 4.9,
    downloads: 2110,
    addedBy: 'Karan M.',
    addedAt: '5 days ago',
    description: 'Eight solved question papers with marking schemes and repeated question analysis.',
  },
  {
    id: 'res_03',
    title: 'Computer Networks — Question Bank with Answers',
    category: 'Question Banks',
    college: 'Vidya Nagar Institute of Technology',
    branch: 'Computer Engineering',
    semester: 5,
    subject: 'Computer Networks',
    rating: 4.6,
    downloads: 860,
    addedBy: 'Sneha R.',
    addedAt: '1 week ago',
    description: 'Chapter-wise short and long answer questions, updated for the current syllabus.',
  },
  {
    id: 'res_04',
    title: 'Software Engineering Lab Manual',
    category: 'Lab Manuals',
    college: 'Vidya Nagar Institute of Technology',
    branch: 'Computer Engineering',
    semester: 5,
    subject: 'Software Engineering',
    rating: 4.4,
    downloads: 540,
    addedBy: 'Aditya K.',
    addedAt: '1 week ago',
    description: 'All ten lab experiments with aim, procedure, output screenshots and viva questions.',
  },
  {
    id: 'res_05',
    title: 'Web Technologies — Unit 4 PPT Deck',
    category: 'PPTs',
    college: 'Vidya Nagar Institute of Technology',
    branch: 'Computer Engineering',
    semester: 5,
    subject: 'Web Technologies',
    rating: 4.3,
    downloads: 410,
    addedBy: 'Meera S.',
    addedAt: '2 weeks ago',
    description: 'Presentation covering CSS grid, flexbox and responsive design patterns.',
  },
  {
    id: 'res_06',
    title: 'Theory of Computation — Important Questions',
    category: 'Important Questions',
    college: 'Vidya Nagar Institute of Technology',
    branch: 'Computer Engineering',
    semester: 5,
    subject: 'Theory of Computation',
    rating: 4.7,
    downloads: 990,
    addedBy: 'Veer J.',
    addedAt: '3 weeks ago',
    description: 'Most repeated exam questions across the last six years, prioritised by frequency.',
  },
]

export const demoAiTools: AiTool[] = [
  { id: 'assignment', name: 'Assignment Generator', description: 'Draft structured answers from your notes.', icon: 'PenLine', group: 'Generate' },
  { id: 'exam-ready', name: 'Exam Ready Answer', description: 'Point-wise answers formatted for marking schemes.', icon: 'Zap', group: 'Prepare' },
  { id: 'knowledge', name: 'Knowledge Answer', description: 'Deeper explanations for real understanding.', icon: 'Brain', group: 'Understand' },
  { id: 'text-translate', name: 'Text Translator', description: 'Translate passages into English, Hindi or Gujarati.', icon: 'Languages', group: 'Understand' },
  { id: 'pdf-translate', name: 'PDF Translator', description: 'Translate an entire document while keeping layout.', icon: 'FileText', group: 'Understand' },
  { id: 'quiz', name: 'Quiz Generator', description: 'Turn any topic into a timed practice quiz.', icon: 'ClipboardList', group: 'Prepare' },
  { id: 'flashcards', name: 'Flashcard Generator', description: 'Build spaced-repetition cards automatically.', icon: 'Layers', group: 'Prepare' },
  { id: 'explain', name: 'Simple Explanation', description: 'Re-explain a hard concept in plain language.', icon: 'Lightbulb', group: 'Understand' },
  { id: 'study-plan', name: 'AI Study Plan', description: 'A day-by-day plan up to your exam date.', icon: 'CalendarDays', group: 'Prepare' },
  { id: 'paper-prediction', name: 'Previous Paper Prediction', description: 'Spot repeated and high-priority questions.', icon: 'FileQuestion', group: 'Prepare' },
  { id: 'weak-topics', name: 'Weak Topic Detection', description: 'Find the topics costing you marks.', icon: 'TrendingUp', group: 'Understand' },
  { id: 'summary', name: 'Summary Generator', description: 'Condense long chapters into revision notes.', icon: 'BookOpen', group: 'Generate' },
  { id: 'question-gen', name: 'Question Generator', description: 'Practice questions at the difficulty you choose.', icon: 'MessageSquare', group: 'Generate' },
]

export const demoContinue: ContinueItem[] = [
  { id: 'c1', title: 'Deadlock Detection Algorithms', subject: 'Operating Systems', progress: 72, lastSeen: 'Yesterday' },
  { id: 'c2', title: 'Normalization: 1NF to BCNF', subject: 'Database Management Systems', progress: 45, lastSeen: '2 days ago' },
  { id: 'c3', title: 'TCP Congestion Control', subject: 'Computer Networks', progress: 18, lastSeen: 'Last week' },
]

export const demoRequests: ResourceRequest[] = [
  { id: 'req_1', title: 'Compiler Design — Unit 2 notes', category: 'Notes', status: 'Pending', createdAt: '1 day ago' },
  { id: 'req_2', title: 'DBMS lab manual (2025 syllabus)', category: 'Lab Manuals', status: 'Added', createdAt: '4 days ago' },
  { id: 'req_3', title: 'Embedded Systems previous papers', category: 'Previous Year Papers', status: 'Not Available', createdAt: '1 week ago' },
]

export const demoCommunity: CommunityPost[] = [
  { id: 'p1', author: 'Riya P.', subject: 'Operating Systems', snippet: 'How do you differentiate deadlock avoidance from detection in the exam?', replies: 12, likes: 34 },
  { id: 'p2', author: 'Karan M.', subject: 'Database Management Systems', snippet: 'Shared my approach to solving normalization problems step by step.', replies: 8, likes: 27 },
  { id: 'p3', author: 'Sneha R.', subject: 'Computer Networks', snippet: 'Which layers should I focus on for the 10-mark questions this year?', replies: 5, likes: 19 },
]

export const demoNotifications: AppNotification[] = [
  { id: 'n1', title: 'Resource approved', body: 'Your DBMS question bank is now live in Explore.', time: '12m', read: false, kind: 'approval' },
  { id: 'n2', title: 'Request fulfilled', body: 'Compiler Design notes were added by Aditya K.', time: '2h', read: false, kind: 'request' },
  { id: 'n3', title: 'Study plan reminder', body: 'Unit 3 revision is scheduled for today at 7:00 PM.', time: '5h', read: true, kind: 'plan' },
  { id: 'n4', title: 'New in your college', body: '3 new Software Engineering resources were approved.', time: '1d', read: true, kind: 'announcement' },
]

export const demoStats = [
  { label: 'Resources saved', value: '24', delta: '+4 this week' },
  { label: 'Study hours', value: '18.5', delta: '+2.5 vs last week' },
  { label: 'AI generations', value: '63', delta: '+11 this week' },
  { label: 'Avg. resource rating', value: '4.7', delta: 'from 12 ratings' },
]
