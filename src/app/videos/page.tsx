"use client";

import React from "react";
import Image from "next/image";
import Header from "../components/Header";
import { BsFillPlayFill } from "react-icons/bs";

export default function VideosPage() {
  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col justify-between">
      <Header />

      {/* Main Visual Playground */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center p-4">
        {/* Full backdrop: layers 2.png */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/audio/layers 2.png"
            alt="Layers Background"
            fill
            className="object-cover"
            draggable={false}
            priority
          />
        </div>

        {/* Playable TV Card */}
        <div className="relative z-10 w-full max-w-[550px] md:max-w-[700px] lg:max-w-[850px] aspect-[1032/688] flex items-center justify-center">
          <Image 
            src="/TV2.png" 
            alt="Retro View TV" 
            fill 
            className="object-contain" 
            draggable={false}
            priority
          />
          {/* Centered blinking Play button */}
          <a
            href="https://www.youtube.com/@itsjustjohn-tho"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute z-20 p-5 rounded-full bg-white/80 hover:bg-white text-black text-3xl shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center translate-y-[-10px] md:translate-y-[-15px]"
            title="Watch YouTube Content"
          >
            <BsFillPlayFill className="w-14 h-14" />
          </a>
        </div>
      </div>
    </main>
  );
}
