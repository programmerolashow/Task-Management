"use client";

import React from "react";
import { Search, ArrowUpDown, Plus } from "lucide-react";
import { TaskSortBy, SortOrder } from "@/types/task";

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sortBy: TaskSortBy;
  onSortByChange: (sortBy: TaskSortBy) => void;
  sortOrder: SortOrder;
  onSortOrderToggle: () => void;
  onOpenCreateModal: () => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  onOpenCreateModal,
}) => {
  const statusOptions = [
    { value: "ALL", label: "All Tasks" },
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-6 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Controls Container */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === opt.value
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as TaskSortBy)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={onSortOrderToggle}
            title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Create Task Button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
};
