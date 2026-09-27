"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProjectCard, { ProjectSummary } from "@/components/ProjectCard";
import { Plus, Search, Filter, Loader2, Sparkles, FolderOpen } from "lucide-react";
import Link from "next/link";

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search query, room type, and style
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.roomType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.style?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoom =
      selectedRoom === "all" || project.roomType === selectedRoom;

    const matchesStyle =
      selectedStyle === "all" || project.style === selectedStyle;

    return matchesSearch && matchesRoom && matchesStyle;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 selection:bg-amber-600 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200/80">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-700 mb-1">
              Studio Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-stone-950">
              Interior Design Projects
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Browse and manage your active client spaces, SDXL moodboards, CAD layouts, and Flux renders.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-stone-950 hover:bg-stone-850 text-white text-xs font-mono uppercase tracking-wider rounded-2xl transition shadow-md self-start sm:self-auto font-medium"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>New Project Brief</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, room, or aesthetic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden md:inline">Filters:</span>
            </div>

            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs focus:outline-none focus:border-amber-600 transition cursor-pointer"
            >
              <option value="all">All Rooms</option>
              <option value="living-room">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="bathroom">Bathroom</option>
              <option value="dining-room">Dining Room</option>
              <option value="home-office">Home Office</option>
              <option value="other">Other</option>
            </select>

            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs focus:outline-none focus:border-amber-600 transition cursor-pointer"
            >
              <option value="all">All Styles</option>
              <option value="minimalist">Minimalist</option>
              <option value="scandinavian">Scandinavian</option>
              <option value="industrial">Industrial</option>
              <option value="boho">Boho</option>
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Content State: Loading, Empty, or Projects Grid */}
        {loading ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-3" />
            <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Loading Studio Projects...
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-stone-200 bg-white/70 p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-medium text-stone-900 mb-1">
              {searchQuery || selectedRoom !== "all" || selectedStyle !== "all"
                ? "No matching projects found"
                : "No projects in your studio yet"}
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
              {searchQuery || selectedRoom !== "all" || selectedStyle !== "all"
                ? "Try adjusting your search criteria or resetting filters."
                : "Start your first client interior brief to generate AI moodboards and photorealistic renders."}
            </p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-950 hover:bg-stone-850 text-white text-xs font-mono uppercase tracking-wider rounded-xl transition shadow-sm font-medium"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Create First Project
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
