import { z } from "zod";

// --- Student Schemas ---
export const createStudentSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    admissionNo: z.string().min(1, "Admission number is required"),
    classId: z.string().optional(),
    parentId: z.string().optional(),
    rollNumber: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.extend({
    id: z.string().min(1, "Student ID is required"),
});

// --- Teacher Schemas ---
export const createTeacherSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    specialization: z.string().optional(),
});

export const updateTeacherSchema = createTeacherSchema.extend({
    id: z.string().min(1, "Teacher ID is required"),
});

// --- Parent Schemas ---
export const createParentSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
});

export const updateParentSchema = createParentSchema.extend({
    id: z.string().min(1, "Parent ID is required"),
});

// --- Class Schemas ---
export const createClassSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    section: z.string().optional(),
    capacity: z.string().optional(),
    supervisorId: z.string().optional(),
});

// --- Subject Schemas ---
export const createSubjectSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    classId: z.string().min(1, "Class is required"),
});

// --- Exam Schemas ---
export const createExamSchema = z.object({
    name: z.string().min(1, "Exam name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
});

// --- Schedule/Routine Schemas ---
export const createRoutineSchema = z.object({
    classId: z.string().min(1, "Class is required"),
    subjectId: z.string().min(1, "Subject is required"),
    teacherId: z.string().min(1, "Teacher is required"),
    day: z.string().min(1, "Day is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
});

// --- Delete Schema (Common) ---
export const deleteSchema = z.object({
    id: z.string().min(1, "ID is required"),
});

// --- Helper to validate FormData ---
export function validateFormData<T>(
    schema: z.ZodSchema<T>,
    formData: FormData
): { success: true; data: T } | { success: false; error: string } {
    const rawData: Record<string, unknown> = {};

    formData.forEach((value, key) => {
        rawData[key] = value;
    });

    const result = schema.safeParse(rawData);

    if (!result.success) {
        const firstError = result.error.issues[0];
        return { success: false, error: firstError?.message || "Validation failed" };
    }

    return { success: true, data: result.data };
}
