# School Management System (SMS) Roadmap

## Phase 1: Project Setup & Architecture
- [x] Initialize Monorepo (Next.js, Turborepo) <!-- id: 0 -->
- [x] Configure Tailwind CSS & Shadcn UI <!-- id: 1 -->
- [x] Set up Database (PostgreSQL + Prisma) <!-- id: 2 -->
- [x] Design Database Schema (Initial) <!-- id: 3 -->

## Phase 2: Authentication & Roles
- [x] Setup Auth Provider (Auth.js / Clerk) <!-- id: 4 -->
- [x] Implement Role-Based Access Control (RBAC: Admin, Teacher, Student, Parent) <!-- id: 5 -->
- [ ] Create Login/Signup Pages <!-- id: 6 -->
- [x] Create Role-Specific Layouts/Dashboards (Admin: ✅, Teacher: ✅, Parent: ✅) <!-- id: 7 -->

## Phase 3: Academic Structure (Core)
- [x] Create Class/Grade Management (CRUD Implemented) <!-- id: 8 -->
- [x] Create Section Management (Integrated with Classes) <!-- id: 9 -->
- [x] Create Subject Management (CRUD Implemented) <!-- id: 10 -->
- [ ] Assign Subjects to Classes/Teachers (Partially done via Subject creation) <!-- id: 11 -->

## Phase 4: User Management
- [x] Student Admission Module (Basic CRUD & Enrollment) <!-- id: 12 -->
- [x] Teacher Directory & Profiles (Basic CRUD) <!-- id: 13 -->
- [x] Parent Association (CRUD & Student Link) <!-- id: 14 -->
- [x] Roll Number Field (Added, distinct from Admission No) <!-- id: 33 -->
- [ ] Bulk Actions (Import/Export) <!-- id: 15 -->

## Phase 5: Teacher Portal
- [x] Teacher Dashboard (Layout & Stats) <!-- id: 28 -->
- [x] My Classes (View Assigned Classes) <!-- id: 29 -->
- [x] My Schedule (View Timetable) <!-- id: 30 -->
- [x] Mark Attendance (For Assigned Classes - Roll | Name | Status view) <!-- id: 31 -->
- [ ] Gradebook (Enter Marks) <!-- id: 32 -->

## Phase 6: Parent Portal (NEW)
- [x] Parent Dashboard (Layout & Children List) <!-- id: 34 -->
- [x] Child Details Page (Attendance & Marks) <!-- id: 35 -->
- [x] Class Schedule View (For Child's Class) <!-- id: 36 -->
- [x] Mobile Bottom Navigation <!-- id: 37 -->

## Phase 7: Daily Operations
- [x] Attendance System (Student Marking) <!-- id: 16 -->
- [x] Admin Attendance View (Roll | Name | Admission | Status) <!-- id: 38 -->
- [x] Timetable/Schedule Generator (Class Routine) <!-- id: 17 -->
- [ ] Calendar & Events <!-- id: 18 -->

## Phase 8: Examinations & Results
- [x] Exam Scheduling & Types <!-- id: 19 -->
- [ ] Grading System Configuration (GPA/Marks) <!-- id: 20 -->
- [x] Result Entry (Quick Grid Entry) <!-- id: 21 -->

## Phase 9: Finance & Administration
- [ ] Fee Structure Configuration <!-- id: 22 -->
- [ ] Fee Collection & Invoicing <!-- id: 23 -->
- [ ] Expense Tracking <!-- id: 24 -->

## Phase 10: Communication & Extras
- [ ] Notice Board <!-- id: 25 -->
- [ ] Internal Messaging System <!-- id: 26 -->
- [ ] Library Management (Basic) <!-- id: 27 -->

## Phase 11: UI/UX Enhancements
- [x] Mobile-First Responsive Design (Admin & Parent Portals) <!-- id: 39 -->
- [x] Hamburger Menu for Admin Sidebar <!-- id: 40 -->
- [x] Bottom Navigation for Parent Portal (Mobile) <!-- id: 41 -->
- [x] Responsive Tables with Horizontal Scroll <!-- id: 42 -->
