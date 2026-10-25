import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "white-matte" | "grey-metallic";
export type PageTheme = "Light" | "Dark";

interface GalleryState {
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;

  pageTheme: PageTheme;
  togglePageTheme: () => void;

  defaultPolaroidTheme: ThemeName;
  toggleDefaultPolaroidTheme: () => void;

  photoOverrides: Record<number, ThemeName>;
  togglePhotoTheme: (photoId: number) => void;

  // NEW: Add the reset function to the blueprint
  resetThemes: () => void;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      zoomLevel: 3,
      zoomIn: () =>
        set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 1, 5) })),
      zoomOut: () =>
        set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 1, 1) })),

      pageTheme: "Light",
      togglePageTheme: () =>
        set((state) => ({
          pageTheme: state.pageTheme === "Light" ? "Dark" : "Light",
        })),

      defaultPolaroidTheme: "white-matte",
      toggleDefaultPolaroidTheme: () =>
        set((state) => ({
          defaultPolaroidTheme:
            state.defaultPolaroidTheme === "white-matte"
              ? "grey-metallic"
              : "white-matte",
        })),

      photoOverrides: {},
      togglePhotoTheme: (photoId) =>
        set((state) => {
          const currentTheme =
            state.photoOverrides[photoId] || state.defaultPolaroidTheme;
          const newTheme =
            currentTheme === "white-matte" ? "grey-metallic" : "white-matte";

          return {
            photoOverrides: {
              ...state.photoOverrides,
              [photoId]: newTheme,
            },
          };
        }),

      // NEW: The Reset Logic
      resetThemes: () =>
        set({
          pageTheme: "Light",
          defaultPolaroidTheme: "white-matte",
          photoOverrides: {}, // Empties the notebook completely
        }),
    }),
    { name: "gallery-zoom-storage" },
  ),
);
