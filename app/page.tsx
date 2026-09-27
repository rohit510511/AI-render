import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Layers,
  FileCode,
  Image as ImageIcon,
  CheckCircle,
  ShieldCheck,
  Compass,
  Sliders,
  Palette
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 selection:bg-amber-600 selection:text-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32 border-b border-stone-200/80">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-amber-500/10 via-stone-200/20 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-300/80 text-stone-700 text-xs font-mono tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Next-Gen Spatial Architecture Visualization</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light tracking-tight text-stone-950 leading-[1.1]">
              Elevate interior concepts into{" "}
              <span className="italic font-normal text-amber-800">photorealistic</span> spaces.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
              Synthesize tactile SDXL material moodboards, link SketchUp & AutoCAD layouts,
              and render publication-grade Flux.1 interiors in seconds. Built for architects and interior designers.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/projects/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-stone-950 hover:bg-stone-850 text-white rounded-2xl text-xs font-mono uppercase tracking-wider transition-all shadow-xl shadow-stone-900/10 group font-medium"
              >
                <span>Start New Project</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-stone-50 border border-stone-300/80 text-stone-800 rounded-2xl text-xs font-mono uppercase tracking-wider transition-all shadow-sm font-medium"
              >
                <span>View Past Projects</span>
              </Link>
            </div>
          </div>

          {/* Interactive Feature Hero Gallery Showcase */}
          <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1: Moodboard Card */}
            <div className="group rounded-3xl bg-white border border-stone-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                    alt="SDXL Material Moodboard"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider bg-stone-950/80 backdrop-blur-md text-amber-400 border border-amber-500/20">
                    Phase 01 • SDXL
                  </span>
                </div>
                <h3 className="text-xl font-serif font-medium text-stone-950 mb-2">
                  Material & Vibe Moodboards
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Generate tactile editorial collages combining wood grains, bouclé textiles, travertine samples, and curated tonal palettes directly from client requirements.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 mt-6 flex items-center justify-between text-xs font-mono text-stone-500">
                <span>Model: SDXL 1.0</span>
                <span className="text-amber-700 font-medium">Concept Stage →</span>
              </div>
            </div>

            {/* Step 2: Layout CAD Card */}
            <div className="group rounded-3xl bg-white border border-stone-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-stone-100 flex items-center justify-center p-6 bg-gradient-to-br from-stone-900 to-stone-950 text-white">
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <FileCode className="w-7 h-7" />
                    </div>
                    <div className="font-mono text-xs tracking-wider text-stone-300">
                      AutoCAD .dwg &amp; SketchUp .skp
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" /> CAD Reference Ready
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider bg-stone-950/80 backdrop-blur-md text-blue-400 border border-blue-500/20">
                    Phase 02 • Spatial Alignment
                  </span>
                </div>
                <h3 className="text-xl font-serif font-medium text-stone-950 mb-2">
                  CAD &amp; Floorplan Integration
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Attach and store your existing 2D/3D layouts and floorplans. Keep architectural dimensions and spatial references unified with your visual render packages.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 mt-6 flex items-center justify-between text-xs font-mono text-stone-500">
                <span>Storage: Cloudinary Raw</span>
                <span className="text-blue-700 font-medium">Layout Stage →</span>
              </div>
            </div>

            {/* Step 3: Final Photoreal Render */}
            <div className="group rounded-3xl bg-white border border-stone-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                    alt="Flux Photorealistic Interior Render"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider bg-stone-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/20">
                    Phase 03 • Flux Schnell
                  </span>
                </div>
                <h3 className="text-xl font-serif font-medium text-stone-950 mb-2">
                  Photorealistic 8K Renders
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Generate magazine-worthy interior architecture photographs using the state-of-the-art Flux.1 Schnell model. Includes realistic morning sunlight, volumetric shadows, and luxury finishes.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 mt-6 flex items-center justify-between text-xs font-mono text-stone-500">
                <span>Model: Flux.1 Schnell</span>
                <span className="text-emerald-700 font-medium">Final Render →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design System & Aesthetic Capabilities */}
      <section className="py-20 bg-stone-100/60 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-xs uppercase font-mono tracking-widest text-amber-700 mb-2">
              Bespoke Design Aesthetics
            </h2>
            <p className="text-3xl font-serif font-light text-stone-950">
              Engineered specifically for interior designers, spatial consultants, and architects.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                style: "Minimalist",
                tag: "Clean geometry & negative space",
                color: "bg-stone-200",
              },
              {
                style: "Scandinavian",
                tag: "Light woods, hygge warmth & organic linen",
                color: "bg-amber-100",
              },
              {
                style: "Industrial",
                tag: "Exposed brick, blackened steel & concrete",
                color: "bg-stone-300",
              },
              {
                style: "Boho Chic",
                tag: "Textured weaves, rattan & warm earth tones",
                color: "bg-amber-200/60",
              },
              {
                style: "Modern Classic",
                tag: "Crown moulding, herringbone & marble",
                color: "bg-stone-200",
              },
              {
                style: "Japandi",
                tag: "Wabi-sabi balance & understated elegance",
                color: "bg-stone-150",
              },
              {
                style: "Mediterranean",
                tag: "Lime plaster, terracotta & curved arches",
                color: "bg-amber-100",
              },
              {
                style: "Custom Studio",
                tag: "Tailored to your bespoke client specifications",
                color: "bg-stone-200",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl ${item.color} mb-3 flex items-center justify-center`}>
                    <Palette className="w-4 h-4 text-stone-700" />
                  </div>
                  <h4 className="text-base font-serif font-medium text-stone-950 mb-1">
                    {item.style}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center font-serif text-xs">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="font-serif text-sm font-semibold tracking-wider uppercase text-stone-900">
              Lumen Atelier
            </span>
          </div>

          <p className="text-xs text-stone-500 font-mono">
            Designed for high-end interior architecture visualization • Powered by Cloudflare Workers AI & Next.js
          </p>

          <div className="flex items-center gap-4 text-xs font-mono uppercase text-stone-600">
            <Link href="/projects" className="hover:text-stone-950 transition">
              Projects
            </Link>
            <span>•</span>
            <Link href="/projects/new" className="hover:text-stone-950 transition">
              New Project
            </Link>
            <span>•</span>
            <Link href="/auth/signin" className="hover:text-stone-950 transition">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
