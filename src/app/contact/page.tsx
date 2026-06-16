import React from 'react';

export default function ContactPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:px-12 bg-gradient-to-b from-[#e0e7ef] to-[#b6c6d6] dark:from-[#1a1a1a] dark:to-[#23272e]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">Contact</h1>
        <form
          className="rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-lg p-8 flex flex-col gap-6"
          // TODO: Connect to /api/contact and make plug-and-play for webhooks
        >
          <label className="flex flex-col text-left">
            <span className="font-semibold mb-1">Name</span>
            <input
              type="text"
              name="name"
              required
              className="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <label className="flex flex-col text-left">
            <span className="font-semibold mb-1">Email</span>
            <input
              type="email"
              name="email"
              required
              className="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <label className="flex flex-col text-left">
            <span className="font-semibold mb-1">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <button
            type="submit"
            className="mt-4 px-8 py-3 rounded-full bg-black text-white font-bold text-lg shadow-lg hover:bg-gray-800 transition"
          >
            Send Message
          </button>
          {/* TODO: Add success/error state, connect to API/webhook */}
        </form>
      </div>
    </main>
  );
}
