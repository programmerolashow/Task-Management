import { PrismaClient, Task } from "@prisma/client";
import { TaskStatus } from "@/types/task";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  mockMemoryDb: Map<string, Task> | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString && connectionString.includes("neon.tech")) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Memory database fallback for zero-dependency local testing when DB connection is unconfigured
const memoryDb = globalForPrisma.mockMemoryDb ?? new Map<string, Task>();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.mockMemoryDb = memoryDb;
}

let idCounter = 1;

export const db = {
  task: {
    async findMany(args?: any): Promise<Task[]> {
      try {
        return await prisma.task.findMany(args);
      } catch (error) {
        console.warn("Database error or missing connection string, using fallback store:", (error as Error).message);
        let tasks = Array.from(memoryDb.values());

        if (args?.where) {
          if (args.where.status) {
            tasks = tasks.filter((t) => t.status === args.where?.status);
          }
          if (args.where.OR && args.where.OR.length > 0) {
            const searchTerms: string[] = args.where.OR.map((or: any) => String(or.title?.contains || or.description?.contains || "").toLowerCase()).filter(Boolean);
            if (searchTerms.length > 0) {
              tasks = tasks.filter((t) =>
                searchTerms.some(
                  (term: string) => t.title.toLowerCase().includes(term) || (t.description && t.description.toLowerCase().includes(term))
                )
              );
            }
          }
        }

        if (args?.orderBy) {
          const field = Object.keys(args.orderBy)[0] as keyof Task;
          const order = args.orderBy[field];
          tasks.sort((a, b) => {
            const valA = a[field] ?? "";
            const valB = b[field] ?? "";
            if (valA < valB) return order === "asc" ? -1 : 1;
            if (valA > valB) return order === "asc" ? 1 : -1;
            return 0;
          });
        }

        return tasks;
      }
    },

    async findUnique(args: { where: { id: string } }): Promise<Task | null> {
      try {
        return await prisma.task.findUnique(args);
      } catch {
        return memoryDb.get(args.where.id) || null;
      }
    },

    async create(args: { data: { title: string; description?: string | null; status?: TaskStatus; dueDate: Date } }): Promise<Task> {
      try {
        return await prisma.task.create(args);
      } catch {
        const id = `cm${Date.now()}${idCounter++}`;
        const now = new Date();
        const newTask: Task = {
          id,
          title: args.data.title,
          description: args.data.description ?? null,
          status: args.data.status ?? "TODO",
          dueDate: new Date(args.data.dueDate),
          createdAt: now,
          updatedAt: now,
        };
        memoryDb.set(id, newTask);
        return newTask;
      }
    },

    async update(args: {
      where: { id: string };
      data: { title?: string; description?: string | null; status?: TaskStatus; dueDate?: Date };
    }): Promise<Task> {
      try {
        return await prisma.task.update(args);
      } catch {
        const existing = memoryDb.get(args.where.id);
        if (!existing) {
          throw new Error("Task not found");
        }
        const updatedTask: Task = {
          ...existing,
          ...args.data,
          dueDate: args.data.dueDate ? new Date(args.data.dueDate) : existing.dueDate,
          updatedAt: new Date(),
        };
        memoryDb.set(args.where.id, updatedTask);
        return updatedTask;
      }
    },

    async delete(args: { where: { id: string } }): Promise<Task> {
      try {
        return await prisma.task.delete(args);
      } catch {
        const existing = memoryDb.get(args.where.id);
        if (!existing) {
          throw new Error("Task not found");
        }
        memoryDb.delete(args.where.id);
        return existing;
      }
    },
  },
};
