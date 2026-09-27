import React from "react";
import { ProjectStatus } from "@/models/Project";

interface StatusBadgeProps {
  status: ProjectStatus | string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "moodboard-generated":
        return {
          label: "Moodboard Ready",
          classes: "bg-amber-500/10 text-amber-700 border-amber-200/60 dark:text-amber-300 dark:border-amber-800/40",
          dotColor: "bg-amber-500",
        };
      case "layout-uploaded":
        return {
          label: "CAD Layout Attached",
          classes: "bg-blue-500/10 text-blue-700 border-blue-200/60 dark:text-blue-300 dark:border-blue-800/40",
          dotColor: "bg-blue-500",
        };
      case "render-generated":
        return {
          label: "Photorealistic Rendered",
          classes: "bg-emerald-500/10 text-emerald-700 border-emerald-200/60 dark:text-emerald-300 dark:border-emerald-800/40",
          dotColor: "bg-emerald-500",
        };
      case "complete":
        return {
          label: "Design Package Complete",
          classes: "bg-purple-500/10 text-purple-700 border-purple-200/60 dark:text-purple-300 dark:border-purple-800/40",
          dotColor: "bg-purple-500",
        };
      case "draft":
      default:
        return {
          label: "Draft Project",
          classes: "bg-stone-500/10 text-stone-600 border-stone-200/60 dark:text-stone-400 dark:border-stone-800/40",
          dotColor: "bg-stone-400",
        };
    }
  };

  const config = getStatusConfig();
  const paddingClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide uppercase font-mono ${paddingClass} ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
      {config.label}
    </span>
  );
}
