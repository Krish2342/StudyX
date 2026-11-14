# STUDYX — MASTER FRONTEND DEVELOPMENT INSTRUCTIONS

You are my senior frontend architect, premium UI/UX designer, React developer, animation specialist, and development mentor.

Your task is to help me build **StudyX**, a premium, fully responsive, beautifully animated, AI-powered college student platform.

I am a beginner developer. Explain technical steps in simple language and provide exact Windows PowerShell commands and file paths whenever needed.

## 1. IMPORTANT PROJECT RULES

We will build this project in two major stages:

**STAGE 1 — FRONTEND FIRST**
- Build the complete frontend experience.
- Make the UI interactive, responsive, polished, and animated.
- Use realistic demo data and local frontend state.
- Organize code so that backend integration is straightforward.
- Do not build the real backend, database, authentication, or AI integrations yet.

**STAGE 2 — BACKEND LATER**
We will work together on:
- Backend architecture
- Database design
- Google authentication
- Resource management
- Admin permissions
- AI provider integrations
- File and Google Drive handling
- Security and deployment

Do not begin Stage 2 unless I explicitly ask.

Never claim a demo feature is connected to a real backend or AI service.

## 2. PRODUCT VISION

StudyX is an AI-powered student platform that helps college students:

**Find → Study → Understand → Practice → Prepare → Share**

The platform should help students discover study materials, understand difficult topics, generate study content, prepare for examinations, and share useful resources.

Support multiple colleges, branches, semesters, and subjects.

There are two main roles:
1. Student
2. Super Admin

## 3. DESIGN IDENTITY — FOLLOW EXACTLY

Create a premium, modern, visually distinctive education SaaS product.

### Color system: 60–30–10

Use these exact colors:

- 60% Black: #0A0A0A
- 30% White: #FFFFFF
- 10% Soft Blue: #8DB9F0

Usage:
- Black: Main backgrounds, navigation, dark surfaces, and major sections.
- White: Main text, readable content, contrast, and selected card surfaces.
- Soft Blue: Active navigation, buttons, focus states, highlights, icons, gradients, and important interactions.

Do not introduce pink, purple, or unrelated dominant accent colors.

### Theme

Use a consistent dark theme throughout the application.

The landing page, authentication screens, student dashboard, AI tools, and admin panel should all feel like one coherent product.

Use different shades of black and subtle surface elevation to create depth. Use white carefully for contrast and readability.

### Visual style: HYBRID

Combine these three design approaches:

1. **Bento Grid:** Modern modular dashboard layouts, attractive information cards, varied card sizes, and clear visual grouping.
2. **Tasteful 3D:** Subtle depth, layered elements, perspective effects, soft shadows, and occasional 3D visual details.
3. **Premium SaaS:** Professional typography, refined spacing, elegant navigation, clean charts, consistent components, and excellent usability.

Avoid making every card look identical. Use visual hierarchy and purposeful layout variation.

Do not overuse glassmorphism, gradients, glowing effects, or 3D animations.

## 4. ANIMATION SYSTEM

Follow the supplied PDF's iterative website-building workflow, adapting it to OpenCode.

Use Motion:

`motion/react`

Create purposeful animations:
- Smooth page transitions
- Staggered card entrances
- Hover and press feedback
- Sidebar transitions
- Animated dropdowns and modals
- Search suggestions
- Skeleton loaders
- Progress indicators
- Toast notifications
- AI processing animations
- Interactive 3D-inspired visual elements

Use spring animations thoughtfully.

Requirements:
- Animations should feel smooth and premium.
- Avoid unnecessary motion.
- Maintain good performance.
- Support prefers-reduced-motion.
- Do not make the interface slow or distracting.

## 5. FRONTEND TECHNOLOGY

Preferred stack:

- React
- Vite
- TypeScript
- Tailwind CSS
- Motion (motion/react)
- React Router
- Lucide React icons
- Recharts for charts where appropriate

Use shadcn/ui or compatible 21st.dev React components when useful.

If a UI UX Pro Max skill is available in the environment, inspect and use it. Do not pretend it is installed if it is not.

