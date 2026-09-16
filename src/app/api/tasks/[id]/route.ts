import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations/task";
import { TaskStatus } from "@/types/task";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await db.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("GET /api/tasks/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingTask = await db.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    const updateData: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      dueDate?: Date;
    } = {};

    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.status !== undefined) updateData.status = validatedData.status as TaskStatus;
    if (validatedData.dueDate !== undefined) updateData.dueDate = new Date(validatedData.dueDate);

    const updatedTask = await db.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedTask,
    });
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

    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingTask = await db.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    await db.task.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
