import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations/task";
import { TaskStatus } from "@/types/task";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    // Build filter conditions
    const where: {
      status?: TaskStatus;
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (statusParam && statusParam !== "ALL" && ["TODO", "IN_PROGRESS", "COMPLETED"].includes(statusParam)) {
      where.status = statusParam as TaskStatus;
    }

    if (searchParam && searchParam.trim()) {
      const trimmed = searchParam.trim();
      where.OR = [
        { title: { contains: trimmed, mode: "insensitive" } },
        { description: { contains: trimmed, mode: "insensitive" } },
      ];
    }

    // Build ordering condition
    const validSortFields = ["dueDate", "createdAt", "title"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const orderBy = { [sortField]: sortOrder };

    const tasks = await db.task.findMany({
      where,
      orderBy,
    });

    // Calculate stats across all tasks
    const allTasks = await db.task.findMany({});
    const now = new Date();

    const stats = {
      total: allTasks.length,
      todo: allTasks.filter((t) => t.status === "TODO").length,
      inProgress: allTasks.filter((t) => t.status === "IN_PROGRESS").length,
      completed: allTasks.filter((t) => t.status === "COMPLETED").length,
      overdue: allTasks.filter(
        (t) => t.status !== "COMPLETED" && new Date(t.dueDate) < now
      ).length,
    };

    return NextResponse.json({
      success: true,
      data: tasks,
      stats,
    });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    const task = await db.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status as TaskStatus,
        dueDate: new Date(validatedData.dueDate),
      },
    });

    return NextResponse.json(
      { success: true, data: task },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".") || "form";
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 500 }
    );
  }
}
