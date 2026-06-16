"use client";

import PlayerControls from "./PlayerControls";
import MusicStorePortal from "./commerce/MusicStorePortal";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaSpotify, FaLink, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import tracks from '../data/tracks.json';
import { useAudioStore, Track } from '../lib/audio';
import PlayerPositionPoller from './PlayerPositionPoller';

interface LandingMusicSectionProps {
  className?: string; 
  style?: React.CSSProperties; 
}

export default function LandingMusicSection({ className, style }: LandingMusicSectionProps) { 
  const [shattered, setShattered] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive design
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Use more selective selectors to prevent unnecessary re-renders
  const currentTrackId = useAudioStore(state => state.currentTrackId);
  const queueLength = useAudioStore(state => state.queue.length);
  const isPlaying = useAudioStore(state => state.isPlaying);
  const position = useAudioStore(state => state.position);
  
  // Get store API directly to avoid re-renders
  const audioStore = useAudioStore;
  
  // Use refs to store actions to avoid re-renders
  const setQueueRef = useRef(audioStore.getState().setQueue);
  const playRef = useRef(audioStore.getState().play);
  const seekRef = useRef(audioStore.getState().seek);
  
  // Get queue only when needed, not as a dependency
  const queue = audioStore.getState().queue;
  
  // Update refs when store changes
  useEffect(() => {
    const unsubscribe = audioStore.subscribe((state) => {
      setQueueRef.current = state.setQueue;
      playRef.current = state.play;
      seekRef.current = state.seek;
    });
    
    return () => unsubscribe();
  }, [audioStore]);

  // Initialize queue and hydrate store state on mount - stable deps only
  useEffect(() => {
    const hydrateRef = audioStore.getState().hydrateState;
    const didHydrate = hydrateRef();
    if (!didHydrate && queueLength === 0) {
      setQueueRef.current(tracks as Track[]);
    }
  }, [queueLength, audioStore]);


  const handleTap = () => {
    if (shattered) return; 

    // Haptic feedback for mobile with fallback and debug
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        const didVibrate = navigator.vibrate(100);
        if (!didVibrate) {
          console.warn("Vibration API call returned false, vibration may be blocked.");
        }
      } catch (e) {
        console.warn("Vibration not supported or blocked", e);
      }
    } else {
      console.warn("Vibration API not supported on this device.");
    }

    // Play glass break sound
    const audio = new Audio('/glass1.wav');
    audio.play().catch(() => {
      // Handle play error silently (e.g., user hasn't interacted yet)
    });

    // Save shatter state to sessionStorage
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ijj_glass_shattered", "true");
      }
    } catch (e) {
      console.error("Failed to save shatter state to sessionStorage", e);
    }

    setShattered(true);
    playRef.current();
    console.log("Glass cracked!");
  };

  // Find current track data
  const currentTrack = queue.find((t: Track) => t.id === currentTrackId) || tracks[0];

  // Compose share URL and text dynamically
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out ${currentTrack.title} by ${currentTrack.artist}!`;

  // Define consistent minimum heights
  const minHeightClasses = "min-h-[380px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[550px]";

  return (
    <section 
      className={`relative w-full ${minHeightClasses} flex items-center justify-center p-2 sm:p-4 ${className || ''}`}
      style={style} 
    > 
      <motion.div
        className={`relative z-10 w-full max-w-sm md:max-w-2xl lg:max-w-4xl ${minHeightClasses} h-125 md:h-175 rounded-2xl shadow-lg overflow-hidden flex flex-col mt-12 md:mt-20`}
        onClick={!shattered ? handleTap : undefined} 
        role="button" 
        tabIndex={0} 
        onKeyPress={(e) => { if (!shattered && (e.key === 'Enter' || e.key === ' ')) handleTap(); }}
        animate={!shattered && !isMobile ? { y: ["0px", "-6px", "0px"] } : {}}
        transition={!shattered && !isMobile ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <AnimatePresence>
          {!shattered && (
            <motion.div
              key="glass-overlay"
              className="absolute inset-0 z-30 cursor-pointer w-full h-full"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }} 
            >
              <Image 
                src="https://a8aswb0equnjn0q3.public.blob.vercel-storage.com/cracked.png" 
                alt="Cracked glass overlay" 
                fill 
                priority 
                className="pointer-events-none w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-40 text-center p-4 md:p-8 flex flex-col justify-center items-center pointer-events-none"> 
                <div className="mt-12 md:mt-8"> 
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 text-black">Latest Releases</h2>
                  <p className="max-w-xl mx-auto text-sm md:text-base text-black">
                    Dive into the latest sounds from [[its.just.john]]. Immerse yourself, share the vibe, or own a piece of the journey.
                  </p>
                </div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2"> 
                   <p className="text-white text-sm bg-black/40 px-2 py-1 rounded animate-pulse">Tap to enter</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {shattered ? ( 
          <motion.div
            key="player-view"
            className="relative z-20 w-full h-full flex flex-col items-center gap-4 md:gap-6 grow rounded-2xl p-4 md:p-8 overflow-hidden bg-black" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.4, delay: 0.2 }} 
            style={{ pointerEvents: 'auto' }} 
          >
            {/* Optimized background cover image to prevent giant 8MB RAW PNG decoding crashes on mobile */}
            <div className="absolute inset-0 z-0">
              <Image 
                src={currentTrack.cover} 
                alt={`${currentTrack.title} cover`} 
                fill 
                className="object-contain" 
                sizes="(max-width: 768px) 100vw, 400px" 
                priority
              />
            </div>

            {/* Overlay contents directly above background image */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2 text-center drop-shadow-md">
                {currentTrack.artist} — {currentTrack.title}
              </h2>
              <div className="h-6" />
              <PlayerControls
                className="mb-3 w-full max-w-md"
              />
              <div className="flex flex-col items-center gap-4 mt-auto mb-4 w-full max-w-md">
                <button
                  onClick={() => setStoreOpen(true)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold w-full px-4 py-2 rounded transition-colors duration-200"
                  title="Buy/Donate"
                >
                  Buy/Donate
                </button>
                <div className="flex items-center justify-center space-x-3 w-full">
                  <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" title="Listen on Spotify" className="p-2 rounded-full text-white hover:text-green-500 transition-colors"><FaSpotify size={22} /></a>
                  <button title="Share on X" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')} className="p-2 rounded-full text-white hover:text-sky-400 transition-colors"><FaXTwitter size={20} /></button>
                  <button title="Share on Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')} className="p-2 rounded-full text-white hover:text-blue-600 transition-colors"><FaFacebook size={20} /></button>
                  <button title="Copy Link" onClick={() => navigator.clipboard.writeText(shareUrl).then(() => alert('Link Copied!'))} className="p-2 rounded-full text-white hover:text-gray-400 transition-colors"><FaLink size={20} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className={`w-full ${minHeightClasses} grow`}></div> 
        )}
      </motion.div>
      <PlayerPositionPoller />

      {/* Music Store Portal */}


      <MusicStorePortal
        isOpen={storeOpen}
        onClose={() => setStoreOpen(false)}
        currentTrackId={currentTrackId || undefined}
      />
    </section>
  );
}
