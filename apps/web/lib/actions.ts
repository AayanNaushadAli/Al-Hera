"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
    createTeacherSchema,
    createStudentSchema,
    createParentSchema,
    createClassSchema,
    createSubjectSchema,
    createExamSchema,
    createRoutineSchema,
    deleteSchema,
    validateFormData
} from "./validations";

// --- EXISTING: User Sync for Login ---
export async function syncUser() {
    const user = await currentUser();

    if (!user) return null;

    const existingUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
    });

    if (existingUser) return existingUser;

    const newUser = await prisma.user.create({
        data: {
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress ?? "",
            role: "STUDENT",
            fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        },
    });

    return newUser;
}


// --- Create Teacher (with Zod Validation) ---
export async function createTeacher(formData: FormData) {
    // Build fullName from name + surname for validation
    const name = formData.get("name") as string || "";
    const surname = formData.get("surname") as string || "";
    const email = formData.get("email") as string || "";
    const specialization = formData.get("specialization") as string || "";

    const fullName = `${name} ${surname}`.trim();

    // Validate input
    const validation = validateFormData(createTeacherSchema, new FormData());
    // Manual validation since form fields are different
    if (!fullName || fullName.length < 2) {
        return { message: "Name must be at least 2 characters" };
    }
    if (!email || !email.includes("@")) {
        return { message: "Valid email is required" };
    }

    try {
        // 1. SMART CHECK: Does this email already exist?
        let user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            // 🅰️ USER IS NEW: Create the account
            user = await prisma.user.create({
                data: {
                    email: email,
                    fullName: fullName,
                    clerkId: `manual_entry_${Date.now()}`, // Placeholder ID
                    role: "TEACHER"
                }
            });
        } else {
            // 🅱️ USER EXISTS: Just ensure they are marked as a Teacher
            if (user.role !== "TEACHER") {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: "TEACHER" }
                });
            }
        }

        // 2. Create the Teacher Profile (Linked to the User)
        // Check if profile already exists to prevent duplicates
        const existingProfile = await prisma.teacher.findFirst({
            where: { userId: user.id }
        });

        if (!existingProfile) {
            await prisma.teacher.create({
                data: {
                    userId: user.id,
                    fullName: fullName,
                    specialization: specialization,
                },
            });
        }

        revalidatePath("/admin/teachers");

    } catch (error) {
        console.error("Failed to create teacher:", error);
        return { message: "Database Error: Failed to create teacher." };
    }

    redirect("/admin/teachers");
}
// --- Update Teacher Action ---
export async function updateTeacher(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const specialization = formData.get("specialization") as string;

    const fullName = `${name} ${surname}`;

    try {
        // 1. Update Teacher Profile
        const updatedTeacher = await prisma.teacher.update({
            where: { id: parseInt(id) },
            data: {
                fullName: fullName,
                specialization: specialization,
            },
            include: { user: true }
        });

        // 2. Update User Account
        if (updatedTeacher.user) {
            await prisma.user.update({
                where: { id: updatedTeacher.user.id },
                data: {
                    fullName: fullName,
                    email: email
                }
            });
        }

        revalidatePath("/admin/teachers");
        revalidatePath(`/admin/teachers/${id}`);
    } catch (error) {
        console.log("Error updating teacher:", error);
        return { message: "Failed to update teacher" };
    }

    redirect("/admin/teachers");
}

// --- Delete Teacher Action ---
export async function deleteTeacher(formData: FormData) {
    const id = formData.get("id") as string;

    try {
        const teacher = await prisma.teacher.findUnique({
            where: { id: parseInt(id) },
            include: { user: true }
        });

        if (teacher && teacher.user) {
            await prisma.user.delete({ where: { id: teacher.user.id } });
        } else if (teacher) {
            await prisma.teacher.delete({ where: { id: parseInt(id) } });
        }

        revalidatePath("/admin/teachers");
    } catch (error) {
        console.log("Error deleting teacher:", error);
        return { message: "Failed to delete teacher" };
    }
}

