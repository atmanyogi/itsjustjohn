// src/app/lib/audio.ts
import { Howl, Howler } from 'howler';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Track {
  id: string;
  slug: string;
  title: string;
  artist: string;
  length: string;
  priceCents: number;
  cover: string;
  audioSrc: string;
  lyricMdxPath?: string;
}

interface AudioState {
  currentTrackId: string | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  howl: Howl | null;
  position: number; // current playback position in seconds
  duration: number; // current track duration in seconds

  // Actions
  setQueue: (tracks: Track[]) => void;
  setTrackById: (id: string) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  prev: () => void;
  updatePosition: () => void;
  unload: () => void;
  hydrateState: () => boolean;
}

export const useAudioStore = create<AudioState>()(
  subscribeWithSelector((set, get) => ({
    currentTrackId: null,
    queue: [],
    isPlaying: false,
    volume: 1.0,
    howl: null,
    position: 0,
    duration: 0,

    setQueue: (tracks) => {
      const currentTrackId = tracks.length > 0 ? tracks[0].id : null;
      const currentHowl = get().howl;
      if (currentHowl) {
        currentHowl.unload();
      }
      set({ queue: tracks, currentTrackId, position: 0, duration: 0, isPlaying: false, howl: null });
      if (tracks.length > 0) {
        get().setTrackById(tracks[0].id);
      }
    },

    setTrackById: (id) => {
      const { queue, howl } = get();
      const track = queue.find(t => t.id === id);
      if (!track) return;

      if (howl) {
        howl.unload();
      }

      const newHowl = new Howl({
        src: [track.audioSrc],
        html5: true,
        volume: get().volume,
      onplay: () => {
        set({ isPlaying: true, duration: newHowl.duration() });
      },
        onpause: () => set({ isPlaying: false }),
        onstop: () => set({ isPlaying: false, position: 0 }),
        onend: () => {
          set({ isPlaying: false, position: 0 });
          get().next();
        },
        onloaderror: (id, err) => {
          console.error("Audio load error:", err);
        },
        onplayerror: (id, err) => {
          console.error("Audio play error:", err);
        }
      });

      set({ currentTrackId: id, howl: newHowl, position: 0, duration: 0, isPlaying: false });
    },

    play: () => {
      const { howl, isPlaying } = get();
      if (howl && !isPlaying) {
        howl.play();
      }
    },

    pause: () => {
      const { howl, isPlaying } = get();
      if (howl && isPlaying) {
        howl.pause();
      }
    },

    stop: () => {
      const { howl } = get();
      if (howl) {
        howl.stop();
      }
    },

    seek: (seconds) => {
      const { howl } = get();
      if (howl) {
        howl.seek(seconds);
        set({ position: seconds });
      }
    },

    setVolume: (volume) => {
      const { howl } = get();
      Howler.volume(volume);
      if (howl) {
        howl.volume(volume);
      }
      set({ volume });
    },

    next: () => {
      const { queue, currentTrackId } = get();
      if (!currentTrackId) return;
      const currentIndex = queue.findIndex(t => t.id === currentTrackId);
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + 1) % queue.length;
      get().setTrackById(queue[nextIndex].id);
      get().play();
    },

    prev: () => {
      const { queue, currentTrackId } = get();
      if (!currentTrackId) return;
      const currentIndex = queue.findIndex(t => t.id === currentTrackId);
      if (currentIndex === -1) return;
      const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
      get().setTrackById(queue[prevIndex].id);
      get().play();
    },

    updatePosition: () => {
      const { howl, isPlaying } = get();
      if (howl && isPlaying) {
        const pos = howl.seek() as number;
        // Update position without triggering seek functionality
        // This prevents the infinite loop by directly setting state
        set({ position: pos });
      }
    },

    unload: () => {
      const { howl } = get();
      if (howl) {
        howl.unload();
        set({ howl: null, isPlaying: false, position: 0, duration: 0, currentTrackId: null });
      }
    },

    hydrateState: () => {
      if (typeof window === "undefined") return false;
      try {
        const saved = localStorage.getItem("ijj_audio_state");
        if (!saved) return false;
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.queue) && parsed.queue.length > 0) {
          // Set queue and track without playing automatically (to comply with browser autonomy)
          set({ queue: parsed.queue });
          if (parsed.currentTrackId) {
            get().setTrackById(parsed.currentTrackId);
          }
          if (parsed.volume !== undefined) {
            get().setVolume(parsed.volume);
          }
          return true;
        }
      } catch (e) {
        console.error("Failed to hydrate audio state", e);
      }
      return false;
    }
  }))
);

// Subscribe to state changes and preserve them in localStorage if in client environment
if (typeof window !== "undefined") {
  useAudioStore.subscribe(
    (state) => ({
      currentTrackId: state.currentTrackId,
      queue: state.queue,
      volume: state.volume,
    }),
    (data) => {
      try {
        localStorage.setItem("ijj_audio_state", JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save audio state to localStorage", e);
      }
    }
  );
}
