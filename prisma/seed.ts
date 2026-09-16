import { db } from "../src/lib/prisma";

async function main() {
  console.log("Seeding sample tasks...");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await db.task.create({
    data: {
      title: "Set up PostgreSQL database on NeonDB",
      description: "Configure environment variables DATABASE_URL and DIRECT_URL in .env file.",
      status: "COMPLETED",
      dueDate: yesterday,
    },
  });

  await db.task.create({
    data: {
      title: "Build Next.js App Router Task UI",
      description: "Implement responsive task dashboard with search, status filters, and sorting controls.",
      status: "IN_PROGRESS",
      dueDate: tomorrow,
    },
  });

  await db.task.create({
    data: {
      title: "Write comprehensive unit & API integration tests",
      description: "Ensure all CRUD operations and Zod validation errors return appropriate HTTP status codes.",
      status: "TODO",
      dueDate: nextWeek,
    },
  });

  console.log("Seeding complete!");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
});
