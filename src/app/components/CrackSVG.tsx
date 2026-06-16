// src/app/components/CrackSVG.tsx
"use client";

import React from 'react';
// import { motion } from 'framer-motion';

interface CrackSVGProps {
  animate: number; // Number of taps, to control animation
  className?: string;
}

// Example crack paths - these would be actual SVG path data
const crackPathsData = [
  { d: "M10 10 L50 50 L10 90", length: 113 }, // Example path and its pre-calculated length
  { d: "M50 10 L90 50 L50 90", length: 113 },
  { d: "M10 50 L90 50", length: 80 },
];

const CrackSVG: React.FC<CrackSVGProps> = ({ animate, className }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`absolute inset-0 w-full h-full z-30 pointer-events-none ${className}`}
      fill="none" 
      stroke="rgba(255,255,255,0.5)" // Crack color
      strokeWidth="1"
    >
      {/* {crackPathsData.map((path, index) => (
        <motion.path
          key={index}
          d={path.d}
          strokeDasharray={path.length}
          strokeDashoffset={path.length} // Start with dash offset to hide
          animate={{
            strokeDashoffset: animate > index ? 0 : path.length, // Animate to 0 if taps > index
          }}
          transition={{
            duration: 0.3,
            delay: index * 0.1, // Cascading effect
            ease: "easeInOut"
          }}
        />
      ))} */}
      {/* Placeholder visual if motion paths are commented out */}
      {animate > 0 && <line x1="10" y1="10" x2="90" y2="90" />}
      {animate > 1 && <line x1="90" y1="10" x2="10" y2="90" />}
      {animate > 2 && <line x1="50" y1="0" x2="50" y2="100" />}
    </svg>
  );
};

export default CrackSVG;
