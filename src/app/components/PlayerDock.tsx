import React from 'react';
import { useAudioStore } from '../lib/audio';
import ExpandedPlayer from './ExpandedPlayer';
import MusicStorePortal from './commerce/MusicStorePortal';
import { Track } from '../lib/audio';
import tracks from '../data/tracks.json';

const PlayerDock: React.FC = () => {
  const currentTrackId = useAudioStore(state => state.currentTrackId);
  const isPlaying = useAudioStore(state => state.isPlaying);
  const play = useAudioStore(state => state.play);
  const pause = useAudioStore(state => state.pause);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isStoreOpen, setIsStoreOpen] = React.useState(false);

  // Find current track data
  const currentTrack = currentTrackId
    ? tracks.find((t: Track) => t.id === currentTrackId) || tracks[0]
    : tracks[0];

  if (!currentTrack) {
    return null; // Don't render if no track data available
  }

  return (
    <>
      <div
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-0 left-0 right-0 bg-neutral-800/80 backdrop-blur-md text-white p-4 shadow-lg cursor-pointer"
        style={{ WebkitBackdropFilter: 'blur(12px)' }} // For Safari
      >
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{currentTrack.title}</h3>
            <p className="text-sm text-neutral-300">{currentTrack.artist}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isPlaying) {
                pause();
              } else {
                play();
              }
            }}
            className="p-2 rounded-full hover:bg-neutral-700"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <ExpandedPlayer
          onClose={() => setIsExpanded(false)}
        />
      )}

      <MusicStorePortal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        currentTrackId={currentTrackId || undefined}
      />
    </>
  );
};

export default PlayerDock;
