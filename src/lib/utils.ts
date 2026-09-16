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
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
        dotColor: "bg-blue-500",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        dotColor: "bg-amber-500",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        dotColor: "bg-emerald-500",
      };
    default:
      return {
        label: status,
        badgeColor: "bg-gray-50 text-gray-700 border-gray-200",
        dotColor: "bg-gray-500",
      };
  }
}
