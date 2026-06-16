import React from 'react';

export default function AboutPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:px-12 bg-gradient-to-b from-[#e0e7ef] to-[#b6c6d6] dark:from-[#1a1a1a] dark:to-[#23272e]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">About</h1>
        {/* TODO: Add artist bio, project context, and visual motif */}
        <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-lg p-8">
          <span className="text-gray-400 dark:text-gray-600 text-lg mb-4 block">
            [Artist Bio & Project Context Placeholder]
          </span>
        </div>
      </div>
    </main>
  );
}
