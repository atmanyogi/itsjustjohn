"use client";

import React, { useState, useEffect } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import HeroSection from "./components/HeroSection";
import CloudTransition from "./components/CloudTransition";
import VisualModalCarousel from "./components/VisualModalCarousel";
import LandingMusicSection from "../components/LandingMusicSection";
import PullApartReveal from "./components/PullApartReveal";
import Image from "next/image";
// import VideoModal from "../components/VideoModal";
import TouchPoint from "../components/TouchPoint";
import GearModal from "../components/commerce/GearModal";
import Header from "../components/Header";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function MarketingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTeeJarModalOpen, setIsTeeJarModalOpen] = useState(false);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);

  // Auto-open blog modal when hash matches blog-section
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#blog-section") {
        setIsOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // const handlePlayClick = () => {
  //   setIsVideoModalOpen(true);
  // };

  // const handleCloseVideoModal = () => {
  //   setIsVideoModalOpen(false);
  // };

  const handleTeeJarClick = () => {
    setIsTeeJarModalOpen(true);
  };

  const handleStudioClick = () => {
    // Haptic feedback
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setIsStudioModalOpen(true);
  };

  return (
    <main className="relative h-full overflow-x-hidden w-full max-w-full">
      <Header />

      {/* First visual in chain: IJJ 3.png */}
      <div className="relative w-full">
        <Image
          src="/audio/IJJ 3.png"
          alt="IJJ Banner"
          width={1920}
          height={1080}
          className="block w-full h-auto object-cover transform-gpu will-change-transform"
          draggable={false}
          priority
          sizes="120vw"
        />
      </div>

      {/* Lid layer with HeroSection over top */}
      <div className="relative w-full h-full">
        <Image
          src="/lid.png"
          alt="Lid"
          width={1920}
          height={1080}
          className="block w-full h-auto object-cover transform-gpu will-change-transform"
          draggable={false}
          priority
          sizes="100vw"
        />
        {/* Umbrella - Mobile Only, bottom of umbrella meets bottom of lid */}
        <div 
          className="absolute bottom-0 left-1/2 w-[210vw] max-w-[210vw] md:hidden pointer-events-none z-10 animate-float-pulse"
          style={{ transform: 'translateX(calc(-50% + 33.3vw))' }}
        >
          <Image
            src="/umbrella.png"
            alt="Umbrella Mobile"
            width={1920}
            height={1080}
            className="block w-full h-auto object-contain transform-gpu will-change-transform"
            draggable={false}
            priority
            sizes="210vw"
          />
        </div>
        <div className="absolute top-0 left-0 w-full">
          <HeroSection />
        </div>
      </div>

      {/* Cloud transition positioned exactly where it was with animations */}
      <div className="relative w-full mt-[-71svh] md:mt-[-15vh] z-25 pb-[20vh] md:pb-0">
        <CloudTransition />
      </div>

      {/* Desktop Onlyu interactive layers (purely CSS-driven to prevent layout jumps/thrashing) */}
      <div className="hidden md:block w-full">
        {/* Visual Modal Carousel - Nature sound explorations (Desktop) */}
          <div id="gallery-desktop" className="relative w-full hidden md:block" style={{ transform: 'translateY(-184vh)' }}>
            <VisualModalCarousel />
          </div>

      {/* Landing Music Section with all its attributes */}
      <div id="music-section">
        <LandingMusicSection className="-mt-[80svh] md:-mt-[210vh]" />
      </div>



      {/* Moss layer */}
      <div
        className="relative w-full -mt-5 md:mt-0 z-50 md:z-5" // Move up slightly more on mobile, stack above jar bottom on mobile (z-50 vs z-20)
      >
        <Image
          src="/moss3.png"
          alt="Moss"
          width={1920}
          height={1080}
          className="block w-full h-auto object-cover transform-gpu will-change-transform"
          draggable={false}
          loading="lazy"
          sizes="100vw"
        />
        {/* clotheslinefern.png layered on top of moss3.png */}
        <Image
          src="/clotheslinefern.png"
          alt="Clothesline Fern"
          className="absolute -bottom-[-20.75vh] md:-bottom-[-62vh] left-0 w-full h-auto object-cover z-10 transform-gpu will-change-transform" // Moved down about 1 3/4 pages on mobile, slightly adjusted desktop position
          draggable={false}
          loading="lazy"
          width={1050} // Enlarged about an 1/8
          height={575} // Enlarged about an 1/8
        />
        {/* teejar.png positioned relative to clotheslinefern */}
        <div
          id="shop-section"
          className="absolute top-[58svh] left-0 right-0 mx-auto w-screen h-auto z-999 md:top-[19vh] md:right-[-60vw] md:w-[65vw] md:h-auto animate-float-pulse cursor-pointer"
          onClick={handleTeeJarClick}
        >
          <div className="relative w-full h-full">
            <Image
              src="/teejar.png"
              alt="Tee Jar"
              className="w-full h-full object-contain"
              draggable={false}
              loading="lazy"
              width={500}
              height={500}
            />
            {/* Gear Touchpoint */}
            <TouchPoint 
              top="50%" 
              left="50%" 
              title={<span className="hidden md:inline">Gear</span>} 
              onClick={handleTeeJarClick}
              className="scale-150"
            />
          </div>
        </div>
        {/* TV Image positioned at the seam */}
      <div id="video-section" className="relative w-full flex justify-center items-center top-[71.25vh] z-70 md:top-[-12.5vh] md:z-30" /* Adjusted top for mobile */>
        <Image src="/TV2.png" alt="TV" width={1032} height={688} className="object-contain" /> {/* Adjusted to fill width and maintain aspect ratio */}
        {/* Play button */}
        <a
          href="https://www.youtube.com/@itsjustjohn-tho"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute z-40 p-4 rounded-full bg-white bg-opacity-75 text-black text-2xl transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <BsFillPlayFill className="w-12 h-12" />
        </a>
      </div>
      </div> {/* Closing tag for the "Moss layer" div */}

      {/* Bottom layer with PullApartReveal overlay - Desktop Only */}
      <div className="relative w-full hidden md:block md:-mt-[96vh]">
        <Image
          src="/layers.jpg"
          alt="Layers"
          width={1920}
          height={1080}
          className="block w-full h-auto object-cover transform-gpu will-change-transform"
          draggable={false}
          loading="lazy"
          sizes="100vw"
        />
        <Image
          src="/cave.png"
          alt="Cave"
          width={1920}
          height={1080}
          className="absolute bottom-0 left-0 w-full h-auto object-cover z-35 pointer-events-none transform-gpu will-change-transform"
          style={{ transform: 'translateY(-25vh)' }} // Move cave up by approx 1/4 page
          draggable={false}
          loading="lazy"
          sizes="100vw"
        />
        <div 
          id="extras-section"
          className="absolute bottom-0 left-1/2 z-34 cursor-pointer animate-float-pulse"
          style={{ transform: 'translateX(-50%) translateY(-25vh)', width: '90.6%', height: 'auto' }} // Move studio up to match cave
          onClick={handleStudioClick}
        >
          {/* Frosted Glass Frame holding the blurred image and overlay */}
          <div className="relative w-full h-auto overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl group">
            <Image
              src="/Extras.png"
              alt="Extras"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover blur-md scale-102 transition-all duration-700 select-none"
              draggable={false}
              loading="lazy"
              sizes="90vw"
            />
            {/* Frosted Glass Overlay */}
            <div className="absolute inset-0 bg-white/2 backdrop-blur-xs flex flex-col items-center justify-center border border-white/5">
              <div className="flex flex-col items-center gap-3">
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
        <PullApartReveal
          id="blog-section"
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          className="absolute top-[calc(-200vh-12.5vh)] left-1/2 w-[90vw] h-[90vh] transform -translate-x-1/2 z-20"
        >
          <div>
          </div>
        </PullApartReveal>
      </div>

      {/* Close Desktop-Only interactive block wrapper */}
      </div>

      {/* Removed Open Reveal button */}

      {/* Jar Bottom - Desktop Only */}
      <div className="relative w-full hidden md:block md:-mt-[31.25vh] z-20 md:z-60 md:mb-0">
        <Image
          src="/jar bottom.png"
          alt="Jar Bottom"
          width={1920}
          height={1080}
          className="block w-full h-auto object-cover transform-gpu will-change-transform"
          draggable={false}
          loading="lazy"
          sizes="100vw"
        />
        {/* Ferndrip layered above and centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-x-[1%]">
          <Image
            src="/Ferndrip.png"
            alt="Ferndrip"
            width={500}
            height={500}
            className="w-auto h-auto max-w-[80%] max-h-[80%] object-contain"
            draggable={false}
            sizes="(max-width: 768px) 80vw, 50vw"
          />
        </div>
        
        {/* IJJ Logo layered on top */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-100 -translate-x-[4%] -translate-y-[12.5vh] md:-translate-y-[40vh]"
        >
          <Image
            src="/IJJ LOGO.png"
            alt="IJJ Logo"
            width={500}
            height={500}
            className="w-auto h-auto max-w-[50%] max-h-[50%] object-contain"
            draggable={false}
            sizes="(max-width: 768px) 50vw, 500px"
          />
        </div>

        {/* Social Icons below Ferndrip */}
        <div className="absolute bottom-[18%] left-0 right-0 mx-auto w-full flex justify-center items-center gap-8 md:gap-12 z-100">
          <a 
            href="https://www.instagram.com/itsjustjohntho/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:opacity-80 transition-opacity"
            aria-label="Instagram"
          >
            <FaInstagram className="w-7.5 h-7.5 md:w-15 md:h-15" />
          </a>
          <a 
            href="https://www.youtube.com/@itsjustjohn-tho" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:opacity-80 transition-opacity"
            aria-label="YouTube"
          >
            <FaYoutube className="w-7.5 h-7.5 md:w-15 md:h-15" />
          </a>
        </div>
      </div>



      {/* Video Modal */}
      {/* <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder YouTube video URL
      /> */}

      {/* Studio Image Modal */}
      {isStudioModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-50 flex justify-center items-center p-4 overflow-auto animate-in fade-in duration-300" onClick={() => setIsStudioModalOpen(false)}>
          <div className="relative w-full max-w-7xl h-auto" onClick={(e) => e.stopPropagation()}>
            <img
              src="/Extras.png"
              alt="Extras Full View"
              className="w-full h-auto object-contain rounded-3xl shadow-2xl border border-white/10"
            />
            
            {/* Keyboard Touch Point */}
            <TouchPoint 
              top="50%" 
              left="18%" 
              title="Beat Store Coming Soon" 
            />

            {/* Camera Touch Point */}
            <TouchPoint 
              top="50%" 
              left="50%" 
              title={
                <span>
                  Artists and Branding Visuals with a Vibe.
                  <br /><br />
                  <a 
                    href="https://www.instagram.com/vibevisualshawaii/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline text-shadow-sm hover:text-accent font-semibold transition-colors duration-200"
                  >
                    @vibevisualshawaii
                  </a>{" "}
                  on IG
                  <br />
                  contact{" "}
                  <a 
                    href="mailto:visuals@bruhitsjustjohn.com" 
                    className="underline text-shadow-sm hover:text-accent font-semibold transition-colors duration-200"
                  >
                    visuals@bruhitsjustjohn.com
                  </a>
                </span>
              } 
            />

            {/* Notepad & Microphone Touch Point */}
            <TouchPoint 
              top="50%" 
              left="82%" 
              title="Collabs, Features And Songwriting Coming Soon" 
            />

            <button 
              className="absolute top-4 right-4 z-50 text-white p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-white/15 active:scale-95 transition-all duration-200 shadow-lg"
              onClick={() => setIsStudioModalOpen(false)}
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Gear Modal */}
      <GearModal
        isOpen={isTeeJarModalOpen}
        onClose={() => setIsTeeJarModalOpen(false)}
      />
    </main>
  );
}
