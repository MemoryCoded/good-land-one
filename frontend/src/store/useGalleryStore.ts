import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GalleryState {
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      zoomLevel: 3,
      setZoomLevel: (level) =>
        set({ zoomLevel: Math.min(Math.max(level, 1), 5) }),
      zoomIn: () =>
        set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 1, 5) })),
      zoomOut: () =>
        set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 1, 1) })),
    }),
    { name: "gallery-zoom-storage" },
  ),
);
