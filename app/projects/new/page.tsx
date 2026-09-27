"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Sparkles,
  ArrowRight,
  Home,
  Palette,
  DollarSign,
  FileText,
  User,
  Loader2,
  AlertCircle,
  Check
} from "lucide-react";
import Link from "next/link";

const PALETTE_PRESETS = [
  "Warm Ochre, Bouclé Ivory & Natural Oak",
  "Nordic Ash, Mist Grey & Matte Black",
  "Earthy Terracotta, Olive Sage & Honed Travertine",
  "Monochrome Charcoal, Linen & Brushed Brass",
  "Japandi Light Cedar, Washi Paper & Stone",
  "Walnut, Deep Emerald & Fluted Glass",
];

export default function NewProjectPage() {
  const router = useRouter();

  const [clientName, setClientName] = useState("");
  const [roomType, setRoomType] = useState("living-room");
  const [style, setStyle] = useState("scandinavian");
  const [colorPalette, setColorPalette] = useState("Warm Ochre, Bouclé Ivory & Natural Oak");
  const [budgetRange, setBudgetRange] = useState<"low" | "medium" | "high">("medium");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMessage("Please enter a client or project name.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          roomType,
          style,
          colorPalette: colorPalette.trim(),
          budgetRange,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      // Redirect directly to the newly created project's studio dashboard
      router.push(`/projects/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 selection:bg-amber-600 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
            <Link href="/projects" className="hover:text-stone-900 transition">
              Projects
            </Link>
            <span>/</span>
            <span className="text-amber-700">New Visualization Project</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-light text-stone-950">
            Define Client Interior Brief
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Input the room typology, curated style, and materiality. Our AI will synthesize tailored SDXL moodboards and photorealistic Flux renders.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-8"
        >
          {/* Section 1: Client & Identity */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-stone-100">
              <User className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm uppercase font-mono tracking-wider font-semibold text-stone-900">
                1. Client &amp; Project Name
              </h2>
            </div>

            <div>
              <label
                htmlFor="clientName"
                className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2"
              >
                Project / Client Designation *
              </label>
              <input
                id="clientName"
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Tribeca Loft Penthouse (Kaufman Residence)"
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
              />
            </div>
          </div>

          {/* Section 2: Spatial Typology & Aesthetic Style */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-stone-100">
              <Home className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm uppercase font-mono tracking-wider font-semibold text-stone-900">
                2. Spatial Typology &amp; Design Ethos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Room Type */}
              <div>
                <label
                  htmlFor="roomType"
                  className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2"
                >
                  Room Typology *
                </label>
                <select
                  id="roomType"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition cursor-pointer"
                >
                  <option value="living-room">Living Room</option>
                  <option value="bedroom">Master Bedroom</option>
                  <option value="kitchen">Gourmet Kitchen</option>
                  <option value="bathroom">Spa Bathroom</option>
                  <option value="dining-room">Formal Dining Room</option>
                  <option value="home-office">Executive Home Office</option>
                  <option value="other">Bespoke Suite / Other</option>
                </select>
              </div>

              {/* Design Style */}
              <div>
                <label
                  htmlFor="style"
                  className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2"
                >
                  Interior Style / Theme *
                </label>
                <select
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition cursor-pointer"
                >
                  <option value="minimalist">Minimalist (Pure lines & air)</option>
                  <option value="scandinavian">Scandinavian (Warm wood & Nordic hygge)</option>
                  <option value="industrial">Industrial (Steel, concrete & loft accents)</option>
                  <option value="boho">Boho Chic (Artisanal textures & rattan)</option>
                  <option value="modern">Modern Contemporary (Sleek architecture)</option>
                  <option value="traditional">Traditional Classic (Herringbone & moulding)</option>
                  <option value="other">Eclectic / Tailored Blend</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Color Palette & Materiality */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-stone-100">
              <Palette className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm uppercase font-mono tracking-wider font-semibold text-stone-900">
                3. Color Palette &amp; Material Preferences
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="colorPalette"
                  className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2"
                >
                  Color Palette Preference (Free-text)
                </label>
                <input
                  id="colorPalette"
                  type="text"
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  placeholder="e.g. Muted sage green, brushed champagne gold, off-white linen"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                />
              </div>

              {/* Quick Preset Selector Chips */}
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-2">
                  Quick Palette Suggestions (Click to apply)
                </span>
                <div className="flex flex-wrap gap-2">
                  {PALETTE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setColorPalette(preset)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition text-left ${
                        colorPalette === preset
                          ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Budget Tier & Free-text Notes */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-stone-100">
              <DollarSign className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm uppercase font-mono tracking-wider font-semibold text-stone-900">
                4. Budget Range &amp; Design Notes
              </h2>
            </div>

            <div className="space-y-6">
              {/* Budget Range Radio Buttons */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2.5">
                  Budget Classification
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "low", label: "Accessible / Smart", desc: "Modular, Scandinavian ergonomics" },
                    { id: "medium", label: "Premium Designer", desc: "Contemporary tailored finishes" },
                    { id: "high", label: "High-End Bespoke", desc: "Custom Italian joinery & marble" },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setBudgetRange(tier.id as any)}
                      className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                        budgetRange === tier.id
                          ? "border-amber-600 bg-amber-50/70 shadow-sm"
                          : "border-stone-200 bg-stone-50 hover:bg-stone-100/70"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-900">
                            {tier.label}
                          </span>
                          {budgetRange === tier.id && (
                            <Check className="w-3.5 h-3.5 text-amber-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 leading-tight">{tier.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Free-text Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2"
                >
                  Architectural &amp; Client Notes (Free-text)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Floor-to-ceiling southern exposure windows with sheer linen drapes, integrated warm LED cove lighting, floating monolithic kitchen island, client loves biophilic elements and indoor fiddle-leaf figs..."
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition font-sans"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/projects"
              className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-800 transition"
            >
              ← Cancel &amp; Back to Projects
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-stone-950 hover:bg-stone-850 text-white rounded-2xl text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-stone-950/15 disabled:opacity-50 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Initializing Project Studio...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Create Project &amp; Launch Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
