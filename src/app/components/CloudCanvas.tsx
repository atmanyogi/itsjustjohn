// src/app/components/CloudCanvas.tsx
// R3F cloud shader (or simple canvas drift)
"use client";

import React, { useRef, useEffect } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

interface CloudCanvasProps {
  className?: string;
}

// Simple 2D Canvas drifting clouds for placeholder
const SimpleDriftingClouds: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; // Or parent height

    let clouds: { x: number, y: number, radius: number, speed: number }[] = [];
    function initClouds() {
      clouds = [];
      for (let i = 0; i < 10; i++) { // Number of clouds
        if (!canvas) continue;
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5, // Upper half
          radius: Math.random() * 50 + 30, // Cloud size
          speed: Math.random() * 0.2 + 0.05, // Cloud speed
        });
      }
    }
    initClouds();

    function drawCloud(cloud: typeof clouds[0]) {
      if(!ctx) return;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
      // More complex cloud shape could be drawn here by combining multiple arcs
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Semi-transparent white
      ctx.fill();
    }

    function animate() {
      if(!ctx) return;
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.radius > canvas.width) {
          cloud.x = -cloud.radius; // Reset cloud position
          cloud.y = Math.random() * canvas.height * 0.5;
        }
        drawCloud(cloud);
      });
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight; // Or parent height
        // initClouds(); // Removed to prevent cloud reset on mobile scroll/resize
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};


// Placeholder for R3F version if chosen later
// const R3FCloudScene = () => {
//   // Shader material, cloud geometry, lighting etc.
//   return (
//     <mesh>
//       <sphereGeometry args={[1, 32, 32]} />
//       <meshStandardMaterial color="lightblue" />
//     </mesh>
//   );
// };

const CloudCanvas: React.FC<CloudCanvasProps> = ({ className }) => {
  // For R3F version:
  // return (
  //   <div className={className}>
  //     <Canvas>
  //       <ambientLight intensity={0.5} />
  //       <R3FCloudScene />
  //     </Canvas>
  //   </div>
  // );

  // For simple 2D canvas version:
  return (
    <div className={className}>
      <SimpleDriftingClouds />
    </div>
  );
};

export default CloudCanvas;
