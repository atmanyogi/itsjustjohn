"use client";

import React from 'react';
import Header from '../components/Header';
import LandingMusicSection from '../components/LandingMusicSection';

export default function MusicPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col justify-start">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <LandingMusicSection />
      </div>
    </main>
  );
}