// --- Create Student Action (with Zod Validation) ---
export async function createStudent(formData: FormData) {
    const name = formData.get("name") as string || "";
    const surname = formData.get("surname") as string || "";
    const email = formData.get("email") as string || "";
    const admissionNo = formData.get("admissionNo") as string || "";
    const rollNumber = formData.get("rollNumber") as string || "";
    const classId = formData.get("classId") as string || "";

    const fullName = `${name} ${surname}`.trim();

    // Validate input
    if (!fullName || fullName.length < 2) {
        return { message: "Name must be at least 2 characters" };
    }
    if (!email || !email.includes("@")) {
        return { message: "Valid email is required" };
    }
    if (!admissionNo) {
        return { message: "Admission number is required" };
    }

    try {
        // 1. Create the User (Login Account)
        const newUser = await prisma.user.create({
            data: {
                clerkId: `student_entry_${Date.now()}`,
                email: email,
                fullName: fullName,
                role: "STUDENT",
            },
        });

        // 2. Create the Student Profile
        await prisma.student.create({
            data: {
                userId: newUser.id,
                fullName: fullName,
                admissionNo: admissionNo,
                rollNumber: rollNumber || null, // NEW: Save roll number
                // Only connect a class if one was selected
                classId: classId ? parseInt(classId) : null,
            },
        });

        revalidatePath("/admin/students");
    } catch (error) {
        console.error("Failed to create student:", error);
        return { message: "Database Error: Failed to create student." };
    }

    redirect("/admin/students");
}

// --- Delete Student Action ---
export async function deleteStudent(formData: FormData) {
    const id = formData.get("id") as string;

    try {
        const student = await prisma.student.findUnique({
            where: { id: parseInt(id) },
            include: { user: true },
        });

        if (student && student.user) {
            await prisma.user.delete({ where: { id: student.user.id } });
        } else if (student) {
            await prisma.student.delete({ where: { id: parseInt(id) } });
        }

        revalidatePath("/admin/students");
    } catch (error) {
        console.log("Error deleting student:", error);
        return { message: "Failed to delete student" };
    }
}

// ... (keep all other actions above) ...

// --- Update Student Action (Enhanced with Parent) ---
export async function updateStudent(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const admissionNo = formData.get("admissionNo") as string;
    const classId = formData.get("classId") as string;
    const parentId = formData.get("parentId") as string; // <--- NEW

    const fullName = `${name} ${surname}`;

    try {
        // 1. Update Student Profile
        const updatedStudent = await prisma.student.update({
            where: { id: parseInt(id) },
            data: {
                fullName: fullName,
                admissionNo: admissionNo,
                classId: classId ? parseInt(classId) : null,
                parentId: parentId ? parseInt(parentId) : null, // <--- SAVING THE LINK
            },
            include: { user: true }
        });

        // 2. Update User Account
        if (updatedStudent.user) {
            await prisma.user.update({
                where: { id: updatedStudent.user.id },
                data: {
                    fullName: fullName,
                    email: email,
                },
            });
        }

        revalidatePath("/admin/students");
        revalidatePath(`/admin/students/${id}`);
    } catch (error) {
        console.log("Error updating student:", error);
        return { message: "Failed to update student" };
    }

    redirect("/admin/students");
}
//students done


// ... (keep Teacher and Student actions above) ...

// --- Create Class Action (with Zod Validation) ---
export async function createClass(formData: FormData) {
    const name = formData.get("name") as string || "";
    const capacityRaw = formData.get("capacity") as string || "";
    const supervisorIdRaw = formData.get("supervisorId") as string || "";

    // Validate input
    if (!name || name.trim().length < 1) {
        return { message: "Class name is required" };
    }

    const capacity = parseInt(capacityRaw);
    const supervisorId = supervisorIdRaw ? parseInt(supervisorIdRaw) : null;

    try {
        const newClass = await prisma.class.create({
            data: {
                name: name,
                capacity: isNaN(capacity) ? 30 : capacity,
                supervisorId: supervisorId,
            }
        });
        console.log("DEBUG: Class created successfully", newClass);

        revalidatePath("/admin/classes");
    } catch (error) {
        console.log("DEBUG: Error creating class:", error);
        return { message: "Failed to create class details. Check server logs." };
    }

    // Redirect should happen if no error
    redirect("/admin/classes");
}

// --- Delete Class Action ---
export async function deleteClass(formData: FormData) {
    const id = formData.get("id") as string;
    const classId = parseInt(id);

    try {
        // 1. Unassign students from this class
        await prisma.student.updateMany({
            where: { classId: classId },
            data: { classId: null as unknown as undefined }
        });

        // 2. Delete all routines linked to this class
        await prisma.classRoutine.deleteMany({
            where: { classId: classId }
        });

        // 3. Delete marks linked to subjects of this class
        const subjects = await prisma.subject.findMany({
            where: { classId: classId },
            select: { id: true }
        });
        const subjectIds = subjects.map(s => s.id);

        if (subjectIds.length > 0) {
            await prisma.mark.deleteMany({
                where: { subjectId: { in: subjectIds } }
            });
        }

        // 4. Delete all subjects linked to this class
        await prisma.subject.deleteMany({
            where: { classId: classId }
        });

        // 5. Now delete the class
        await prisma.class.delete({
            where: { id: classId },
        });

        revalidatePath("/admin/classes");
    } catch (error) {
        console.log("Error deleting class:", error);
        return { message: "Failed to delete class" };
    }
}
//class done

