"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Plus, LayoutGrid, LogOut, Compass } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthPage = pathname.startsWith("/auth");
  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-850 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center font-serif text-sm font-semibold shadow-sm group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <span className="font-serif text-base tracking-wider uppercase font-semibold text-stone-900 dark:text-stone-100">
              Lumen Atelier
            </span>
            <span className="block text-[9px] uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400">
              AI Interior Design
            </span>
          </div>
        </Link>

        {/* Navigation links & User actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {session ? (
            <>
              <Link
                href="/projects"
                className={`text-xs font-mono uppercase tracking-wider px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                  pathname === "/projects"
                    ? "text-stone-950 dark:text-white font-medium bg-stone-200/60 dark:bg-stone-800"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Projects</span>
              </Link>

              <Link
                href="/projects/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono uppercase tracking-wider rounded-xl transition shadow-sm font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </Link>

              <div className="h-4 w-px bg-stone-200 dark:bg-stone-800 mx-1" />

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2.5">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center text-xs font-mono uppercase">
                    {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign out"
                  className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-850 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : status === "loading" ? (
            <div className="w-24 h-7 bg-stone-200 dark:bg-stone-800 rounded-lg animate-pulse" />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white px-3 py-1.5 rounded-lg transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-mono uppercase tracking-wider rounded-xl transition shadow-sm font-medium"
              >
                Start Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
