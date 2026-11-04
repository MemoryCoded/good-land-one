import type { Photo } from "../types/photo";
import { getFullImageUrl } from "../utils/imageHelper";

export interface Collection {
  id: number;
  name: string;
  coverPhoto: string;
  photoCount: number;
  date: string;
}

export function useCollections(photos: Photo[]) {
  const grouped = photos.reduce(
    (acc, photo) => {
      if (!acc[photo.collection_id]) acc[photo.collection_id] = [];
      acc[photo.collection_id].push(photo);
      return acc;
    },
    {} as Record<number, Photo[]>,
  );

  const collections: Collection[] = Object.entries(grouped).map(
    ([id, photos]) => {
      const firstPhoto = photos[0];
      const rawDate = firstPhoto.date_taken || firstPhoto.uploaded_at;

      return {
        id: Number(id),
        name: firstPhoto.collection_name || `Collection ${id}`, // <-- USE REAL NAME
        coverPhoto: getFullImageUrl(firstPhoto.thumbnail_medium),
        photoCount: photos.length,
        date: new Date(rawDate).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      };
    },
  );

  return { collections, isLoading: false, isError: false };
}
