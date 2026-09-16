"use client";

import React from "react";
import { Task } from "@/types/task";
import { formatDate, formatDateTime, getStatusInfo, isOverdue } from "@/lib/utils";
import { X, Calendar, Clock, Edit3, Trash2, AlertCircle } from "lucide-react";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !task) return null;

  const statusInfo = getStatusInfo(task.status);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusInfo.badgeColor}`}
            >
              {statusInfo.label}
            </span>
            {overdue && (
              <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-3.5 h-3.5" />
                Overdue
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {task.title}
            </h2>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Description
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {task.description || "No description provided for this task."}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                  Due Date
                </span>
                <span className={overdue ? "text-rose-600 font-semibold" : "font-medium"}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                  Created Date
                </span>
                <span className="font-medium">{formatDateTime(task.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Edit3 className="w-4 h-4" />
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
