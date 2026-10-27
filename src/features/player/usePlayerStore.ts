import { create } from 'zustand';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
  seek: (position: number) => void;
}

const initialPlayback = {
  queue: [] as Song[],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
};

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  ...initialPlayback,
  playQueue: (songs, startIndex = 0) => {
    if (songs.length === 0 || !Number.isInteger(startIndex) || startIndex < 0 || startIndex >= songs.length) {
      set({ ...initialPlayback });
      return;
    }
    set({ queue: songs, currentIndex: startIndex, isPlaying: true, position: 0 });
  },
  togglePlay: () => set((state) => {
    if (state.currentIndex < 0 || state.currentIndex >= state.queue.length) return { isPlaying: false };
    return { isPlaying: !state.isPlaying };
  }),
  next: () => set((state) => {
    if (state.currentIndex < 0 || state.currentIndex >= state.queue.length) {
      return { isPlaying: false, position: 0 };
    }
    if (state.currentIndex >= state.queue.length - 1) return { isPlaying: false };
    return { currentIndex: state.currentIndex + 1, position: 0 };
  }),
  prev: () => set((state) => {
    if (state.currentIndex < 0 || state.currentIndex >= state.queue.length) {
      return { position: 0, isPlaying: false };
    }
    if (state.position > 3 || state.currentIndex === 0) return { position: 0 };
    return { currentIndex: state.currentIndex - 1, position: 0 };
  }),
  addToQueue: (song) => set((state) => (
    state.queue.some((queuedSong) => queuedSong.id === song.id)
      ? state
      : { queue: [...state.queue, song] }
  )),
  tick: () => {
    const state = get();
    const song = state.queue[state.currentIndex];
    if (!state.isPlaying || !song) return;
    if (state.position + 1 >= song.duration) {
      if (state.currentIndex === state.queue.length - 1) {
        set({ isPlaying: false, position: song.duration });
        return;
      }
      state.next();
      return;
    }
    set({ position: state.position + 1 });
  },
  seek: (position) => set((state) => {
    const song = state.queue[state.currentIndex];
    if (!song || !Number.isFinite(position)) return {};
    return { position: Math.min(song.duration, Math.max(0, position)) };
  }),
}));
