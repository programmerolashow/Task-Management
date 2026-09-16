import { db } from "../src/lib/prisma";
import { createTaskSchema, updateTaskSchema } from "../src/lib/validations/task";

async function runVerificationTests() {
  console.log("=== Task Management API & Logic Verification Suite ===");
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failedCount++;
    }
  }

  // 1. Test Task Creation Schema Validation (Requirement 1 & Error Handling)
  console.log("\n--- 1. Testing Input Validation ---");
  const invalidResult = createTaskSchema.safeParse({ title: "", dueDate: "invalid-date" });
  assert(!invalidResult.success, "Validation correctly rejects empty title and invalid date");

  const validResult = createTaskSchema.safeParse({
    title: "Verify API endpoints",
    description: "Automated test description",
    status: "TODO",
    dueDate: "2026-10-15",
  });
  assert(validResult.success, "Validation accepts valid task data");

  // 2. Test Task Creation DB Operation (Requirement 1: Create a task)
  console.log("\n--- 2. Testing Task Creation ---");
  const newTask = await db.task.create({
    data: {
      title: "Integration Test Task",
      description: "Testing DB persistence and retrieval",
      status: "TODO",
      dueDate: new Date("2026-10-20"),
    },
  });
  assert(!!newTask.id, "Created task has valid ID");
  assert(newTask.title === "Integration Test Task", "Created task title matches input");

  // 3. Test View List of Tasks (Requirement 2: View list of tasks)
  console.log("\n--- 3. Testing List Tasks ---");
  const tasks = await db.task.findMany({});
  assert(Array.isArray(tasks) && tasks.length >= 1, "findMany returns array containing created task");

  // 4. Test View Single Task (Requirement 3: View an individual task)
  console.log("\n--- 4. Testing View Single Task ---");
  const singleTask = await db.task.findUnique({ where: { id: newTask.id } });
  assert(singleTask?.id === newTask.id, "findUnique retrieves exact individual task by ID");

  // 5. Test Update Task (Requirement 4: Update a task)
  console.log("\n--- 5. Testing Update Task ---");
  const updatedTask = await db.task.update({
    where: { id: newTask.id },
    data: {
      status: "IN_PROGRESS",
      title: "Updated Integration Test Task",
    },
  });
  assert(updatedTask.status === "IN_PROGRESS", "Task status correctly updated to IN_PROGRESS");
  assert(updatedTask.title === "Updated Integration Test Task", "Task title correctly updated");

  // 6. Test Delete Task (Requirement 5: Delete a task)
  console.log("\n--- 6. Testing Delete Task ---");
  await db.task.delete({ where: { id: newTask.id } });
  const deletedCheck = await db.task.findUnique({ where: { id: newTask.id } });
  assert(deletedCheck === null, "Task successfully deleted from database");

  console.log(`\n===================================`);
  console.log(`Summary: ${passedCount} Passed, ${failedCount} Failed`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runVerificationTests().catch((err) => {
  console.error("Verification suite encountered an error:", err);
  process.exit(1);
});
