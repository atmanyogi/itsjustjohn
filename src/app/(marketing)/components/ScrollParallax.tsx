"use client";
import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollParallaxProps {
  children: ReactNode;
  dataDepth?: number;
}

export default function ScrollParallax({ children, dataDepth = 1 }: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (!ref.current || !isVisible) return;
      
      if (isMobile) {
        ref.current.style.transform = '';
        return;
      }
      
      // Reduce the intensity of the parallax effect
      const scrolled = window.scrollY;
      const translateY = scrolled * (dataDepth * 0.08); // Reduced from 0.15 to 0.08
      
      ref.current.style.transform = `translateY(${translateY}px)`;
      lastScrollY.current = scrolled;
      animationRef.current = null;
    };

    const handleScroll = () => {
      if (animationRef.current) return;
      animationRef.current = requestAnimationFrame(updatePosition);
    };

    if (isVisible) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Initial position
      updatePosition();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dataDepth, isVisible, isMobile]);

  return (
    <div
      ref={ref}
       className={isVisible ? "will-change-transform" : ""}
       data-depth={dataDepth}
       style={{ 
         // transition: 'transform 0.3s ease-out', // Removed CSS transition
         willChange: isVisible ? 'transform' : 'auto'
       }}
     >
      {children}
    </div>
  );
}
