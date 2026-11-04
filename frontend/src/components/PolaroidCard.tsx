import type { Photo } from "../types/photo";
import { useGalleryStore } from "../store/useGalleryStore";
import { THEMES } from "../config/themes";
import { getFullImageUrl } from "../utils/imageHelper";

interface PolaroidCardProps {
  photo: Photo;
  onClick?: () => void;
  isViewB?: boolean;
}

export function PolaroidCard({
  photo,
  onClick,
  isViewB = false,
}: PolaroidCardProps) {
  const defaultPolaroidTheme = useGalleryStore(
    (state) => state.defaultPolaroidTheme,
  );

  const photoOverrides = useGalleryStore((state) => state.photoOverrides);
  const activeThemeName = photoOverrides[photo.id] || defaultPolaroidTheme;
  const theme = THEMES[activeThemeName];

  const imageUrl = isViewB
    ? getFullImageUrl(photo.thumbnail_large)
    : getFullImageUrl(photo.thumbnail_medium);

  return (
    <div
      onClick={onClick}
      style={{ boxShadow: theme.innerStyle }}
      className={`
        relative flex flex-col transition-all duration-300
        ${onClick ? "cursor-pointer hover:opacity-90" : ""}
        ${theme.base}
        ${theme.shadow}
        ${
          isViewB
            ? // FIXED: w-fit makes the card shrink-wrap the image.
              // max-w-[90vw] keeps it from overflowing on mobile.
              "w-fit max-w-[90vw] max-h-[80vh] p-3 pb-16"
            : "@container w-full rounded-sm p-2 pb-12 sm:pb-14"
        }
      `}
    >
      <img
        src={imageUrl}
        alt={photo.title || "Gallery photo"}
        // FIXED: max-h-[65vh] and w-auto makes the image scale naturally inside View B
        className={`object-contain ${
          isViewB ? "max-h-[65vh] w-auto mx-auto" : "w-full h-auto"
        }`}
        loading="lazy"
        draggable={false}
      />

      {/* Bottom Text Wrapper */}
      <div
        className={`
          absolute bottom-0 left-0 w-full flex justify-between items-center gap-2 overflow-hidden
          ${isViewB ? "px-4 pb-4" : "px-3 pb-4"}
        `}
      >
        <span
          className={`
            font-bold tracking-widest font-orbitron whitespace-nowrap min-w-0
            ${
              isViewB
                ? "text-sm sm:text-base"
                : "text-[clamp(0.1rem,4.5cqi,0.8rem)]"
            }
            ${theme.textPrimary}
          `}
        >
          {"Tablet " + (photo.collection_sort_order || 1)}.{photo.position}
        </span>

        <span
          className={`
            font-bold tracking-widest uppercase font-orbitron text-right whitespace-nowrap truncate min-w-0
            ${
              isViewB
                ? "text-xs sm:text-sm"
                : "text-[clamp(0.35rem,3.5cqi,0.7rem)]"
            }
            ${theme.textPrimary}
          `}
        >
          {photo.artist_name || "Artist Name"}
        </span>
      </div>
    </div>
  );
}
