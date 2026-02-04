# Deployment Failures Log

This document tracks all deployment failures encountered during the Al-Hera School Management System development, including their causes and solutions.

---

## 1. Prisma 7 URL Configuration Error

**Error:**
```
Error: The `url` property is not allowed in the `datasource` block when a `prisma.config.ts` file is present.
```

**Cause:** Prisma 7 introduced a breaking change where the database URL must be configured in `prisma.config.ts` only, not in `schema.prisma`.

**Solution:** Remove the `url` line from `schema.prisma`:
```diff
datasource db {
  provider = "postgresql"
- url = env("DATABASE_URL")
+ // URL is configured in prisma.config.ts (Prisma 7+ requirement)
}
```

**File:** `apps/web/prisma/schema.prisma`

---

## 2. Missing Module `@/utils/roles`

**Error:**
```
Cannot find module '@/utils/roles' or its corresponding type declarations.
```

**Cause:** The teacher layout was importing a helper function (`checkRole`) from a module that was never created.

**Solution:** Remove the unused import since the function wasn't being used:
```diff
- import { checkRole } from "@/utils/roles";
+ // Role check can be added here when utils/roles is implemented
```

**File:** `apps/web/app/(dashboard)/teacher/layout.tsx`

---

## 3. Non-existent `username` Field on User Model

**Error:**
```
Type error: Object literal may only specify known properties, and 'username' does not exist in type...
```

**Cause:** The `createTeacher` action was trying to set a `username` field that doesn't exist in the Prisma User model.

**Solution:** Remove the `username` field from the user creation:
```diff
user = await prisma.user.create({
  data: {
-   username: username,
    email: email,
    fullName: fullName,
    ...
  }
});
```

**File:** `apps/web/lib/actions.ts`

---

## 4. Server Actions Return Type Mismatch

**Error:**
```
Type 'Promise<{ message: string; }>' is not assignable to type 'void | Promise<void>'
```

**Cause:** Server actions returning error objects (like `{ message: string }`) were used directly as form `action` props, which expect `void` return type.

**Solution:** Wrap server actions in async void functions:
```diff
- <form action={updateMarks}>
+ <form action={async (formData) => {
+   "use server";
+   await updateMarks(formData);
+ }}>
```

**Files Affected:**
- `teacher/marks/[examId]/[classId]/[subjectId]/page.tsx`
- `admin/classes/new/page.tsx`
- `admin/exams/new/page.tsx`
- `admin/teachers/new/page.tsx`
- `admin/parents/new/page.tsx`
- `admin/subjects/new/page.tsx`
- `admin/students/new/page.tsx`
- `admin/schedule/[id]/page.tsx`
- Multiple delete/update forms across admin pages

---

## 5. Date String Potentially Undefined

**Error:**
```
Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```

**Cause:** TypeScript's strict mode flagged that `toISOString().split('T')[0]` could return `undefined`.

**Solution:** Add non-null assertion:
```diff
- const today = new Date().toISOString().split('T')[0];
+ const today = new Date().toISOString().split('T')[0]!;
```

**File:** `apps/web/app/(dashboard)/teacher/attendance/[id]/page.tsx`

---

## 6. Time Parsing Undefined Values

**Error:**
```
Argument of type 'number | undefined' is not assignable to parameter of type 'number'.
```

**Cause:** When parsing time strings like "HH:MM", the `split(':').map(Number)` could return undefined values.

**Solution:** Add nullish coalescing for safety:
```diff
- date.setHours(hours, minutes, 0, 0);
+ date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
```

**File:** `apps/web/lib/actions.ts`

---

## 7. Implicit `any[]` Type for Students Array

**Error:**
```
Variable 'students' implicitly has type 'any[]' in some locations where its type cannot be determined.
```

**Cause:** Array was initialized without explicit type annotation.

**Solution:** Add explicit type:
```diff
- let students = [];
+ let students: { id: number; fullName: string; admissionNo: string }[] = [];
```

**File:** `apps/web/app/(dashboard)/admin/exams/[id]/page.tsx`

---

## Environment Variable Warnings

**Warning:**
```
DATABASE_URL and CLERK_SECRET_KEY are set on Vercel but missing from "turbo.json"
```

**Status:** Non-blocking warning. The build succeeds despite this warning because the variables are properly loaded by `prisma.config.ts` and Clerk SDK.

**Recommendation:** Consider adding these to `turbo.json` for proper Turborepo environment handling in the future.

---

## Summary Table

| # | Error Type | Root Cause | Quick Fix |
|---|------------|------------|-----------|
| 1 | Prisma Config | Prisma 7 breaking change | Remove URL from schema.prisma |
| 2 | Missing Module | Unused import | Remove import |
| 3 | Invalid Field | Schema mismatch | Remove field |
| 4 | Type Mismatch | Return type issue | Wrap in async void |
| 5 | Undefined Value | Strict null checks | Non-null assertion |
| 6 | Undefined Value | Array access safety | Nullish coalescing |
| 7 | Implicit Any | Missing type annotation | Add explicit type |
