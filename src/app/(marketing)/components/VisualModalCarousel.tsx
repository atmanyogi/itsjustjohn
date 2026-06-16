"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface ModalItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  bgColor: string;
  textColor: string;
  imageClassName?: string;
}

const modalItems: ModalItem[] = [
  {
    id: 1,
    title: "",
    subtitle: "",
    description: "",
    image: "/audio/aloha.png",
    bgColor: "bg-black",
    textColor: "text-white",
    imageClassName: "object-cover opacity-80 brightness-125 saturate-110"
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    description: "",
    image: "/audio/LOGO.png",
    bgColor: "bg-black",
    textColor: "text-white",
    imageClassName: "object-cover opacity-80 brightness-125 saturate-110"
  },
  {
    id: 3,
    title: "",
    subtitle: "",
    description: "",
    image: "/audio/ferns.png",
    bgColor: "bg-black",
    textColor: "text-white",
    imageClassName: "object-cover opacity-80 brightness-125 saturate-110"
  },
  {
    id: 4,
    title: "",
    subtitle: "",
    description: "",
    image: "/audio/Right For me.png",
    bgColor: "bg-black",
    textColor: "text-white",
    imageClassName: "object-cover opacity-80 brightness-125 saturate-110"
  },
  {
    id: 5,
    title: "",
    subtitle: "",
    description: "",
    image: "/audio/disco.png",
    bgColor: "bg-black",
    textColor: "text-white",
    imageClassName: "object-cover opacity-80 brightness-125 saturate-110"
  }
];

const VisualModalCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null);
  const [cols, setCols] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Window resize observer to determine columns
  useEffect(() => {
    const handleResize = () => {
      setCols(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality (optional) - disabled on mobile columns to prevent background thread wakeups
  useEffect(() => {
    if (cols === 1) return;
    const autoPlayInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (modalItems.length - cols + 1));
    }, 8000);

    return () => {
      clearInterval(autoPlayInterval);
    };
  }, [cols]);

  // Handle keyboard navigation for both carousel and modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpen) {
        // Modal navigation
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const currentIdx = modalItems.findIndex(item => item.id === selectedItem?.id) || 0;
          const prevIdx = currentIdx > 0 ? currentIdx - 1 : modalItems.length - 1;
          setSelectedItem(modalItems[prevIdx]);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const currentIdx = modalItems.findIndex(item => item.id === selectedItem?.id) || 0;
          const nextIdx = currentIdx < modalItems.length - 1 ? currentIdx + 1 : 0;
          setSelectedItem(modalItems[nextIdx]);
        }
      } else if (carouselRef.current?.contains(document.activeElement)) {
        // Carousel navigation (only when carousel is focused)
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, selectedItem]);

  const scrollToIndex = (index: number) => {
    const maxIdx = modalItems.length - cols;
    if (index < 0) {
      setCurrentIndex(maxIdx);
    } else if (index > maxIdx) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    scrollToIndex(currentIndex + 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const openModal = (item: ModalItem) => {
    setSelectedItem(item);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };



  return (
    <div className="relative w-full py-16" style={{ zIndex: 10, position: 'relative' }} role="region" aria-label="Nature sound explorations carousel">
      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black backdrop-blur-md border border-black rounded-full p-3 hover:bg-black/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black"
        aria-label="Previous modal"
      >
        <ChevronLeftIcon className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black backdrop-blur-md border border-black rounded-full p-3 hover:bg-black/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black"
        aria-label="Next modal"
      >
        <ChevronRightIcon className="w-6 h-6 text-white" />
      </button>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative w-full max-w-7xl mx-auto overflow-hidden"
        onKeyDown={handleKeyPress}
        tabIndex={0}
        role="tablist"
      >
        <div
          className="flex transition-transform duration-700 ease-out w-full"
          style={{
            transform: `translateX(-${currentIndex * (100 / cols)}%)`
          }}
        >
          {modalItems.map((item, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + cols;
            // Only render card image if it is active, previous, or next to prevent massive memory footprint on mobile
            const shouldRenderImage = index >= currentIndex - 1 && index <= currentIndex + cols;

            return (
              <div
                key={item.id}
                className={`shrink-0 p-6 ${cols === 1 ? 'w-full' : 'w-1/3'} ${
                  isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } transition-opacity duration-300 cursor-pointer`}
                role="tabpanel"
                aria-labelledby={`modal-${item.id}`}
                onClick={() => openModal(item)}
              >
                <div
                  className={`relative h-96 ${item.bgColor} rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:shadow-3xl transition-shadow duration-300`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {shouldRenderImage && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className={item.imageClassName || "object-cover opacity-40"}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading={index === currentIndex ? "eager" : "lazy"}
                      />
                    )}
                    <div className="absolute inset-0 bg-linear-to-br from-black/20 via-transparent to-black/30" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-8">
                    <div className={item.textColor}>
                      <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm opacity-90 mb-4">{item.subtitle}</p>
                      <p className="text-sm leading-relaxed opacity-80 max-w-prose">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center mt-8 space-x-2" role="tablist">
        {Array.from({ length: modalItems.length - cols + 1 }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'bg-white shadow-lg scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
            role="tab"
            aria-selected={i === currentIndex}
          />
        ))}
      </div>

      {/* Full Screen Modal - Rendered via Portal */}
      {modalOpen && selectedItem &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 999999999 }}
            onClick={closeModal}
          >
            {/* Modal Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Update selected item to previous
                const currentIdx = modalItems.findIndex(item => item.id === selectedItem?.id) || 0;
                const prevIdx = currentIdx > 0 ? currentIdx - 1 : modalItems.length - 1;
                setSelectedItem(modalItems[prevIdx]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 backdrop-blur-md border border-white/20 rounded-full p-4 hover:bg-black/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Previous modal in fullscreen"
            >
              <ChevronLeftIcon className="w-8 h-8 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                // Update selected item to next
                const currentIdx = modalItems.findIndex(item => item.id === selectedItem?.id) || 0;
                const nextIdx = currentIdx < modalItems.length - 1 ? currentIdx + 1 : 0;
                setSelectedItem(modalItems[nextIdx]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 backdrop-blur-md border border-white/20 rounded-full p-4 hover:bg-black/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Next modal in fullscreen"
            >
              <ChevronRightIcon className="w-8 h-8 text-white" />
            </button>

            {/* X Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-gray-300 transition-all duration-200 z-30 w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 shadow-lg"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Modal Content - Full Browser Page Size */}
            <div
              className="w-screen h-screen overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-black w-full h-full overflow-hidden">
                {/* Modal Image - Full Screen (Constrained, zoomed-out, and optimized for mobile screens) */}
                <div className="relative h-full w-full max-w-lg mx-auto md:max-w-none">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 80vw, 1920px"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/30" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-16 text-white hidden md:block">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">{selectedItem.title}</h2>
                    <h3 className="text-2xl md:text-4xl opacity-80 mb-6">{selectedItem.subtitle}</h3>
                    <p className="text-lg md:text-xl leading-relaxed opacity-90 max-w-5xl">
                      {selectedItem.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
};

export default VisualModalCarousel;
