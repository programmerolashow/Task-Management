"use client";

import React from "react";
import { TaskStats } from "@/types/task";
import { CheckCircle2, Clock, AlertTriangle, ListTodo, PlayCircle } from "lucide-react";

interface TaskStatsProps {
  stats: TaskStats;
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

export const TaskStatsWidget: React.FC<TaskStatsProps> = ({
  stats,
  activeFilter,
  onFilterChange,
}) => {
  const cards = [
    {
      id: "ALL",
      label: "Total Tasks",
      count: stats.total,
      icon: ListTodo,
      color: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800",
      activeBorder: "border-slate-500",
    },
    {
      id: "TODO",
      label: "To Do",
      count: stats.todo,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50",
      activeBorder: "border-blue-500",
    },
    {
      id: "IN_PROGRESS",
      label: "In Progress",
      count: stats.inProgress,
      icon: PlayCircle,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50",
      activeBorder: "border-amber-500",
    },
    {
      id: "COMPLETED",
      label: "Completed",
      count: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50",
      activeBorder: "border-emerald-500",
    },
    {
      id: "OVERDUE",
      label: "Overdue",
      count: stats.overdue,
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50",
      activeBorder: "border-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onFilterChange(card.id)}
            className={`flex flex-col p-4 rounded-xl border text-left transition-all duration-150 bg-white dark:bg-slate-900 ${
              isActive
                ? `ring-2 ring-indigo-500 border-indigo-500 shadow-sm`
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {card.count}
            </div>
          </button>
        );
      })}
    </div>
  );
};
