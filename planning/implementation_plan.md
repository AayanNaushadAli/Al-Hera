# School Management System (SMS) Implementation Plan

## Goal Description
Build a comprehensive, production-grade School Management System (SMS) / ERP from scratch. The system will handle all core school operations including admission, attendance, grading, fee management, and communication. It will support multiple roles: Administrators, Teachers, Students, and Parents.

## Architecture & Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Auth**: Auth.js (NextAuth) v5 or Clerk
- **Monorepo Tools**: Turborepo
- **Deployment**: Vercel (Frontend), Neon/Supabase (Database)

## Proposed Changes (Roadmap)

### Phase 1: Foundation & Setup
#### [DONE] Monorepo Structure
- Initialize Turborepo.
- `apps/web`: The main SMS application.
- `packages/ui`: Shared UI component library (Shadcn).
- `packages/database`: Prisma schema and client.

#### [DONE] Database Config (Prisma 7)
- `prisma.config.ts`: Configuration for datasource.
- `schema.prisma`: Schema definitions.

#### [NEW] Database Schema (Pending)
- **User**: Base entity for auth (includes Role enum).
- **Student**: Profile, Relation to Class, Parent.
- **Teacher**: Profile, Relation to Subjects/Classes.
- **Parent**: Contact info, Relation to Students.
- **Class/Grade**: E.g., "Grade 10".
- **Section**: E.g., "Section A".
- **Subject**: E.g., "Mathematics".
- **AcademicYear**: To manage yearly data.
- **Attendance**: Daily records.
- **Exam/Result**: Grading data.
- **Fee**: Invoices and payments.

### Phase 2: Authentication & Layouts
- Implement Role-Based Access Control (RBAC).
- Create generic `DashboardLayout` with sidebar navigation dynamic to the user's role.
- **Admin Dashboard**: Overview of stats (total students, fees collected).
- **Teacher Dashboard**: Today's classes, attendance pending.
- **Student Dashboard**: Timetable, recent grades.

### Phase 3: Core Modules Implementation
#### Academic Management
- CRUD for Classes, Sections, Subjects.
- Assign Teachers to Sections for specific Subjects.
- **Timetable**: Grid view for weekly schedules.

#### User Management
- **Admissions**: Multi-step form for registering new students.
- **Bulk Upload**: CSV import for legacy data.

#### Daily Operations
- **Attendance**: Visual tracker (Grid/List) for marking present/absent.
- **Calendar**: Global and specific events (Holidays, Exams).

#### Examinations & Grading
- Define Exam Terms (Mid-term, Final).
- Gradebook Entry interface for teachers.
- Report Card generation (Printable View).

#### Finance
- Fee Structure creation (Tuition, Transport, etc.).
- Invoice generation for students.
- Payment tracking/Receipts.

## Verification Plan
### Automated Tests
- Implementation of standardized unit tests for utility functions.
- End-to-End testing using Playwright for critical flows (Login -> Mark Attendance -> Verify).

### Manual Verification
- **Role Switching**: Log in as Admin, create a Teacher. Log in as that Teacher, mark attendance. Log in as Student, view attendance.
- **Data Integrity**: Verify that a student assigned to "Class 10-A" appears in the "Class 10-A" attendance register.
