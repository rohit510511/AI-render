"use client";

import React, { useState } from "react";
import { IGeneratedImage } from "@/models/Project";
import Lightbox from "./Lightbox";
import { Maximize2, Download, Sparkles, Image as ImageIcon, Copy, Check } from "lucide-react";

interface ImageGalleryProps {
  images: IGeneratedImage[];
  isLoading?: boolean;
  loadingMessage?: string;
  onGenerateClick?: () => void;
  generateButtonText?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
  galleryType?: "moodboard" | "render";
}

export default function ImageGallery({
  images,
  isLoading = false,
  loadingMessage = "Synthesizing architectural vision...",
  onGenerateClick,
  generateButtonText = "Generate Visuals",
  emptyTitle = "No visual concepts generated yet",
  emptySubtitle = "Synthesize high-fidelity moodboards and photorealistic renders using AI.",
  galleryType = "moodboard",
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<IGeneratedImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, prompt: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (e: React.MouseEvent, url: string, model: string) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = url;
    a.download = `atelier-interior-${model}-${Date.now()}.png`;
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Lightbox Modal */}
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          title={galleryType === "render" ? "Photorealistic Render (Flux)" : "Interior Moodboard (SDXL)"}
        />
      )}

      {/* Grid of Images */}
      {images.length > 0 || isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Loading Skeleton Card */}
          {isLoading && (
            <div className="relative aspect-[4/3] rounded-2xl border border-amber-300/40 dark:border-amber-700/40 bg-gradient-to-br from-amber-500/5 via-stone-100 to-amber-500/10 dark:from-stone-900 dark:to-stone-850 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-lg animate-pulse">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 animate-bounce">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-serif font-medium text-stone-800 dark:text-stone-200 mb-1">
                {galleryType === "render" ? "Generating Flux Render..." : "Synthesizing SDXL Concept..."}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[220px]">
                {loadingMessage}
              </p>
              <div className="w-32 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>
          )}

          {/* Rendered Images */}
          {images.map((img, idx) => (
            <div
              key={img.cloudinaryId || idx}
              onClick={() => setSelectedImage(img)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.prompt || "Generated visualization"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Tag / Model badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
                  {img.model === "flux-schnell" ? "Flux Photoreal" : "SDXL Concept"}
                </span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <p className="text-xs line-clamp-2 text-stone-200 mb-3 font-sans">
                  {img.prompt || "Concept visualization based on space criteria."}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/15">
                  <span className="text-[11px] text-stone-300 font-mono">
                    {img.generatedAt ? new Date(img.generatedAt).toLocaleDateString() : "Recent"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {img.prompt && (
                      <button
                        onClick={(e) => handleCopy(e, img.prompt, img.cloudinaryId || `${idx}`)}
                        title="Copy Prompt"
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition"
                      >
                        {copiedId === (img.cloudinaryId || `${idx}`) ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDownload(e, img.url, img.model)}
                      title="Download image"
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedImage(img)}
                      title="Full View"
                      className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1 text-xs px-2.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" /> View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-12 text-center bg-stone-50/50 dark:bg-stone-900/30">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 mb-4">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-serif font-medium text-stone-900 dark:text-stone-100 mb-1">
            {emptyTitle}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-6">
            {emptySubtitle}
          </p>
          {onGenerateClick && (
            <button
              onClick={onGenerateClick}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-medium uppercase tracking-wider rounded-xl transition shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {generateButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
