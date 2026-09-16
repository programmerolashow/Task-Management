"use client";

import React from "react";
import { Task, TaskStatus } from "@/types/task";
import { formatDate, getStatusInfo, isOverdue } from "@/lib/utils";
import { Calendar, Eye, Edit3, Trash2, AlertCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const statusInfo = getStatusInfo(task.status);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="flex flex-col justify-between p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        {/* Header: Status badge & Overdue tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="relative inline-block">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className={`px-3 py-1 text-xs font-extrabold rounded-full border cursor-pointer appearance-none pr-7 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs transition-colors !text-blue-950 ${statusInfo.badgeColor}`}
            >
              <option value="TODO" className="bg-white text-blue-950 font-bold">
                To Do
              </option>
              <option value="IN_PROGRESS" className="bg-white text-amber-950 font-bold">
                In Progress
              </option>
              <option value="COMPLETED" className="bg-white text-emerald-950 font-bold">
                Completed
              </option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-blue-950">
              ▼
            </span>
          </div>

          {overdue && (
            <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <AlertCircle className="w-3.5 h-3.5" />
              Overdue
            </span>
          )}
        </div>

        {/* Task Title */}
        <h3
          onClick={() => onView(task)}
          className={`font-semibold text-slate-900 dark:text-slate-100 text-base mb-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 ${
            task.status === "COMPLETED" ? "line-through text-slate-500 dark:text-slate-400" : ""
          }`}
        >
          {task.title}
        </h3>

        {/* Task Description Preview */}
        {task.description ? (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
            {task.description}
          </p>
        ) : (
          <p className="text-sm text-slate-400 dark:text-slate-500 italic mb-4">
            No description provided.
          </p>
        )}
      </div>

      {/* Footer: Due date & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className={`w-3.5 h-3.5 ${overdue ? "text-rose-500" : "text-slate-400"}`} />
          <span className={overdue ? "text-rose-600 font-semibold" : ""}>
            {formatDate(task.dueDate)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(task)}
            title="View Details"
            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete Task"
            className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
