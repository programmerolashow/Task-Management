export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export type TaskSortBy = "dueDate" | "createdAt" | "title";
export type SortOrder = "asc" | "desc";

export interface TaskQueryParams {
  status?: TaskStatus | "ALL";
  search?: string;
  sortBy?: TaskSortBy;
  sortOrder?: SortOrder;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}
