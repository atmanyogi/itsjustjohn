"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import TouchPoint from "../components/TouchPoint";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function ExtrasPage() {
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white pb-24 overflow-x-hidden">
      <Header />
      
      {/* Immersive Graphics Header */}
      <div className="container mx-auto px-4 pt-16 pb-8 text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          The Werkz
        </h1>
        <p className="text-gray-400 text-lg">
          Explore Collabs, Studio Beats, videography services, and dynamic media.
        </p>
      </div>

      {/* Container for cave.png background and the Extras.png card overlay */}
      <div className="relative w-full max-w-5xl mx-auto h-auto px-4 mt-8 pb-32">
        <div 
          className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl bg-zinc-950 aspect-1920/1080 cursor-pointer"
          onClick={() => setIsStudioModalOpen(true)}
        >
          {/* 1. Behind the Cave: Blurred Extras background visual */}
          <div className="absolute inset-0 z-0 flex items-center justify-center p-[4%] md:p-[8%] select-none">
            <div className="relative w-full md:w-[90%] aspect-1920/1080 overflow-hidden rounded-2xl md:rounded-3xl">
              <img
                src="/Extras.png"
                alt="Extras Inside Cave"
                className="w-full h-full object-cover blur-md scale-102 select-none"
                draggable={false}
              />
              {/* Frosted Glass Overlay */}
              <div className="absolute inset-0 bg-white/2 backdrop-blur-xs flex flex-col items-center justify-center border border-white/5">
                <div className="flex flex-col items-center gap-3 transform translate-y-6">
                  {/* Pulsing bubble prompt */}
                  <div className="relative flex items-center justify-center w-14 h-14">
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                    <div className="w-4 h-4 bg-white/90 rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
                  </div>
                  <p className="text-white text-xs font-semibold uppercase tracking-[0.2em] opacity-80 drop-shadow-md text-center">
                    the werkz
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Top Layer: Cave Mouth covers and frames the blurred Extras */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Image
              src="/cave.png"
              alt="Cave Mouth"
              fill
              className="object-cover rounded-[2.5rem]"
              draggable={false}
              priority
            />
          </div>
        </div>
      </div>

      {/* Studio Image Modal - Revealed on click */}
      {isStudioModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[99999] flex justify-center items-center p-4 overflow-auto animate-in fade-in duration-300"
          onClick={() => setIsStudioModalOpen(false)}
        >
          {/* Page-level fixed Close Button in top right corner of screen */}
          <button 
            className="fixed top-6 right-6 z-[100000] text-white p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:bg-white/15 active:scale-95 transition-all duration-200 shadow-2xl"
            onClick={() => setIsStudioModalOpen(false)}
            aria-label="Close modal"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-5xl h-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full aspect-1920/1080 rounded-3xl border border-white/10 overflow-visible bg-zinc-900 shadow-2xl">
              <img
                src="/Extras.png"
                alt="Extras Full View"
                className="w-full h-full object-contain rounded-3xl select-none"
                draggable={false}
              />
              
              {/* Keyboard Touch Point */}
              <TouchPoint 
                top="48%" 
                left="18%" 
                title="Beat Store Coming Soon" 
              />

              {/* Camera Touch Point */}
              <TouchPoint 
                top="48%" 
                left="50%" 
                title={
                  <span>
                    Artists and Branding Visuals with a Vibe.
                    <br /><br />
                    <a 
                      href="https://www.instagram.com/vibevisualshawaii/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="underline text-shadow-sm hover:text-emerald-400 font-semibold transition-colors duration-200"
                    >
                      @vibevisualshawaii
                    </a>{" "}
                    on IG
                    <br /> contact{" "}
                    <a 
                      href="mailto:visuals@bruhitsjustjohn.com" 
                      className="underline text-shadow-sm hover:text-emerald-400 font-semibold transition-colors duration-200"
                    >
                      visuals@bruhitsjustjohn.com
                    </a>
                  </span>
                } 
              />

              {/* Notepad & Microphone Touch Point */}
              <TouchPoint 
                top="48%" 
                left="82%" 
                title="Collabs, Features And Songwriting Coming Soon" 
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
