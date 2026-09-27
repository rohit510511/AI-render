"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Compass, Sparkles, ArrowRight, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/projects";
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    await signIn("google", { callbackUrl });
  };

  const handleDemoSignIn = async () => {
    setLoadingDemo(true);
    await signIn("credentials", {
      email: "designer@lumenatelier.com",
      name: "Elena Rostova (Lead Designer)",
      callbackUrl,
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-white relative overflow-hidden py-12">
      {/* Background Architectural Ambient Light & Glow */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-stone-700/20 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
            <Compass className="w-5 h-5 text-amber-500" />
          </div>
          <span className="font-serif text-xl tracking-wider uppercase font-semibold text-stone-100">
            Lumen Atelier
          </span>
        </Link>
        <p className="text-xs uppercase font-mono tracking-widest text-amber-500/90">
          AI-Powered Interior Spatial Visualization
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-stone-900/90 border border-stone-800/90 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-serif font-medium text-stone-100 mb-1.5">
            Studio Authentication
          </h1>
          <p className="text-xs text-stone-400 font-sans">
            Sign in to manage client design projects, generate SDXL moodboards, and synthesize Flux renders.
          </p>
        </div>

        <div className="space-y-4">
          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle || loadingDemo}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-stone-100 hover:bg-white text-stone-900 rounded-2xl font-medium text-xs font-mono uppercase tracking-wider transition shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loadingGoogle ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-800" />
            <span className="flex-shrink mx-4 text-[10px] uppercase font-mono tracking-widest text-stone-500">
              OR TEST STUDIO DIRECTLY
            </span>
            <div className="flex-grow border-t border-stone-800" />
          </div>

          {/* Instant Studio Demo / Developer Access */}
          <button
            onClick={handleDemoSignIn}
            disabled={loadingGoogle || loadingDemo}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-stone-850 hover:bg-stone-800 border border-stone-700/60 text-stone-200 rounded-2xl font-medium text-xs font-mono uppercase tracking-wider transition shadow-sm hover:border-amber-500/50 disabled:opacity-50"
          >
            <User className="w-4 h-4 text-amber-500" />
            <span>
              {loadingDemo ? "Accessing Studio..." : "Instant Demo Access (Elena Rostova)"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>

        {/* Security / Specs Notice */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex items-start gap-2.5 text-stone-500 text-[11px] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>
            Sessions are securely authenticated via NextAuth.js with MongoDB session storage. Each design project and generated asset is private to your studio account.
          </span>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-300 transition">
          ← Return to Atelier Overview
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-400 text-xs font-mono uppercase tracking-wider">
          Loading Studio Access...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