Avoid unnecessary dependencies. Check installed package versions before using APIs.

## 6. ENTRY EXPERIENCE — BOTH

StudyX must have both a public landing experience and a student application experience.

### Public landing page

Create a beautiful public homepage containing:

- Premium navigation bar
- StudyX branding
- Hero section with a strong headline
- Clear explanation of StudyX
- Search or explore call to action
- AI study tools showcase
- Resource library showcase
- How StudyX works
- Benefits for students
- Feature sections using Bento Grid layouts
- Attractive animated illustrations
- Final call to action
- Footer with useful navigation

The landing page should feel like a real premium technology product, not a basic college project.

Include navigation to Login and Get Started.

### Login and onboarding screens

Build frontend-only login and onboarding screens.

Show Google sign-in as a demo interface. Do not implement real Google authentication yet.

Create an onboarding experience with:
- Name
- Email
- Profile photo placeholder
- College
- Branch
- Semester
- Preferred language
- Preferred answer style

After the demo login flow, navigate to the student dashboard.

## 7. RESPONSIVE APPLICATION LAYOUT

### Desktop

Create a collapsible sidebar with:

- Dashboard
- Explore
- AI Tools
- Saved
- My Study Space
- Community
- Requests
- Support

Include:
- Top navigation
- Global search
- Notifications
- Profile menu
- Main content area

### Mobile

Create a purpose-built mobile interface with bottom navigation:

- Home
- Search
- AI
- Saved
- Profile

Do not simply shrink the desktop layout.

Make separate responsive decisions for:
- Mobile
- Tablet
- Laptop
- Desktop

All controls must be touch-friendly. Avoid horizontal overflow.

## 8. STUDENT DASHBOARD

Build a polished student dashboard with:

- Personalized greeting
- Student academic information
- Global search bar
- Continue Studying
- AI Study Tools
- Recently Added Resources
- Popular Resources
- My Requests
- Community activity
- Notifications
- Quick actions

Use a visually interesting Bento Grid layout.

Make the dashboard feel alive with realistic demo content, subtle animations, and meaningful interactions.

## 9. RESOURCE LIBRARY

Build an Explore page with these categories:

- Notes
- Books
- Assignments
- Previous Year Papers
- Question Banks
- Lab Manuals
- PPTs
- Important Questions
- Study Material
- Other

Each resource card should show:
- Cover image
- Resource title
- College
- Branch
- Semester
- Subject
- Star rating
- Open Notes action
- Share action
- Save action

Never display raw Google Drive URLs on resource cards.

### Resource details

Build a detailed resource page containing:
- Resource information
- Description
- Academic details
- Rating
- Related resources
- Open resource action
- Share and save actions

### Resource submission

Create a submission form with:
- College
- Branch
- Semester
- Subject
- Resource type
- Resource name
- Description
- Google Drive link
- Cover image

Students submit Google Drive links rather than uploading actual PDF files to our server in this frontend phase.

Show submission statuses:
- Pending
- Approved
- Rejected

A student's pending submissions should be visible in My Submissions.

Use demo state for approval and rejection.

## 10. GLOBAL SEARCH

Build a polished search experience.

Search across:
- Resource names
- Book names
- Subjects
- Keywords
- Descriptions
- Colleges
- Branches
- Semesters
- Resource types

Frontend demo search should support:
- Instant keyword search
- Search suggestions
- Recent searches
- Filters
- Sorting
- Empty states
- Clear search

Keep search logic separate from the UI so a real search API can replace it later.

## 11. STUDY SPACE

Create a My Study Space section with:

- Saved Resources
- AI History
- Generated Assignments
- Quizzes
- Flashcards
- Study Plans
- Resource Submissions
- Requested Resources
- Ratings

Include suitable empty states and demo data.

## 12. AI STUDY TOOLS

Create a premium AI Tools hub with individual tool interfaces.

Tools required:

1. Assignment Generator
2. Exam Ready Answer Generator
3. Knowledge Answer Generator
4. Text Translator
5. PDF Translator
6. Quiz Generator
7. Flashcard Generator
8. Simple Explanation
9. AI Study Plan
10. Previous Paper Prediction
11. Weak Topic Detection
12. Summary Generator
13. Question Generator

