"use client";

import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="hidden md:block fixed bottom-8 right-8 z-[120] bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 active:scale-95 border border-gray-300"
      aria-label="Scroll to top"
    >
      <FaArrowUp className="w-6 h-6" />
    </button>
  );
}
