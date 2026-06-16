"use client";
// src/app/components/BreakableGlass.tsx

import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Use Next.js Image for optimization

interface BreakableGlassProps {
  children: ReactNode;
}

const BreakableGlass: React.FC<BreakableGlassProps> = ({ children }) => {
  const [shattered, setShattered] = useState(false);

  const handleTap = () => {
    if (shattered) return;
    // Shatter on the first tap
    setShattered(true);
    // Potentially log to analytics here
    console.log("Glass cracked!");
  };

  return (
    <div 
      className="relative cursor-pointer" 
      onClick={handleTap}
      role="button" // Accessibility: indicate it's clickable
      tabIndex={0} // Accessibility: make it focusable
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap(); }} // Accessibility: allow keyboard activation
    >
      {/* Cracked Glass Image Overlay */}
      <AnimatePresence>
        {!shattered && (
          <motion.div
            key="glass-overlay"
            className="absolute inset-0 z-20" // Container for the image
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} // Control fade duration
          >
            <Image 
              src="https://a8aswb0equnjn0q3.public.blob.vercel-storage.com/cracked.png" 
              alt="Cracked glass overlay - click to enter" 
              fill 
              priority // Load this image eagerly as it's part of the initial view
              className="pointer-events-none object-cover" // Prevent image from capturing clicks
            />
             {/* Optional: Add a subtle hint */}
             <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 pointer-events-none">
               <p className="text-white text-sm bg-black/40 px-2 py-1 rounded animate-pulse">Tap to enter</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content - revealed after shattering */}
      <motion.div
        className="relative z-10" // Content sits below overlay until revealed
        initial={{ scale: 0.95, opacity: 0 }} // Start hidden and slightly scaled down
        animate={{
          scale: shattered ? 1 : 0.95, // Animate to full scale if shattered
          opacity: shattered ? 1 : 0, // Animate to full opacity if shattered
        }}
        transition={{ duration: 0.4, delay: shattered ? 0.2 : 0 }} // Delay slightly after glass fades
        // Prevent interaction with content before shattering
        style={{ pointerEvents: shattered ? 'auto' : 'none' }} 
      >
        {children}
      </motion.div>
    </div>
  );
};

export default BreakableGlass;
