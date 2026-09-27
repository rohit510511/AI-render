"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerationLoaderProps {
  model: "sdxl" | "flux-schnell";
  onCancel?: () => void;
}

const DESIGN_TIPS = [
  "Synthesizing architectural proportions and spatial volumes...",
  "Harmonizing materials: bouclé fabrics, natural oak, and honed travertine...",
  "Calibrating diffuse natural lighting from simulated floor-to-ceiling windows...",
  "Computing realistic ambient occlusion and volumetric raytracing...",
  "Finalizing photorealistic 8k render with Hasselblad optics simulation...",
];

export default function GenerationLoader({ model }: GenerationLoaderProps) {
  const [seconds, setSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % DESIGN_TIPS.length);
    }, 3500);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, []);

  const modelTitle =
    model === "flux-schnell"
      ? "Flux.1 Schnell Photorealistic Engine"
      : "Stable Diffusion XL Moodboard Synthesis";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-md p-4">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        {/* Central Pulse Icon */}
        <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-amber-500/20 animate-ping opacity-75" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
            <Sparkles className="w-8 h-8 animate-spin duration-1000" />
          </div>
        </div>

        {/* Title */}
        <div className="text-[11px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">
          {modelTitle}
        </div>
        <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
          Generating Architectural Visuals
        </h3>

        {/* Dynamic Tip */}
        <p className="text-xs text-stone-600 dark:text-stone-400 min-h-[36px] flex items-center justify-center px-4 leading-relaxed font-sans transition-all duration-500">
          {DESIGN_TIPS[tipIndex]}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full mt-6 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(95, 5 + seconds * 4)}%` }}
          />
        </div>

        {/* Time counter */}
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mt-3">
          <span className="flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
            Workers AI active
          </span>
          <span>Elapsed: {seconds}s</span>
        </div>
      </div>
    </div>
  );
}
