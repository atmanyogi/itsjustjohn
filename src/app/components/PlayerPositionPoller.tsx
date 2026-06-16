"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "../lib/audio";

/**
 * This component polls the audio position without causing re-renders
 * It uses a direct store subscription instead of hooks to avoid the infinite loop
 */
export default function PlayerPositionPoller() {
  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(false);
  // Use a ref to store the interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Use a ref to store the unsubscribe function
  const unsubscribeRef = useRef<() => void | null>(() => null);

  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;
    
    // Get the store API directly
    const store = useAudioStore;
    
    // Set up the interval only once
    intervalRef.current = setInterval(() => {
      // Only update if the component is still mounted
      if (isMountedRef.current) {
        // Get current state directly from the store
        const state = store.getState();
        
        // Only update position if playing and howl exists
        if (state.isPlaying && state.howl) {
          // Call the action directly without causing re-renders
          state.updatePosition();
        }
      }
    }, 500); // Increased interval to reduce update frequency

    // Clean up function
    return () => {
      // Mark as unmounted
      isMountedRef.current = false;
      
      // Clear the interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Unsubscribe from the store
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return null;
}
