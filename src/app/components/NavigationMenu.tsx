"use client";
import React, { useState, useEffect } from 'react';
import { BsFillCloudLightningRainFill } from "react-icons/bs";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id?: string) => {
    setIsOpen(false);
    
    if (id && pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Optional: Update URL hash without causing a jump
        window.history.pushState({}, '', `/#${id}`);
      }
    }
  };

  const menuItems = [
    { label: 'Gallery', id: isMobile ? undefined : 'gallery-desktop', href: isMobile ? '/gallery' : undefined, mobileOrder: 7, desktopOrder: 1 },
    { label: 'Music', id: isMobile ? undefined : 'music-section', href: isMobile ? '/music' : undefined, mobileOrder: 1, desktopOrder: 2 },
    { label: 'Shop', id: isMobile ? undefined : 'shop-section', href: isMobile ? '/shop' : undefined, mobileOrder: 2, desktopOrder: 3 },
    { label: 'Videos', id: isMobile ? undefined : 'video-section', href: isMobile ? '/videos' : undefined, mobileOrder: 3, desktopOrder: 4 },
    { label: 'Blog', id: isMobile ? undefined : 'blog-section', href: isMobile ? '/blog' : undefined, mobileOrder: 4, desktopOrder: 5 },
    { label: 'Extras', id: isMobile ? undefined : 'extras-section', href: isMobile ? '/extras' : undefined, mobileOrder: 5, desktopOrder: 6 },
    { label: 'Collabs', href: '/collabs', mobileOrder: 6, desktopOrder: 7 },
    { label: 'Design', href: 'https://SEDesignsHawaii.com', mobileOrder: 8, desktopOrder: 8, target: '_blank' },
    { label: 'Cart / Checkout', href: '/checkout', mobileOrder: 9, desktopOrder: 9 },
  ];

  // Temporarily hide Collabs and Design from frontend menu
  const visibleItems = menuItems.filter(item => !['Collabs', 'Design'].includes(item.label));

  // Sort items
  const sortedItems = [...visibleItems].sort((a, b) => {
    return isMobile ? a.mobileOrder - b.mobileOrder : a.desktopOrder - b.desktopOrder;
  });

  return (
    <nav className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none text-black transition-transform active:scale-95 p-2 rounded-full hover:bg-gray-100"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        <BsFillCloudLightningRainFill className="w-8 h-8" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <ul className="py-2">
              {sortedItems.map((item) => {
                // Determine the correct href
                const href = item.href || `/#${item.id}`;
                
                return (
                  <li key={item.label}>
                    <Link 
                      href={href}
                      target={item.target}
                      className="block w-full text-left px-6 py-3 text-gray-800 hover:bg-gray-100 hover:text-black font-medium transition-colors text-lg"
                      onClick={(e) => handleLinkClick(e, 'id' in item ? item.id : undefined)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}
