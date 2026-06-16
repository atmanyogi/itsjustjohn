import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import { FaInstagram } from 'react-icons/fa';
import { BsMusicNoteBeamed } from 'react-icons/bs';

export default function CollabsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">Collaborations</h1>
        
        <div className="space-y-24">
          {/* DIG Project */}
          <section className="flex flex-col md:flex-row gap-12 items-center">
            {/* Art */}
            <div className="w-full md:w-1/2 max-w-xl">
              <div className="relative aspect-[5001/3734] w-full rounded-xl overflow-hidden shadow-2xl bg-zinc-900 hover:shadow-3xl transition-all duration-500">
                <Image
                  src="/DIGart.png"
                  alt="DIG - its.just.john X The WAVwriters"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            
            {/* Info */}
            <div className="w-full md:w-1/2 space-y-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-2">DIG</h2>
                <p className="text-xl text-indigo-400">by [its.just.john] X The WAVwriters</p>
              </div>
              
              <p className="text-gray-300 leading-relaxed text-lg">
                A sonic exploration into the depths of rhythm and frequency. 
                This collaborative project merges organic textures with synthetic pulses,live instruments, 
                 reggae, hip hop, jazz elements and lyrical depth. Beats created by DJ Scotty Doo and local hawaii 
                 keyboard legend Will Akaka. Creating a soundscape that digs beneath the surface of conventional beatmaking and sound.
               
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  href="/?play=dig#music-section" 
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold transition-all transform hover:-translate-y-1"
                >
                  <BsMusicNoteBeamed className="text-xl" />
                  Listen in Player
                </Link>
                
                <a 
                  href="https://www.instagram.com/djscottydoo/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-full font-bold transition-all border border-zinc-700"
                >
                  <FaInstagram className="text-xl" />
                  Instagram
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
