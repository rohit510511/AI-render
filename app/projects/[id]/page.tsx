"use client";

import React, { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import ImageGallery from "@/components/ImageGallery";
import LayoutUploader from "@/components/LayoutUploader";
import GenerationLoader from "@/components/GenerationLoader";
import { IProjectDocument } from "@/models/Project";
import {
  Sparkles,
  Layers,
  FileCode,
  Image as ImageIcon,
  Calendar,
  Home,
  Palette,
  DollarSign,
  FileText,
  RefreshCw,
  AlertCircle,
  Loader2,
  ChevronRight,
  Info
} from "lucide-react";
import Link from "next/link";

interface DashboardPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDashboardPage({ params }: DashboardPageProps) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<IProjectDocument | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [activeTab, setActiveTab] = useState<"moodboard" | "layout" | "render">("moodboard");

  // AI Generation States
  const [isGeneratingMoodboard, setIsGeneratingMoodboard] = useState(false);
  const [isGeneratingRender, setIsGeneratingRender] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Custom prompt override drawers (optional power feature for designers)
  const [customMoodboardPrompt, setCustomMoodboardPrompt] = useState("");
  const [customRenderPrompt, setCustomRenderPrompt] = useState("");
  const [showPromptEditor, setShowPromptEditor] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoadingProject(true);
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else {
        const err = await res.json();
        setGenerationError(err.error || "Failed to load project details");
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError("Network error while loading project.");
    } finally {
      setLoadingProject(false);
    }
  };

  // Generate Moodboard via SDXL (POST /api/projects/[id]/generate-moodboard)
  const handleGenerateMoodboard = async () => {
    setGenerationError(null);
    setIsGeneratingMoodboard(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/generate-moodboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customPrompt: customMoodboardPrompt.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate moodboard");
      }

      // Update project state with new moodboard image
      if (data.project) {
        setProject(data.project);
      } else {
        await fetchProjectDetails();
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Failed to generate moodboard.");
    } finally {
      setIsGeneratingMoodboard(false);
    }
  };

  // Generate Photorealistic Render via Flux (POST /api/projects/[id]/generate-render)
  const handleGenerateRender = async () => {
    setGenerationError(null);
    setIsGeneratingRender(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/generate-render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customPrompt: customRenderPrompt.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate render");
      }

      // Update project state with new render image
      if (data.project) {
        setProject(data.project);
      } else {
        await fetchProjectDetails();
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Failed to generate render.");
    } finally {
      setIsGeneratingRender(false);
    }
  };

  // Callback when layout file is uploaded
  const handleLayoutUploadSuccess = (url: string, fileName: string) => {
    if (project) {
      setProject({
        ...project,
        layoutFileUrl: url,
        layoutFileName: fileName,
        status: project.status === "draft" ? "layout-uploaded" : project.status,
      } as IProjectDocument);
    }
  };

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-3" />
          <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
            Loading Studio Project...
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-medium text-stone-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            The requested design project does not exist or you do not have permission to view it.
          </p>
          <Link
            href="/projects"
            className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-mono uppercase tracking-wider"
          >
            ← Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  const roomDisplayName = project.roomType ? project.roomType.replace("-", " ") : "Space";

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 selection:bg-amber-600 selection:text-white flex flex-col font-sans">
      <Navbar />

      {/* Floating Generation Progress Overlay when active */}
      {isGeneratingMoodboard && <GenerationLoader model="sdxl" />}
      {isGeneratingRender && <GenerationLoader model="flux-schnell" />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 mb-4">
          <Link href="/projects" className="hover:text-stone-900 transition">
            Projects
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-amber-800 font-medium truncate max-w-xs">
            {project.clientName}
          </span>
        </div>

        {/* Project Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-stone-100">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                <StatusBadge status={project.status} />
                <span className="text-xs font-mono font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full capitalize">
                  {roomDisplayName}
                </span>
                <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full capitalize">
                  {project.style}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-stone-950">
                {project.clientName}
              </h1>

              {project.notes && (
                <p className="text-xs text-stone-600 mt-2 max-w-2xl font-sans leading-relaxed">
                  {project.notes}
                </p>
              )}
            </div>

            {/* Quick Specs Pill Badges */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 text-xs text-stone-600 font-mono self-start">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200">
                <Palette className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate max-w-[220px]">
                  {project.colorPalette || "Neutral Palette"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="capitalize">{project.budgetRange || "Medium"} Budget Tier</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-stone-100 border border-stone-200/80">
              {/* Tab 1: Moodboard */}
              <button
                onClick={() => setActiveTab("moodboard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition ${
                  activeTab === "moodboard"
                    ? "bg-white text-stone-950 font-semibold shadow-sm"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Moodboard</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/70 text-stone-700">
                  {project.moodboardImages?.length || 0}
                </span>
              </button>

              {/* Tab 2: Layout Reference */}
              <button
                onClick={() => setActiveTab("layout")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition ${
                  activeTab === "layout"
                    ? "bg-white text-stone-950 font-semibold shadow-sm"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-blue-600" />
                <span>Layout CAD</span>
                {project.layoutFileUrl && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>

              {/* Tab 3: Final Photoreal Render */}
              <button
                onClick={() => setActiveTab("render")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition ${
                  activeTab === "render"
                    ? "bg-white text-stone-950 font-semibold shadow-sm"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Final Render</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/70 text-stone-700">
                  {project.renderImages?.length || 0}
                </span>
              </button>
            </div>

            {/* Quick Generator Trigger from Tab Bar */}
            {activeTab === "moodboard" && (
              <button
                onClick={handleGenerateMoodboard}
                disabled={isGeneratingMoodboard}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-950 hover:bg-stone-850 text-white rounded-xl text-xs font-mono uppercase tracking-wider transition shadow-sm font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isGeneratingMoodboard ? "animate-spin" : ""}`} />
                <span>
                  {project.moodboardImages?.length > 0 ? "Regenerate Moodboard" : "Generate SDXL Moodboard"}
                </span>
              </button>
            )}

            {activeTab === "render" && (
              <button
                onClick={handleGenerateRender}
                disabled={isGeneratingRender}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-mono uppercase tracking-wider transition shadow-sm font-medium disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>
                  {project.renderImages?.length > 0 ? "Generate Another Render" : "Synthesize Flux Render"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Global Error Banner */}
        {generationError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between gap-3 text-red-800 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{generationError}</span>
            </div>
            <button
              onClick={() => setGenerationError(null)}
              className="text-stone-400 hover:text-stone-600 text-xs uppercase font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* =========================================================
            TAB 1: MOODBOARD (SDXL)
           ========================================================= */}
        {activeTab === "moodboard" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-100/70 border border-stone-200/80">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Phase 1: Material &amp; Concept Moodboard (SDXL 1.0)
                </div>
                <p className="text-xs text-stone-600">
                  Synthesizes tactile material palettes, fabric swatches, wood finishes, and lighting mood.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromptEditor(!showPromptEditor)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-mono uppercase tracking-wider hover:bg-stone-50 transition"
                >
                  {showPromptEditor ? "Hide Prompt Editor" : "Refine Prompt"}
                </button>
              </div>
            </div>

            {/* Optional Prompt Editor Drawer */}
            {showPromptEditor && (
              <div className="p-5 rounded-2xl bg-white border border-amber-300/60 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
                    Custom Prompt Adjustment (Optional)
                  </label>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Leave blank to use default architectural template
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={customMoodboardPrompt}
                  onChange={(e) => setCustomMoodboardPrompt(e.target.value)}
                  placeholder="Override or supplement the automated prompt with specific requests, e.g. Add fluted oak wall paneling and Carrara marble accents..."
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-amber-600 transition font-sans"
                />
              </div>
            )}

            {/* Moodboard Image Gallery */}
            <ImageGallery
              images={project.moodboardImages || []}
              isLoading={isGeneratingMoodboard}
              loadingMessage="Synthesizing architectural material collage via SDXL..."
              onGenerateClick={handleGenerateMoodboard}
              generateButtonText="Generate First Moodboard"
              emptyTitle="No moodboards synthesized yet"
              emptySubtitle="Click generate to create an editorial texture and material moodboard tailored to this client's brief."
              galleryType="moodboard"
            />
          </div>
        )}

        {/* =========================================================
            TAB 2: LAYOUT REFERENCE (CAD / SketchUp / AutoCAD)
           ========================================================= */}
        {activeTab === "layout" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-stone-100/70 border border-stone-200/80">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-800 font-semibold mb-0.5">
                <FileCode className="w-3.5 h-3.5" />
                Phase 2: Architectural CAD &amp; Spatial Reference
              </div>
              <p className="text-xs text-stone-600">
                Attach your existing SketchUp (.skp), AutoCAD (.dwg, .dxf), or PDF floorplans. These files are stored safely via Cloudinary for project reference.
              </p>
            </div>

            <LayoutUploader
              projectId={projectId}
              currentUrl={project.layoutFileUrl}
              currentFileName={project.layoutFileName}
              onUploadSuccess={handleLayoutUploadSuccess}
            />
          </div>
        )}

        {/* =========================================================
            TAB 3: FINAL PHOTOREALISTIC RENDER (Flux Schnell)
           ========================================================= */}
        {activeTab === "render" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-100/70 border border-stone-200/80">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Phase 3: Photorealistic Renders (Flux.1 Schnell)
                </div>
                <p className="text-xs text-stone-600">
                  Synthesizes 8K architectural photographs with realistic sunlight streaming, bouclé drapery, and raytraced reflections.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromptEditor(!showPromptEditor)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-mono uppercase tracking-wider hover:bg-stone-50 transition"
                >
                  {showPromptEditor ? "Hide Prompt Editor" : "Refine Prompt"}
                </button>
              </div>
            </div>

            {/* Optional Render Prompt Editor */}
            {showPromptEditor && (
              <div className="p-5 rounded-2xl bg-white border border-emerald-300/60 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-700 font-semibold">
                    Custom Render Prompt Adjustment (Optional)
                  </label>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Leave blank to use default photoreal template
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={customRenderPrompt}
                  onChange={(e) => setCustomRenderPrompt(e.target.value)}
                  placeholder="Override or add specific lighting instructions, e.g. Golden hour sunset lighting, wide-angle 24mm architectural view, bespoke modular sofa..."
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-emerald-600 transition font-sans"
                />
              </div>
            )}

            {/* Render Image Gallery */}
            <ImageGallery
              images={project.renderImages || []}
              isLoading={isGeneratingRender}
              loadingMessage="Calculating volumetric raytracing via Flux.1 Schnell..."
              onGenerateClick={handleGenerateRender}
              generateButtonText="Synthesize Photorealistic Render"
              emptyTitle="No photorealistic renders generated yet"
              emptySubtitle="Click synthesize to render an 8K architectural interior photograph using Flux.1 Schnell."
              galleryType="render"
            />
          </div>
        )}
      </main>
    </div>
  );
}
