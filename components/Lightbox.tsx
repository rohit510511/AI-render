"use client";

import React, { useEffect, useState } from "react";
import { X, Download, Copy, Check, Sparkles, Calendar, Layers } from "lucide-react";
import { IGeneratedImage } from "@/models/Project";

interface LightboxProps {
  image: IGeneratedImage | null;
  onClose: () => void;
  title?: string;
}

export default function Lightbox({ image, onClose, title = "Design Visualization" }: LightboxProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  const handleCopyPrompt = () => {
    if (!image.prompt) return;
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = image.url;
    a.download = `atelier-render-${image.model}-${Date.now()}.png`;
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 transition-all duration-300">
      {/* Background click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="relative max-w-6xl w-full max-h-[92vh] flex flex-col lg:flex-row bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top bar controls on mobile */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800 lg:hidden text-stone-200">
          <span className="text-sm font-medium tracking-wide">{title}</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Image View */}
        <div className="flex-1 bg-black/50 flex items-center justify-center p-4 sm:p-8 min-h-[350px] lg:min-h-[600px] overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.prompt || "Interior visualization"}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
          />
        </div>

        {/* Metadata Sidebar */}
        <div className="w-full lg:w-96 bg-stone-900/95 border-t lg:border-t-0 lg:border-l border-stone-800 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="hidden lg:flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2 text-stone-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs uppercase tracking-wider font-mono font-medium">
                  {title}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1.5">
                  AI Architecture Model
                </label>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/80 border border-stone-700/60 text-stone-200 text-xs font-mono">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  {image.model === "flux-schnell"
                    ? "Flux.1 Schnell (Photorealistic)"
                    : "Stable Diffusion XL (Concept Collage)"}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-stone-400">
                    Architectural Prompt
                  </label>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Prompt
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-300 text-xs leading-relaxed max-h-48 overflow-y-auto font-sans">
                  {image.prompt || "Generated based on interior space requirements & material palette."}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Render Timestamp
                </label>
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  {image.generatedAt ? new Date(image.generatedAt).toLocaleString() : "Just now"}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 mt-6 flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-950/30"
            >
              <Download className="w-4 h-4" /> Download High-Res
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