### AI tool controls

Where relevant, include:
- Input text
- File selection interface
- Source selection
- Output language
- Marks selection
- Answer style
- Generate button
- Loading state
- Output section
- Copy action
- Save action
- Regenerate action

Source selection:
- My Notes
- Platform Notes
- Both

Marks selection:
- 2 Marks
- 4 Marks
- 5 Marks
- 7 Marks
- 10 Marks

Output languages:
- English
- Hindi
- Gujarati

### Assignment Generator

Allow the student to:
1. Select notes as a source.
2. Enter the assignment question.
3. Select Exam Ready or Knowledge Answer.
4. Select language.
5. Generate a sample answer.

### Previous Paper Prediction

Create an interface for selecting and reviewing previous question papers from four or more years.

Show:
- Common questions
- Important topics
- Repeated questions
- New or less-repeated questions
- Priority indicators

Clearly display this disclaimer:

"Predictions are study guidance only and are not guaranteed examination questions."

### AI demo behavior

Do not call real AI APIs.

Create realistic sample outputs and frontend-only interactions. Clearly distinguish demo output from actual AI-generated results.

AI history should support:
- Open
- Save
- Rename
- Delete

Keep AI history private in the intended product design. Do not claim secure server storage in this frontend phase.

## 13. COMMUNITY

Create a student discussion area.

Students can:
- View discussions
- Ask questions
- Reply
- Like discussions
- Search discussions
- Filter discussions by subject or category

Community is for discussions only. Do not allow students to publish resources through the community.

Use local demo state.

## 14. RESOURCE REQUESTS

Create a resource request system.

Students can request:
- Missing notes
- Books
- Question papers
- Assignments
- Other academic resources

Show statuses:
- Pending
- Added
- Not Available

Create a My Requests page and an admin request-management view.

## 15. SUPPORT SYSTEM

Create a support center with ticket submission.

Ticket categories:
- Bug
- Broken Resource
- Resource Request
- Question
- Feature Suggestion
- Feedback

Each ticket should show:
- Ticket ID
- Category
- Description
- Date
- Status
- Admin reply

Statuses:
- Open
- In Progress
- Resolved

Use frontend demo interactions.

## 16. NOTIFICATIONS

Create a notification center with examples for:
- Resource approval or rejection
- Resource request fulfilled
- Admin reply
- Support ticket update
- Study plan reminder
- Referral update
- Announcements

Support read/unread states and useful navigation.

## 17. REFERRAL SYSTEM

Include a referral section.

Show:
- Referral code
- Share referral action
- Referral link placeholder
- Referral activity
- Referral progress

The future real system must prevent self-referrals and spam. For now, demonstrate the interface only.

Do not implement gamification XP, coins, badges, streaks, leaderboards, or competitions in V1.

## 18. ADMIN PANEL

Create a separate admin dashboard with a professional dark interface.

Admin navigation should include:

- Overview
- Resource Approvals
- All Resources
- Students
- Resource Requests
- Support Tickets
- Community Moderation
- AI Usage
- Analytics
- Colleges
- Branches
- Semesters
- Subjects
- Categories
- Site Settings

### Admin overview

Show:
- Total students
- Total resources
- Pending approvals
- Approved resources
- Resource requests
- Open support tickets
- AI usage overview
- Recent activity

Use Recharts for appropriate charts.

### Resource management

Create:
- Pending resource review
- Resource preview
- Approve action
- Reject action
- Edit resource
- Delete resource
- Replace broken Google Drive link

### Other admin features

Create frontend interfaces for:
- Student management
- Resource request management
- Support ticket replies
- Community moderation
- AI usage and limits
- Analytics
- College management
- Branch management
- Semester management
- Subject management
- Category management

All admin operations must be frontend simulations only.

## 19. INTERACTION QUALITY

Every visible control must have a meaningful frontend behavior.

This includes:
- Buttons
- Navigation links
- Forms
- Search
- Filters
- Tabs
- Menus
- Modals
- Dropdowns
- Bookmarks
- Ratings
- Notifications
- Profile actions

