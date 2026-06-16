"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import PullApartReveal from "../(marketing)/components/PullApartReveal";
import Image from "next/image";

export default function BlogPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden w-full max-w-full flex flex-col">
      <Header />
      
      {/* Full viewport container for the Pull-Apart Reveal blog experience */}
      <div className="relative flex-grow w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        {/* Mobile prompt overlay (z-10 ensures it sits cleanly behind sliding gates/modals at z-20+) */}
        <div className="absolute top-[120px] left-0 right-0 px-6 text-center z-10 block md:hidden animate-in fade-in duration-700">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-widest drop-shadow-[0_4px_16px_rgba(0,0,0,1)] uppercase italic">
            Thoughts?
          </h1>
        </div>

        {/* Background Image: layers.jpg */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/layers.jpg"
            alt="Layers Backdrop"
            fill
            className="object-cover"
            draggable={false}
            priority
            sizes="100vw"
          />
        </div>
        
        {/* PullApartReveal in the center - Expanded to full allotted bounds */}
        <div className="relative w-full h-full min-h-[calc(100vh-80px)] z-20 flex items-center justify-center">
          <PullApartReveal
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            className="w-full h-full"
          >
            <div />
          </PullApartReveal>
        </div>
      </div>
    </main>
  );
}
