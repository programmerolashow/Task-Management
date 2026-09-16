"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Task, TaskStats, TaskStatus, TaskSortBy, SortOrder } from "@/types/task";
import { TaskStatsWidget } from "@/components/TaskStats";
import { TaskFilterBar } from "@/components/TaskFilterBar";
import { TaskCard } from "@/components/TaskCard";
import { TaskFormModal } from "@/components/TaskFormModal";
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Toast, ToastMessage } from "@/components/Toast";
import { CheckSquare, Plus, Loader2, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<TaskSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    const id = Date.now().toString();
    setToast({ id, type, text });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") {
        if (statusFilter === "OVERDUE") {
          // Will filter overdue on frontend or handle via status
        } else {
          params.append("status", statusFilter);
        }
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        let fetchedTasks: Task[] = data.data;
        if (statusFilter === "OVERDUE") {
          const now = new Date();
          fetchedTasks = fetchedTasks.filter(
            (t) => t.status !== "COMPLETED" && new Date(t.dueDate) < now
          );
        }
        setTasks(fetchedTasks);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        showToast("error", data.error || "Failed to load tasks");
      }
    } catch {
      showToast("error", "Network error when loading tasks");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (formData: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        showToast("success", "Task created successfully!");
        fetchTasks();
        return true;
      } else {
        const errMessage = data.details
          ? Object.values(data.details).flat().join(", ")
          : data.error || "Failed to create task";
        showToast("error", errMessage);
        return false;
      }
    } catch {
      showToast("error", "Failed to create task due to a server error");
      return false;
    }
  };

  const handleUpdateTask = async (formData: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
  }): Promise<boolean> => {
    if (!editingTask) return false;

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        showToast("success", "Task updated successfully!");
        fetchTasks();
        setEditingTask(null);
        return true;
      } else {
        const errMessage = data.details
          ? Object.values(data.details).flat().join(", ")
          : data.error || "Failed to update task";
        showToast("error", errMessage);
        return false;
      }
    } catch {
      showToast("error", "Failed to update task due to a server error");
      return false;
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        showToast("success", `Status changed to ${newStatus.replace("_", " ")}`);
        fetchTasks();
      } else {
        showToast("error", data.error || "Failed to update status");
      }
    } catch {
      showToast("error", "Failed to update status");
    }
  };

  const handleDeleteTask = async (taskId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showToast("success", "Task deleted successfully");
        fetchTasks();
        setDeletingTask(null);
        return true;
      } else {
        showToast("error", data.error || "Failed to delete task");
        return false;
      }
    } catch {
      showToast("error", "Failed to delete task");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Navbar Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                TaskManager
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                TypeScript & Prisma App
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTasks}
              title="Refresh tasks"
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsFormModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <TaskStatsWidget
          stats={stats}
          activeFilter={statusFilter}
          onFilterChange={(status) => setStatusFilter(status)}
        />

        {/* Filter and Search Bar */}
        <TaskFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderToggle={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          onOpenCreateModal={() => {
            setEditingTask(null);
            setIsFormModalOpen(true);
          }}
        />

        {/* Task List Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading tasks...
            </p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-4">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
              No tasks found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              {searchQuery
                ? `No tasks matched "${searchQuery}". Try changing your search query or clear the filter.`
                : statusFilter !== "ALL"
                ? `No tasks found in status "${statusFilter}".`
                : "You don't have any tasks yet. Create your first task to get started!"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setEditingTask(null);
                setIsFormModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={(t) => setViewingTask(t)}
                onEdit={(t) => {
                  setEditingTask(t);
                  setIsFormModalOpen(true);
                }}
                onDelete={(t) => setDeletingTask(t)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
        titleText={editingTask ? "Edit Task" : "Create New Task"}
      />

      <TaskDetailModal
        task={viewingTask}
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        onEdit={(t) => {
          setEditingTask(t);
          setIsFormModalOpen(true);
        }}
        onDelete={(t) => setDeletingTask(t)}
      />

      <DeleteConfirmModal
        task={deletingTask}
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
