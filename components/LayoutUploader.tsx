"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Download, AlertCircle, Loader2, ArrowUpRight } from "lucide-react";

interface LayoutUploaderProps {
  projectId: string;
  currentUrl?: string;
  currentFileName?: string;
  onUploadSuccess: (url: string, fileName: string) => void;
}

export default function LayoutUploader({
  projectId,
  currentUrl,
  currentFileName,
  onUploadSuccess,
}: LayoutUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setErrorMessage(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/projects/${projectId}/upload-layout`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload CAD/layout file");
      }

      onUploadSuccess(data.layoutFileUrl, data.layoutFileName);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const getFileExtension = (name?: string) => {
    if (!name) return "FILE";
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop()!.toUpperCase() : "CAD";
  };

  return (
    <div className="space-y-6">
      {/* Existing Layout File Card if present */}
      {currentUrl && (
        <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-xs uppercase border border-amber-500/20">
              {getFileExtension(currentFileName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-stone-900 dark:text-stone-100 font-mono">
                  {currentFileName || "layout-reference-file"}
                </h4>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Attached design reference for architectural proportions & floorplans
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-mono uppercase tracking-wider rounded-xl transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download Reference
            </a>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
              title="Open link in new tab"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          dragOver
            ? "border-amber-500 bg-amber-500/5 scale-[1.005]"
            : "border-stone-300 dark:border-stone-800 hover:border-amber-400/80 bg-stone-50/50 dark:bg-stone-900/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".skp,.dwg,.dxf,.pdf,.png,.jpg,.jpeg,.svg"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            {isUploading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <h3 className="text-base font-serif font-medium text-stone-900 dark:text-stone-100 mb-1">
            {isUploading
              ? "Uploading Layout Reference..."
              : currentUrl
              ? "Replace or upload revised CAD layout"
              : "Upload 2D / 3D Layout Reference"}
          </h3>

          <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 leading-relaxed">
            Drag and drop your SketchUp (<code className="font-mono text-amber-600 dark:text-amber-400">.skp</code>),
            AutoCAD (<code className="font-mono text-amber-600 dark:text-amber-400">.dwg</code>, <code className="font-mono text-amber-600 dark:text-amber-400">.dxf</code>),
            or architectural floorplan PDF/images.
          </p>

          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-mono uppercase tracking-wider rounded-xl shadow-sm">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            Browse CAD Files
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-3 text-red-700 dark:text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
