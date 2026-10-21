import type { Photo } from "../types/photo";

// This handles the layout and clicking a photo.
interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  //1.  Placeholder image logic
  const getPlaceholderUrl = (id: number) =>
    `https://picsum.photos/seed/${id}/800/600`;

  // 2. Duplicate photos for visual testing (since DB has only 1)
  const displayPhotos =
    photos.length > 0
      ? [
          ...photos,
          ...photos,
          ...photos,
          ...photos,
          ...photos,
          ...photos,
          ...photos,
        ]
      : [];

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-8 max-w-7xl mx-auto">
      {displayPhotos.map((photo, index) => (
        <div
          key={`${photo.id}-${index}`}
          className="break-inside-avoid mb-4 cursor-pointer hover:opacity-80
                    transition-opacity duration-200"
          onClick={() => onPhotoClick(photo)}
        >
          <img
            src={getPlaceholderUrl(photo.id)}
            alt={photo.title || "Gallery Photo"}
            className="w-full h-auto rounded-md shadow-sm bg-zinc-200"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
