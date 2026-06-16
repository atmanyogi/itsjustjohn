"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";
import TouchPoint from "../components/TouchPoint";
import GearModal from "../components/commerce/GearModal";

export default function ShopPage() {
  const [isTeeJarModalOpen, setIsTeeJarModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleTeeJarClick = () => {
    setIsTeeJarModalOpen(true);
  };

  return (
    <main className="relative min-h-screen w-full bg-white overflow-hidden flex flex-col justify-between">
      <Header />

      {/* Main Content Area */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center">
        {/* Full Moss background layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/moss3.png"
            alt="Moss Background"
            fill
            className="object-cover object-bottom"
            draggable={false}
            priority
          />
        </div>

        {/* clotheslinefern.png layered above the moss background */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] md:h-[65vh] z-10 pointer-events-none">
          <Image
            src="/clotheslinefern.png"
            alt="Clothesline Fern"
            fill
            className="object-cover object-bottom"
            draggable={false}
            priority
          />
        </div>

        {/* teejar.png positioned and centered above clotheslinefern */}
        <div
          className="relative z-20 w-[95vw] h-auto max-w-[550px] md:max-w-[650px] animate-float-pulse cursor-pointer mt-[40vh] md:mt-[2.5vh] transition-transform active:scale-95"
          onClick={handleTeeJarClick}
        >
          <div className="relative w-full h-full">
            <Image
              src="/teejar.png"
              alt="Tee Jar - Shop Now"
              width={500}
              height={500}
              className="w-full h-auto object-contain"
              draggable={false}
              priority
            />
            {/* Pulsating Touchpoint Bubble */}
            <TouchPoint 
              top="50%" 
              left="50%" 
              title={<span>Shop Gear</span>} 
              onClick={handleTeeJarClick}
              className="scale-150"
            />
          </div>
        </div>
      </div>

      {/* Gear Purchase Modal Sheet */}
      <GearModal
        isOpen={isTeeJarModalOpen}
        onClose={() => setIsTeeJarModalOpen(false)}
      />
    </main>
  );
}
