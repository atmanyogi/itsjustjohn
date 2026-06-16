"use client";

import React, { useState } from 'react';

interface TouchPointProps {
  top: string | number;
  left: string | number;
  title: React.ReactNode;
  onClick?: () => void;
  className?: string; // Allow minimal styling override
}

const TouchPoint: React.FC<TouchPointProps> = ({ top, left, title, onClick, className }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine tooltip horizontal alignment based on touchpoint's coordinate placement to prevent clipping
  let alignmentClass = "left-1/2 transform -translate-x-1/2";
  let arrowClass = "left-1/2 transform -translate-x-1/2";

  if (typeof left === 'string' && left.endsWith('%')) {
    const pct = parseFloat(left);
    if (pct > 75) {
      // Align to the right edge of screen/card (shifts tooltip body left)
      alignmentClass = "right-[4px] translate-x-4";
      arrowClass = "right-[12px]";
    } else if (pct < 25) {
      // Align to the left edge of screen/card (shifts tooltip body right)
      alignmentClass = "left-[4px] -translate-x-4";
      arrowClass = "left-[12px]";
    }
  }

  return (
    <div
      className={`absolute w-8 h-8 z-50 cursor-pointer group ${className || ''}`}
      style={{ top, left, transform: 'translate(-50%, -50%)' }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
        setShowTooltip(!showTooltip);
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Pulsing visual */}
      <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)]"></div>

      {/* Tooltip Wrapper with transparent bridge area */}
      {showTooltip && title && (
        <div 
          className={`absolute bottom-[24px] pb-3.5 z-[9999] pointer-events-auto cursor-default animate-in fade-in zoom-in duration-200 ${alignmentClass}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={(e) => e.stopPropagation()} // Prevent closing modal when tapping tooltip
        >
          <div className="relative bg-zinc-950/95 backdrop-blur-lg text-white text-sm py-4 px-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.85)] w-80 max-w-[88vw] whitespace-pre-line break-words border border-white/10">
            <div className="font-medium text-center leading-relaxed text-white select-text">
              {title}
            </div>
            {/* Arrow */}
            <div className={`absolute top-[calc(100%-1px)] border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-zinc-950 ${arrowClass}`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouchPoint;
