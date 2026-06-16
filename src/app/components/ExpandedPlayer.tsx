// src/app/components/ExpandedPlayer.tsx
// Slide-up sheet with queue, spectrum, lyrics tab
"use client";

import React from 'react';
// import { motion } from 'framer-motion';
// import { useAudioStore } from '@/lib/audio';
// import TrackCoverReactive from './TrackCoverReactive';
// import SpectrumBars from './SpectrumBars';
// import ChatWidget from './ChatWidget';
// import dynamic from 'next/dynamic'; // For MDX lyrics

// Tabs could be: 'Queue', 'Lyrics', 'Chat'
// type TabName = 'Queue' | 'Lyrics' | 'Chat';

interface ExpandedPlayerProps {
  onClose: () => void;
}

const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({ onClose }) => {
  // const { currentTrack } = useAudioStore();
  // const [activeTab, setActiveTab] = React.useState<TabName>('Lyrics');

  // const LyricsComponent = React.useMemo(() => {
  //   if (currentTrack?.lyricMdxPath) {
  //     return dynamic(() => import(`@/../${currentTrack.lyricMdxPath.startsWith('/') ? currentTrack.lyricMdxPath.substring(1) : currentTrack.lyricMdxPath}`));
  //   }
  //   return () => <p>No lyrics available for this track.</p>;
  // }, [currentTrack?.lyricMdxPath]);

  return (
    // <motion.div
    //   initial={{ y: "100%" }}
    //   animate={{ y: 0 }}
    //   exit={{ y: "100%" }}
    //   transition={{ type: "spring", stiffness: 300, damping: 30 }}
    //   className="fixed inset-0 bg-neutral-900 text-white z-50 overflow-y-auto"
    // >
    //   <button onClick={onClose} className="absolute top-4 right-4 p-2">Close</button>
    //   <div className="container mx-auto p-4 pt-12">
    //     {currentTrack && (
    //       <>
    //         <TrackCoverReactive track={currentTrack} />
    //         <SpectrumBars />
    //         <h2 className="text-2xl font-bold mt-4">{currentTrack.title}</h2>
    //         <p className="text-lg text-neutral-400">{currentTrack.artist}</p>
    //       </>
    //     )}
        
    //     {/* Tab Navigation */}
    //     <div className="my-4 flex space-x-2 border-b border-neutral-700">
    //       {/* Tabs here */}
    //     </div>

    //     {/* Tab Content */}
    //     <div>
    //       {activeTab === 'Lyrics' && <LyricsComponent />}
    //       {activeTab === 'Chat' && currentTrack && <ChatWidget trackId={currentTrack.id} />}
    //       {/* Queue content */}
    //     </div>
    //   </div>
    // </motion.div>
    <div>Expanded Player Placeholder</div>
  );
};

export default ExpandedPlayer;
