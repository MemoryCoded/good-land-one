import { MOCK_PHOTOS } from "../data/mockPhotos";

export interface Collection {
  id: number;
  name: string;
  coverPhoto: string;
  photoCount: number;
  date: string;
}

export function useCollections() {
  // 1. Group the mock photos by collection_id
  const grouped = MOCK_PHOTOS.reduce(
    (acc, photo) => {
      if (!acc[photo.collection_id]) acc[photo.collection_id] = [];
      acc[photo.collection_id].push(photo);
      return acc;
    },
    {} as Record<number, typeof MOCK_PHOTOS>,
  );

  // 2. Map them into Collection objects
  const collections: Collection[] = Object.entries(grouped).map(
    ([id, photos]) => {
      const firstPhoto = photos[0];
      const rawDate = firstPhoto.date_taken || firstPhoto.uploaded_at;

      return {
        id: Number(id),
        name:
          id === "1"
            ? "Droneshots"
            : id === "2"
              ? "Test Collection"
              : id === "3"
                ? "Landscapes"
                : id === "4"
                  ? "Natural World"
                  : id === "5"
                    ? "Sights"
                    : "Bridges",
        coverPhoto: firstPhoto.thumbnail_medium,
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
