"use client";

import React from "react";
import Header from "../components/Header";
import VisualModalCarousel from "../(marketing)/components/VisualModalCarousel";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white pb-24">
      <Header />
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Gallery
          </h1>
          <p className="text-gray-400 text-lg">
            Nature sound explorations, sensory visual loops, and dynamic media collections.
          </p>
        </div>
        <div className="w-full">
          <VisualModalCarousel />
        </div>
      </div>
    </main>
  );
}