// ... (keep all other actions above) ...

// --- Create Subject Action (with Zod Validation) ---
export async function createSubject(formData: FormData) {
    const name = formData.get("name") as string || "";
    const classId = formData.get("classId") as string || "";

    // Validate input
    if (!name || name.trim().length < 1) {
        return { message: "Subject name is required" };
    }
    if (!classId) {
        return { message: "Class is required" };
    }

    try {
        await prisma.subject.create({
            data: {
                name: name,
                classId: parseInt(classId),
            },
        });

        revalidatePath("/admin/subjects");
    } catch (error) {
        console.error("Failed to create subject:", error);
        return { message: "Database Error: Failed to create subject." };
    }

    redirect("/admin/subjects");
}

// --- Delete Subject Action ---
export async function deleteSubject(formData: FormData) {
    const id = formData.get("id") as string;

    try {
        await prisma.subject.delete({
            where: { id: parseInt(id) },
        });

        revalidatePath("/admin/subjects");
    } catch (error) {
        console.log("Error deleting subject:", error);
        return { message: "Failed to delete subject" };
    }
}

// subjects action done here

// ... (keep all other actions above) ...

// --- Create Routine Item Action (with Zod Validation) ---
export async function createRoutine(formData: FormData) {
    const classId = formData.get("classId") as string || "";
    const subjectId = formData.get("subjectId") as string || "";
    const teacherId = formData.get("teacherId") as string || "";
    const day = formData.get("day") as string || "";
    const startTimeStr = formData.get("startTime") as string || "";
    const endTimeStr = formData.get("endTime") as string || "";

    // Validate input
    if (!classId) {
        return { message: "Class is required" };
    }
    if (!subjectId) {
        return { message: "Subject is required" };
    }
    if (!day) {
        return { message: "Day is required" };
    }
    if (!startTimeStr || !endTimeStr) {
        return { message: "Start and end time are required" };
    }

    // Helper to create a Date object from a Time string
    const createDateFromTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
        return date;
    };

    try {
        await prisma.classRoutine.create({
            data: {
                classId: parseInt(classId),
                subjectId: parseInt(subjectId),
                teacherId: teacherId ? parseInt(teacherId) : null,
                dayOfWeek: day,
                startTime: createDateFromTime(startTimeStr),
                endTime: createDateFromTime(endTimeStr),
            },
        });

        revalidatePath(`/admin/schedule/${classId}`);
    } catch (error) {
        console.error("Failed to create routine:", error);
        return { message: "Database Error: Failed to create routine." };
    }

    // We don't redirect here because we want to stay on the schedule page to add more items
}

// --- Delete Routine Item Action ---
export async function deleteRoutine(formData: FormData) {
    const id = formData.get("id") as string;

    try {
        const routine = await prisma.classRoutine.findUnique({
            where: { id: parseInt(id) },
        });

        if (!routine) {
            return { message: "Routine not found" };
        }

        await prisma.classRoutine.delete({
            where: { id: parseInt(id) },
        });

        revalidatePath(`/admin/schedule/${routine.classId}`);
    } catch (error) {
        console.log("Error deleting routine:", error);
        return { message: "Failed to delete routine" };
    }
}
// schedule done here

// ... (keep all other actions above) ...

// --- Mark Attendance Action ---
export async function markAttendance(formData: FormData) {
    const classId = formData.get("classId") as string;
    const dateStr = formData.get("date") as string; // Format: "YYYY-MM-DD"

    // Convert the date string to a Date object
    const date = new Date(dateStr);

    try {
        // 1. Get all students in this class to map the form data
        const students = await prisma.student.findMany({
            where: { classId: parseInt(classId) }
        });

        // 2. Loop through each student and find their status in the form
        for (const student of students) {
            // The form will have inputs like name="status_101" where 101 is student ID
            const status = formData.get(`status_${student.id}`) as string;

            if (status) {
                // Check if a record already exists for this day/student
                const existingRecord = await prisma.attendance.findFirst({
                    where: {
                        studentId: student.id,
                        date: date
                    }
                });

                if (existingRecord) {
                    // Update existing
                    await prisma.attendance.update({
                        where: { id: existingRecord.id },
                        data: { status: status as "PRESENT" | "ABSENT" | "LATE" }
                    });
                } else {
                    // Create new
                    await prisma.attendance.create({
                        data: {
                            studentId: student.id,
                            date: date,
                            status: status as "PRESENT" | "ABSENT" | "LATE"
                        }
                    });
                }
            }
        }

        revalidatePath(`/admin/attendance/${classId}`);
        revalidatePath(`/teacher/attendance/${classId}`);
    } catch (error) {
        console.error("Failed to mark attendance:", error);
        return { message: "Failed to mark attendance." };
    }
}

