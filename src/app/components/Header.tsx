"use client";

import React from 'react';
import Link from 'next/link';
import NavigationMenu from './NavigationMenu';

export default function Header() {
  return (
    <header className="relative z-99999 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-2xl font-bold cursor-pointer text-black no-underline hover:text-gray-800 transition-colors"
        >
          [[its.just.john]]
        </Link>
        <NavigationMenu />
      </div>
    </header>
  );
}
