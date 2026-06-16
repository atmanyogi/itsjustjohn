// src/app/components/LightningVisualizer.tsx
// Web Audio FFT “lightning” effect
"use client";

import React, { useRef, useEffect } from 'react';
// import { useAudioStore } from '@/lib/audio'; // To get audio context or Howler instance

interface LightningVisualizerProps {
  className?: string;
}

const LightningVisualizer: React.FC<LightningVisualizerProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const { howlerInstance } = useAudioStore(); // Or however you access the audio source/context

  useEffect(() => {
    const canvas = canvasRef.current;
    // if (!canvas || !howlerInstance) return;
    if (!canvas) return; // Simplified for placeholder

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // const audioContext = Howler.ctx;
    // const analyser = audioContext.createAnalyser();
    // analyser.fftSize = 512; // Example FFT size

    // // Connect analyser (similar to SpectrumBars, needs careful handling with Howler)
    // // Howler.masterGain.connect(analyser); 

    // const bufferLength = analyser.frequencyBinCount;
    // const dataArray = new Uint8Array(bufferLength);

    let animationFrameId: number;

    const drawLightning = () => {
      // analyser.getByteFrequencyData(dataArray);
      // Mock data for placeholder
      const dataArray = new Uint8Array(256).map(() => Math.random() * 255);


      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Example: Draw a "lightning" strike if a high frequency peak is detected
      // This is a highly simplified representation. Real lightning is more complex.
      
      // Find a peak (simplified)
      let peakValue = 0;
      let peakIndex = 0;
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > peakValue) {
          peakValue = dataArray[i];
          peakIndex = i;
        }
      }

      if (peakValue > 200) { // Arbitrary threshold for "strike"
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0); // Start from top center
        
        // Create a jagged line towards the peak's position (mapped to x-axis)
        const targetX = (peakIndex / dataArray.length) * canvas.width;
        let currentY = 0;
        let currentX = canvas.width / 2;

        while(currentY < canvas.height) {
            const nextX = currentX + (Math.random() - 0.5) * 40; // Jaggedness
            const nextY = currentY + Math.random() * 30 + 10;
            ctx.lineTo(Math.max(0, Math.min(canvas.width, nextX)), nextY);
            currentX = nextX;
            currentY = nextY;
        }
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${peakValue / 255})`; // White, intensity based on peak
        ctx.lineWidth = Math.random() * 3 + 1;
        ctx.stroke();
      }
      
      animationFrameId = requestAnimationFrame(drawLightning);
    };

    drawLightning();

    return () => {
      cancelAnimationFrame(animationFrameId);
      // if (Howler.masterGain && analyser) { // Disconnect analyser
      //   Howler.masterGain.disconnect(analyser);
      // }
    };
  // }, [howlerInstance]);
  }, []); // Empty dependency for placeholder

  return <canvas ref={canvasRef} className={className} width="300" height="100" />;
};

export default LightningVisualizer;
