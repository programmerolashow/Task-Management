# Task Management Application

A modern, responsive, full-stack Task Management Application built with **TypeScript**, **Next.js 15 (App Router)**, **Prisma ORM**, **PostgreSQL (NeonDB)**, **Tailwind CSS**, and **Zod**.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: PostgreSQL / [NeonDB](https://neon.tech/) via [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Styling & UI**: Tailwind CSS, Lucide React Icons

---

## ✨ Core Features

1. **Create Task**: Create tasks with title, description, status (`To Do`, `In Progress`, `Completed`), and due date with instant validation feedback.
2. **View Task List**: Dashboard with search input, status tabs (`All`, `To Do`, `In Progress`, `Completed`, `Overdue`), sorting controls (`Due Date`, `Created Date`, `Title`), and summary status counts.
3. **View Individual Task**: Detailed view modal showing full description, overdue warnings, status badges, and formatted dates.
4. **Update Task**: Quick status switcher directly on task cards + full edit modal.
5. **Delete Task**: Confirmation modal dialog to prevent accidental deletion.

---

## ⚙️ Environment & Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# PostgreSQL / NeonDB connection strings
# Example NeonDB URL: postgresql://user:password@ep-cool-pool-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
DATABASE_URL="postgresql://user:password@ep-cool-pool-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-cool-pool-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

---

## 🚀 Instructions for Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Push Database Schema
```bash
npx neon@latest init
npx prisma generate
npx prisma db push
```

### 3. Seed Sample Data (Optional)
```bash
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Verification & API Integration Tests
```bash
npm run test:api
```

### 6. Production Build
```bash
npm run build
npm start
```

---

## 💡 Key Architectural & Technical Decisions

1. **Next.js App Router**: Provides both REST API endpoints (`/api/tasks`, `/api/tasks/[id]`) and React server/client components within a single TypeScript project.
2. **Prisma ORM + NeonDB Adapter**: Uses `@prisma/adapter-neon` and `@neondatabase/serverless` for serverless pooled database connections to NeonDB PostgreSQL.
3. **Resilient Fallback Data Layer**: `src/lib/prisma.ts` includes a fallback memory layer so the application and test suites run seamlessly out of the box even before external database credentials are configured.
4. **Zod Validation**: Shared Zod schemas (`src/lib/validations/task.ts`) enforce string lengths, required fields, date formats, and status enum constraints both on client forms and backend API routes.

---

## 📋 Assumptions Made

- **Date Handling**: Due dates are selected in local user timezone and stored as ISO 8601 UTC timestamps.
- **Task Statuses**: Tasks are categorized into `TODO` ("To Do"), `IN_PROGRESS` ("In Progress"), and `COMPLETED` ("Completed").
- **Overdue Definition**: Tasks are flagged as overdue if the due date precedes today's date and the status is not `COMPLETED`.
