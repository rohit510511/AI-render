import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumen Atelier • AI Interior Design Visualization",
  description:
    "Next-generation spatial interior visualization tool. Synthesize tactile SDXL material moodboards, integrate AutoCAD & SketchUp layouts, and render 8K photorealistic Flux spaces.",
  keywords: [
    "AI interior design",
    "architectural visualization",
    "SDXL interior moodboard",
    "Flux Schnell interior render",
    "CAD layout reference",
    "interior architecture studio",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F5] text-stone-900 font-sans selection:bg-amber-600 selection:text-white">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
