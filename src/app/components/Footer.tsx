"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer className="relative w-full bg-zinc-950 text-white border-t border-white/10 z-70 overflow-hidden">
      {/* Decorative earthy accent line */}
      <div className="h-1 w-full bg-linear-to-r from-emerald-950 via-zinc-800 to-emerald-950 opacity-40"></div>
      
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-2xl font-extrabold tracking-wider hover:opacity-80 transition-opacity no-underline text-white"
            >
              [[its.just.john]]
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              HAWAII crafted human music, Beats and apparal. A creative space for creatives alike. Vibe with your boy,  Hawaii No Ka Oi
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://www.instagram.com/itsjustjohntho/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.youtube.com/@itsjustjohn-tho" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Cart & Commerce Links */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Merch & Sounds
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/#music-section" className="hover:text-white transition-colors no-underline">
                  Music Catalog
                </Link>
              </li>
              <li>
                <Link href="/#shop-section" className="hover:text-white transition-colors no-underline">
                  Gear & Shop
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors no-underline">
                  My Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors no-underline">
                  Stripe Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Site Navigation Map */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Explore Site
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href={isMobile ? "/#gallery-mobile" : "/#gallery-desktop"} className="hover:text-white transition-colors no-underline">
                  Gallery & Media
                </Link>
              </li>
              <li>
                <Link href="/#video-section" className="hover:text-white transition-colors no-underline">
                  Video Archive
                </Link>
              </li>
              <li>
                <Link href="/#extras-section" className="hover:text-white transition-colors no-underline">
                  Studio Extras
                </Link>
              </li>
              <li>
                <Link href="/#blog-section" className="hover:text-white transition-colors no-underline">
                  Personal Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Compliance Columns */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Legal & Shipping
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors no-underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors no-underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-white transition-colors no-underline">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors no-underline">
                  Shipping & Delivery
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider and bottom-most statutory LLC information display */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-xs text-gray-500">
          
          {/* Statutory LL Representation & Direct Contact info */}
          <div className="max-w-xl space-y-1">
            <p className="leading-relaxed">
              <span className="text-gray-300 font-medium">bruhitsjustjohn.com</span> is a brand of <span className="text-gray-300 font-medium">Fern Drip Creative Studio LLC</span>.
            </p>
            <p>
              Direct contact, business inquiries, and digital audio licensing:{" "}
              <a 
                href="mailto:aloha@bruhitsjustjohn.com" 
                className="text-emerald-400 hover:text-emerald-300 transition-colors no-underline font-medium"
              >
                aloha@bruhitsjustjohn.com
              </a>
            </p>
          </div>

          {/* Copyright text */}
          <div className="shrink-0 md:text-right">
            <p>© {currentYear} Fern Drip Creative Studio LLC. All rights reserved.</p>
            <p className="text-gray-600 mt-1">Sculpted organically, Mountain View, HI</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
