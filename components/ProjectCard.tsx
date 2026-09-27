import React from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { ArrowUpRight, Compass, Home, Calendar } from "lucide-react";

export interface ProjectSummary {
  id: string;
  clientName: string;
  roomType: string;
  style: string;
  status: string;
  thumbnail: string | null;
  createdAt: string | Date;
}

interface ProjectCardProps {
  project: ProjectSummary;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const formattedRoom = project.roomType?.replace("-", " ") || "Interior Space";
  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-amber-300/60 dark:hover:border-amber-700/60 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Header Media */}
        <div className="relative aspect-[16/10] w-full bg-stone-100 dark:bg-stone-850 overflow-hidden">
          {project.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnail}
              alt={project.clientName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-400 dark:text-stone-600 bg-gradient-to-br from-stone-50 to-stone-150 dark:from-stone-900 dark:to-stone-950">
              <Compass className="w-10 h-10 mb-2 stroke-[1.2] text-amber-600/40" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Awaiting Visualization
              </span>
            </div>
          )}

          {/* Floating Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            <StatusBadge status={project.status} size="sm" />
          </div>

          {/* Top Right Quick Action Indicator */}
          <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md capitalize">
              <Home className="w-3 h-3" />
              {formattedRoom}
            </span>
            <span className="text-xs text-stone-400 capitalize">
              • {project.style}
            </span>
          </div>

          <h3 className="text-lg font-serif font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {project.clientName}
          </h3>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs text-stone-400 dark:text-stone-500 border-t border-stone-100 dark:border-stone-850 pt-3">
        <span className="flex items-center gap-1 text-[11px] font-mono">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>
        <span className="text-xs font-medium text-stone-700 dark:text-stone-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
          Open Studio <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
