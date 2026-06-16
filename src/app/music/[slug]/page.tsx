import React from 'react';

interface TrackPageProps {
  params: { slug: string };
}

export default function TrackPage({ params }: TrackPageProps) {
  const { slug } = params;
  return (
    <main className="min-h-screen py-16 px-4 md:px-12 bg-gradient-to-b from-[#e0e7ef] to-[#b6c6d6] dark:from-[#1a1a1a] dark:to-[#23272e]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>
        {/* TODO: Fetch track details, lyrics, and display AI-generated liner notes */}
        <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-lg p-8">
          <span className="text-gray-400 dark:text-gray-600 text-lg mb-4 block">
            [Track Detail & Liner Notes Placeholder]
          </span>
        </div>
      </div>
    </main>
  );
}
