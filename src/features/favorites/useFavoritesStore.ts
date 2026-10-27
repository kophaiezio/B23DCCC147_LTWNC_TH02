import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((state) => ({
        ids: state.ids.includes(id)
          ? state.ids.filter((favoriteId) => favoriteId !== id)
          : [...state.ids, id],
      })),
    }),
    {
      name: 'music-favorites',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);