Do not leave dead buttons.

Use:
- Form validation
- Confirmation dialogs
- Toast feedback
- Loading states
- Empty states
- Error states
- Success states

Use local state for demo behavior.

Do not imply that demo data is stored securely or synchronized with a real backend.

## 20. CODE QUALITY

Use:
- Reusable components
- Clear folder structure
- TypeScript types
- Centralized design tokens
- Separate demo data
- Separate demo service/adapters
- Maintainable routing
- Consistent naming
- Accessible semantic HTML
- Keyboard navigation
- Visible focus states
- Proper contrast
- Reduced-motion support

Avoid giant components and duplicated code.

Prepare a clean frontend architecture so that future backend APIs and database services can replace demo adapters without rebuilding the UI.

## 21. DEVELOPMENT WORKFLOW — FOLLOW THE PDF

Follow this iterative process:

**ASK → LOOK → FIX → SAVE**

1. Inspect the current project.
2. Understand the existing code and dependencies.
3. Build one coherent section at a time.
4. Run the development server.
5. Review the result in a browser.
6. Identify design or functional problems.
7. Fix them.
8. Run build checks.
9. Save a Git commit when a milestone is stable.

Use 21st.dev components when they add value, but customize them to the StudyX design system.

Do not build the entire application in one massive unreviewed change.

Keep the development server available for preview.

## 22. DEVELOPMENT PHASES

Follow this order:

**Phase 1 — Project inspection and foundation**
- Inspect existing files and package.json.
- Check installed dependencies.
- Check available OpenCode skills.
- Establish the design system.
- Configure routing.
- Create reusable components.
- Build responsive application shell.
- Build landing page.
- Build student dashboard.

**Phase 2 — Resource experience**
- Explore
- Search
- Resource cards
- Resource details
- Submission
- My Submissions
- Saved Resources

**Phase 3 — AI experience**
- AI Tools hub
- Individual AI tools
- Sample output interactions
- AI History

**Phase 4 — Student workspace**
- My Study Space
- Community
- Requests
- Notifications
- Support
- Profile and settings
- Referral section

**Phase 5 — Admin experience**
- Admin dashboard
- Resource approvals
- Student management
- Requests
- Support
- Moderation
- Analytics
- Academic structure management

**Phase 6 — Final frontend polish**
- Responsive testing
- Animation refinement
- Accessibility
- Empty and error states
- Performance
- Production build

**Phase 7 — Backend integration**
Do not start until I ask.

## 23. IMPORTANT WORKING RULES

- I am a beginner, so explain what you are doing.
- Give exact PowerShell commands.
- Tell me which folder to open.
- Tell me which files you create or modify.
- Do not overwrite existing working code without inspecting it.
- Ask before major architecture or design changes.
- Build in small milestones.
- After each milestone, explain what is finished and what remains.
- Tell me what still uses demo data.
- Run checks and fix errors before declaring a milestone complete.
- Do not move to the next major milestone until I review the current one.
- Do not leave TODOs for core frontend requirements.
- Never claim something works unless you have tested it.

## 24. FIRST TASK — START HERE

Do not start building every page immediately.

First:

1. Inspect my current project folder.
2. Inspect package.json and existing source files.
3. Check available dependencies and OpenCode skills.
4. Identify any problems or blockers.
5. Propose the final folder structure.
6. Explain the first milestone in simple language.

Then implement only the first milestone:

- StudyX design tokens
- Typography and global styles
- Reusable buttons, cards, inputs, and navigation components
- Responsive application shell
- Desktop sidebar
- Mobile bottom navigation
- Public landing page
- Student dashboard

Make the landing page and dashboard visually excellent before proceeding to other modules.

After implementation:
- Run the project.
- Run npm run build.
- Fix errors.
- Report all changed files.
- Explain how I can preview the result.
- Tell me what is currently demo-only.
- Wait for my review.

**FINAL GOAL:** Build a premium, modern, fully responsive, beautifully animated StudyX frontend with a consistent dark theme, black/white/soft-blue color system, hybrid Bento + 3D + Premium SaaS design, and a clean architecture ready for future backend, database, authentication, and AI integration.