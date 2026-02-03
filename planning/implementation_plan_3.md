# SMS Implementation Plan: Phase 2.2 - User Sync & RBAC

## Goal
Connect the Authentication system (Clerk) to our internal Database and enforce Role-Based Access Control (RBAC).
Currently, users are created in Clerk but **do not exist** in our Postgres `User` table. We need to sync them and then route them to the correct dashboard.

## Next Steps

### 1. Clerk Webhook (User Sync)
**Why?** When a user registers in Clerk, we need to create a corresponding `User` record in our DB with a default role (`STUDENT`).
*   **[task]** Create API Route: `apps/web/app/api/webhooks/clerk/route.ts`
*   **[task]** Verify Signature: Use `svix` to ensure the webhook is actually from Clerk.
*   **[task]** DB Operation: `prisma.user.create` or `update` based on the webhook event (`user.created`, `user.updated`).

### 2. Role Enforcement (RBAC)
**Why?** An Admin should not see the Student dashboard, and vice-versa.
*   **[task]** `lib/auth.ts`: Create utilities to fetch the current user's role from the DB.
*   **[task]** `middleware.ts`: Update to potentially block routes (optional, usually handled in Layouts).

### 3. Dashboard Architecture
**Why?** Different roles need different navigation and features.
*   **[task]** `apps/web/app/(dashboard)/layout.tsx`: The main shell. Checks role -> Redirects if unauthorized.
*   **[task]** `apps/web/app/(dashboard)/admin/page.tsx`: Admin Landing.
*   **[task]** `apps/web/app/(dashboard)/teacher/page.tsx`: Teacher Landing.
*   **[task]** `apps/web/app/(dashboard)/student/page.tsx`: Student Landing.
*   **[task]** `apps/web/app/(dashboard)/parent/page.tsx`: Parent Landing.

## Verification Strategy
1.  **Webhook Test**: Use `ngrok` or Clerk's "Test Webhook" feature to simulate a user creation.
2.  **DB Check**: Confirm a new row appears in `User` table with `role: STUDENT`.
3.  **Login Test**: Log in with the new user -> Verify redirection to `/student`.
4.  **Role Switch Test**: Manually update the role in DB to `ADMIN` -> Verify access to `/admin`.
