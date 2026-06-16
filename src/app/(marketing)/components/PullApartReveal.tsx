"use client";

import React, { useEffect, useRef } from "react";
import BlogModalContent from "@/app/(marketing)/components/BlogModalContent";

interface PullApartRevealProps {
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  animationDuration?: number;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function PullApartReveal({
  isOpen,
  onOpen,
  onClose,
  animationDuration = 800,
  children,
  className = "",
  id,
}: PullApartRevealProps) {
  const leftHandRef = useRef<HTMLImageElement | null>(null);
  const rightHandRef = useRef<HTMLImageElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Prevent modal click from closing modal (stop propagation)
  const onModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Debug toggle to render hands without animation or positioning
  const debugNoAnimation = false; // Set to true to isolate hand images for testing

  if (debugNoAnimation) {
    return (
      <div
        className="relative w-full h-screen overflow-hidden bg-black flex justify-between items-center px-4"
        style={{ zIndex: 99999, border: "4px solid red", position: "relative" }}
      >
        <img
          src="/stay2.png"
          alt="Test Left"
          style={{
            width: 200,
            zIndex: 100000,
            border: "4px solid blue",
            position: "relative",
            display: "block",
            opacity: 1,
            visibility: "visible",
          }}
          draggable={false}
          onClick={() => onClose?.()}
        />
        <img
          src="/leave3.png"
          alt="Test Right"
          style={{
            width: 200,
            zIndex: 100000,
            border: "4px solid green",
            position: "relative",
            display: "block",
            opacity: 1,
            visibility: "visible",
          }}
          draggable={false}
          onClick={() => onClose?.()}
        />
      </div>
    );
  }

  return (
    <div id={id} className={`relative w-full h-screen overflow-hidden bg-transparent pointer-events-none ${className}`}>
      {/* Left hand - stay2.png */}
      <img
        ref={leftHandRef}
        src="/stay2.png"
        alt="Left hand"
        draggable={false}
        className={`
          absolute top-1/2 left-0 transform -translate-y-1/2
          z-40
          cursor-pointer
          pointer-events-auto
          select-none
          ${isOpen ? "-translate-x-[70%]" : "translate-x-0"}
        `}
        style={{ width: "62.4%", transitionProperty: "transform", transitionDuration: `${animationDuration}ms`, transitionTimingFunction: "ease-in-out" }}
        onClick={() => {
          onOpen?.();
        }}
      />

      {/* Right hand - leave3.png */}
      <img
        ref={rightHandRef}
        src="/leave3.png"
        alt="Right hand"
        draggable={false}
        className={`
          absolute top-1/2 right-0 transform -translate-y-1/2
          z-40
          cursor-pointer
          pointer-events-auto
          select-none
          ${isOpen ? "translate-x-[70%]" : "translate-x-0"}
        `}
        style={{ width: "62.4%", transitionProperty: "transform", transitionDuration: `${animationDuration}ms`, transitionTimingFunction: "ease-in-out" }}
        onClick={() => {
          onOpen?.();
        }}
      />

      {/* Modal viewport */}
      <div
        ref={modalRef}
        className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-black shadow-lg p-6
          z-30
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
          max-w-full max-h-full w-full h-full
          cursor-default
          pointer-events-auto
          overflow-y-auto
          flex flex-col
        `}
        style={{ transition: `opacity ${animationDuration}ms ease-in-out, transform ${animationDuration}ms ease-in-out`, willChange: "opacity, transform" }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        onClick={() => onClose?.()}
      >
        <div onClick={(e) => e.stopPropagation()} className="grow overflow-y-auto">
          {isOpen && <BlogModalContent onClose={onClose ?? (() => {})} />}
        </div>
      </div>
    </div>
  );
}