//attendance done here

// ... (keep all other actions above) ...

// --- Create Exam Action (with Zod Validation) ---
export async function createExam(formData: FormData) {
    const name = formData.get("name") as string || "";
    const term = formData.get("term") as string || "";

    // Validate input
    if (!name || name.trim().length < 1) {
        return { message: "Exam name is required" };
    }

    try {
        await prisma.exam.create({
            data: {
                name: name,
                term: term,
            },
        });

        revalidatePath("/admin/exams");
    } catch (error) {
        console.error("Failed to create exam:", error);
        return { message: "Database Error: Failed to create exam." };
    }

    redirect("/admin/exams");
}

// --- Delete Exam Action ---
export async function deleteExam(formData: FormData) {
    const id = formData.get("id") as string;

    try {
        await prisma.exam.delete({
            where: { id: parseInt(id) },
        });

        revalidatePath("/admin/exams");
    } catch (error) {
        console.log("Error deleting exam:", error);
        return { message: "Failed to delete exam" };
    }
}

// ... (keep all other actions above) ...

// --- Update Marks Action ---
// --- Update Exam Marks (Fixed) ---
export async function updateMarks(formData: FormData) {
    const examId = parseInt(formData.get("examId") as string);
    const subjectId = parseInt(formData.get("subjectId") as string);
    const classId = parseInt(formData.get("classId") as string);

    try {
        const rawData = Object.fromEntries(formData.entries());
        const markKeys = Object.keys(rawData).filter((key) => key.startsWith("mark_"));

        for (const key of markKeys) {
            const studentId = parseInt(key.replace("mark_", ""));
            const marksObtainedStr = rawData[key] as string;

            // Skip if empty
            if (marksObtainedStr === "") continue;

            const marksObtained = parseFloat(marksObtainedStr);

            // 1. Check if mark ALREADY exists for this specific student+exam+subject
            const existingMark = await prisma.mark.findFirst({
                where: {
                    examId: examId,
                    subjectId: subjectId,
                    studentId: studentId
                }
            });

            if (existingMark) {
                // 2. UPDATE existing record
                await prisma.mark.update({
                    where: { id: existingMark.id },
                    data: { marksObtained: marksObtained }
                });
            } else {
                // 3. CREATE new record
                await prisma.mark.create({
                    data: {
                        examId,
                        subjectId,
                        studentId,
                        marksObtained,
                        totalMarks: 100 // Default max marks
                    }
                });
            }
        }

        revalidatePath(`/teacher/marks`);
        revalidatePath(`/student/grades`);

    } catch (error) {
        console.log("Error updating marks:", error);
        return { message: "Failed to update marks" };
    }

    redirect("/teacher/marks");
}
// exams done here

// ... (keep all other actions above) ...

// --- Create Parent Action (with Zod Validation) ---
export async function createParent(formData: FormData) {
    const name = formData.get("name") as string || "";
    const surname = formData.get("surname") as string || "";
    const email = formData.get("email") as string || "";
    const phone = formData.get("phone") as string || "";
    const studentIdsStr = formData.getAll("studentIds");

    const fullName = `${name} ${surname}`.trim();

    // Validate input
    if (!fullName || fullName.length < 2) {
        return { message: "Name must be at least 2 characters" };
    }
    if (!email || !email.includes("@")) {
        return { message: "Valid email is required" };
    }
    if (!phone) {
        return { message: "Phone number is required" };
    }

    try {
        // 1. Create User Account
        const newUser = await prisma.user.create({
            data: {
                clerkId: `parent_entry_${Date.now()}`,
                email: email,
                fullName: fullName,
                role: "PARENT",
            },
        });

        // 2. Create Parent Profile
        await prisma.parent.create({
            data: {
                userId: newUser.id,
                fullName: fullName,
                phone: phone, // Make sure your Prisma schema has 'phone' in Parent model, or remove this line
            },
        });

        revalidatePath("/admin/parents");
    } catch (error) {
        console.error("Failed to create parent:", error);
        return { message: "Database Error: Failed to create parent." };
    }

    redirect("/admin/parents");
}

// --- Delete Parent Action ---
export async function deleteParent(formData: FormData) {
    const id = formData.get("id") as string;

    try {
        const parent = await prisma.parent.findUnique({
            where: { id: parseInt(id) },
            include: { user: true }
        });

        if (parent && parent.user) {
            await prisma.user.delete({ where: { id: parent.user.id } });
        } else if (parent) {
            await prisma.parent.delete({ where: { id: parseInt(id) } });
        }

        revalidatePath("/admin/parents");
    } catch (error) {
        console.log("Error deleting parent:", error);
        return { message: "Failed to delete parent" };
    }
}

