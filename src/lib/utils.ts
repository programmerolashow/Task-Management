import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskStatus } from "@/types/task";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDateForInput(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isOverdue(dueDateInput: Date | string, status: TaskStatus): boolean {
  if (status === "COMPLETED") return false;
  const dueDate = typeof dueDateInput === "string" ? new Date(dueDateInput) : dueDateInput;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

export function getStatusInfo(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return {
        label: "To Do",
        badgeColor: "bg-blue-100 text-blue-950 border-blue-300 dark:bg-blue-100 dark:text-blue-950 dark:border-blue-300",
        dotColor: "bg-blue-600",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        badgeColor: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-100 dark:text-amber-950 dark:border-amber-300",
        dotColor: "bg-amber-600",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-100 dark:text-emerald-950 dark:border-emerald-300",
        dotColor: "bg-emerald-600",
      };
    default:
      return {
        label: status,
        badgeColor: "bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-300",
        dotColor: "bg-slate-600",
      };
  }
}
