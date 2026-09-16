"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/types/task";
import { formatDateForInput } from "@/lib/utils";
import { X, Calendar, AlignLeft, Tag, Type } from "lucide-react";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
  }) => Promise<boolean>;
  initialData?: Task | null;
  titleText: string;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  titleText,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setStatus(initialData.status);
      setDueDate(formatDateForInput(initialData.dueDate));
    } else {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      // Default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(formatDateForInput(tomorrow));
    }
    setFieldErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validateLocal = (): boolean => {
    const errors: Record<string, string> = {};
    if (!title.trim()) {
      errors.title = "Title is required";
    } else if (title.trim().length > 200) {
      errors.title = "Title must be 200 characters or fewer";
    }

    if (description && description.length > 2000) {
      errors.description = "Description must be 2000 characters or fewer";
    }

    if (!dueDate) {
      errors.dueDate = "Due date is required";
    } else if (isNaN(Date.parse(dueDate))) {
      errors.dueDate = "Please enter a valid date";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLocal()) return;

    setIsSubmitting(true);
    const success = await onSubmit({
      title,
      description,
      status,
      dueDate,
    });
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {titleText}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Field */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) {
                  setFieldErrors((prev) => ({ ...prev, title: "" }));
                }
              }}
              placeholder="Task title (e.g. Prepare Q4 Financial Report)"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.title
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {fieldErrors.title}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-500" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description) {
                  setFieldErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              rows={3}
              placeholder="Add detailed task notes, instructions, or subtasks..."
              className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.description
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Status & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Selection */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Due Date Input */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (fieldErrors.dueDate) {
                    setFieldErrors((prev) => ({ ...prev, dueDate: "" }));
                  }
                }}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                  fieldErrors.dueDate
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              />
              {fieldErrors.dueDate && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {fieldErrors.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer / Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
