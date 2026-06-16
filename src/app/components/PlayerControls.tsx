// src/app/components/PlayerControls.tsx
// Play/Pause, prev/next, seek bar
"use client";

import React, { useCallback, memo, useMemo, useRef, useEffect } from 'react';
import { useAudioStore } from '../lib/audio'; // Import Zustand store for Howler

interface PlayerControlsProps {
  className?: string;
}


// Use memo to prevent unnecessary re-renders
const PlayerControls = memo(function PlayerControls({ className }: PlayerControlsProps) {
  // Get state from the store using more selective selectors
  const isPlaying = useAudioStore(state => state.isPlaying);
  const currentTrackId = useAudioStore(state => state.currentTrackId);
  const duration = useAudioStore(state => state.duration);
  const position = useAudioStore(state => state.position);
  const volume = useAudioStore(state => state.volume);
  
  // Get store API directly to avoid re-renders
  const audioStore = useAudioStore;
  
  // Use refs to store actions to avoid re-renders
  const playRef = useRef(audioStore.getState().play);
  const pauseRef = useRef(audioStore.getState().pause);
  const nextRef = useRef(audioStore.getState().next);
  const prevRef = useRef(audioStore.getState().prev);
  const seekRef = useRef(audioStore.getState().seek);
  const setVolumeRef = useRef(audioStore.getState().setVolume);
  
  // Update refs when store changes
  useEffect(() => {
    const unsubscribe = audioStore.subscribe((state) => {
      playRef.current = state.play;
      pauseRef.current = state.pause;
      nextRef.current = state.next;
      prevRef.current = state.prev;
      seekRef.current = state.seek;
      setVolumeRef.current = state.setVolume;
    });
    
    return () => unsubscribe();
  }, [audioStore]);

  // Memoize the formatTime function
  const formatTime = useCallback((secs: number = 0) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleSeek = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    seekRef.current(parseFloat(event.target.value));
  }, [seekRef]);

  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeRef.current(parseFloat(event.target.value));
  }, [setVolumeRef]);
  
  // Memoize the formatted times
  const formattedPosition = useMemo(() => formatTime(position), [formatTime, position]);
  const formattedDuration = useMemo(() => formatTime(duration), [formatTime, duration]);

  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <div className="flex items-center justify-center space-x-4 mb-3">
        <button
          onClick={() => prevRef.current()}
          disabled={!currentTrackId}
          title="Previous Track"
          className="p-2 rounded-full hover:bg-white/30 disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => (isPlaying ? pauseRef.current() : playRef.current())}
          disabled={!currentTrackId}
          title={isPlaying ? "Pause" : "Play"}
          className="p-3 bg-accent text-black rounded-full hover:bg-opacity-80 disabled:opacity-50"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => nextRef.current()}
          disabled={!currentTrackId}
          title="Next Track"
          className="p-2 rounded-full hover:bg-white/30 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="flex items-center space-x-2 text-xs text-white/80 mb-3">
        <span>{formattedPosition}</span>
        <input 
          type="range" 
          min="0" 
          max={duration || 0} 
          value={position || 0} 
          onChange={handleSeek}
          disabled={!currentTrackId}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent"
          title="Seek"
        />
        <span>{formattedDuration}</span>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-xs text-white/80">
        <span>Vol</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={volume} 
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent"
          title="Volume"
        />
      </div>
    </div>
  );
});

// Add display name for debugging
PlayerControls.displayName = 'PlayerControls';

export default PlayerControls;
