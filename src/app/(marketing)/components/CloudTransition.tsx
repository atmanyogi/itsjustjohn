"use client";
import { motion, useAnimationControls } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export default function CloudTransition() {
  // Animation controls for each cloud
  const leftCloudControls = useAnimationControls();
  const centerCloudControls = useAnimationControls();
  const rightCloudControls = useAnimationControls();
  
  // State to track if we're on mobile or desktop
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive design using high-performance matchMedia to avoid resize thrashing on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Start animations on component mount
  useEffect(() => {
    const startAnimations = async () => {
      // Reset any running animations first to prevent overlapping triggers
      leftCloudControls.stop();
      centerCloudControls.stop();
      rightCloudControls.stop();

      // Initial slide-in animations
      await Promise.all([
        leftCloudControls.start({ x: 0, opacity: 1, transition: { duration: 0.8 } }),
        centerCloudControls.start({ y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.2 } }),
        rightCloudControls.start({ x: 0, opacity: 1, transition: { duration: 0.8, delay: 0.1 } })
      ]);

      // Start continuous pulse and sway animations
      leftCloudControls.start({
        scale: [1, 1.05, 1],
        x: [0, -5, 5, -5, 0],
        transition: {
          scale: { duration: 3, repeat: Infinity, repeatType: "reverse" },
          x: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }
      });
      
      centerCloudControls.start({
        scale: [1, 1.05, 1],
        y: [0, -3, 3, -3, 0],
        transition: {
          scale: { duration: 3.5, repeat: Infinity, repeatType: "reverse" },
          y: { duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }
      });
      
      rightCloudControls.start({
        scale: [1, 1.05, 1],
        x: [0, 5, -5, 5, 0],
        transition: {
          scale: { duration: 2.5, repeat: Infinity, repeatType: "reverse" },
          x: { duration: 5.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }
      });
    };

    startAnimations();
  }, [leftCloudControls, centerCloudControls, rightCloudControls, isMobile]);

  return (
    <div className="absolute w-full" style={{
      // Position to cover the transition line between lid and condensation
      top: isMobile ? "-250px" : "-2500px", // Brought clouds down additional 2/3 page on mobile
      left: 0,
      right: 0,
      height: "400px", // Maintained height for coverage
      zIndex: 50, // Further increased z-index to ensure visibility above all elements
      pointerEvents: "none" // Allow clicks to pass through
    }}>
      {/* Left cloud slides in from left */}
      <motion.img
        src="/cloudleft2.png"
        alt="Cloud Left"
        className="absolute left-0 w-3/4 md:w-5/6 max-w-3xl md:max-w-5xl" // Adjusted desktop size
        initial={{ x: -100, opacity: 0 }}
        animate={leftCloudControls}
        style={{ 
          pointerEvents: "none", // Prevent mouse/finger interactions
          filter: isMobile ? "none" : "drop-shadow(0 0 20px rgba(255,255,255,0.6))", // Enhanced glow effect on desktop
          top: isMobile ? "30px" : "50px" // Responsive positioning
        }}
      />
      
      {/* Center cloud slides up from bottom */}
      <motion.img
        src="/cloudcenter1.png"
        alt="Cloud Center"
        className="absolute left-1/2 transform -translate-x-1/2 w-full md:w-full max-w-4xl md:max-w-6xl" // Adjusted desktop size
        initial={{ y: 100, opacity: 0 }}
        animate={centerCloudControls}
        style={{ 
          pointerEvents: "none", // Prevent mouse/finger interactions
          filter: isMobile ? "none" : "drop-shadow(0 0 20px rgba(255,255,255,0.6))", // Enhanced glow effect on desktop
          top: isMobile ? "40px" : "70px" // Responsive positioning
        }}
      />
      
      {/* Right cloud slides in from right */}
      <motion.img
        src="/cloudright2.png"
        alt="Cloud Right"
        className="absolute right-0 w-3/4 md:w-4/5 max-w-3xl md:max-w-4xl" // Adjusted desktop size
        initial={{ x: 100, opacity: 0 }}
        animate={rightCloudControls}
        style={{ 
          pointerEvents: "none", // Prevent mouse/finger interactions
          filter: isMobile ? "none" : "drop-shadow(0 0 20px rgba(255,255,255,0.6))", // Enhanced glow effect on desktop
          top: isMobile ? "35px" : "60px" // Responsive positioning
        }}
      />
    </div>
  );
}
