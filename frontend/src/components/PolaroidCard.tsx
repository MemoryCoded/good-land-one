import type { Photo } from "../types/photo";
import { useGalleryStore } from "../store/useGalleryStore"; // Import store
import { THEMES } from "../config/themes"; // Import themes

interface PolaroidCardProps {
  photo: Photo;
  onClick?: () => void;
  isViewB?: boolean;
}

const getPlaceholderUrl = (id: number, size: "small" | "large") => {
  const height = size === "large" ? 1200 : 800;
  return `https://picsum.photos/seed/${id}/${height}/600`;
};

export function PolaroidCard({
  photo,
  onClick,
  isViewB = false,
}: PolaroidCardProps) {
  // Grab the default theme and the overrides dictionary from Zustand
  const defaultPolaroidTheme = useGalleryStore(
    (state) => state.defaultPolaroidTheme,
  );

  const photoOverrides = useGalleryStore((state) => state.photoOverrides);
  // Check override first, then fallback to default
  const activeThemeName = photoOverrides[photo.id] || defaultPolaroidTheme;

  // CSS FOR THEME
  const theme = THEMES[activeThemeName];

  const imageUrl = getPlaceholderUrl(photo.id, isViewB ? "large" : "small");

  return (
    <div
      onClick={onClick}
      style={{ boxShadow: theme.innerStyle }} // Apply the inner bevel
      className={`
        relative flex flex-col transition-all duration-300
        ${onClick ? "cursor-pointer hover:opacity-90" : ""}
        ${theme.base} /* Apply the background color/gradient */
        ${theme.shadow} /* Apply the heavy drop shadow */
        ${
          isViewB
            ? "w-full max-w-4xl p-4 pb-20"
            : "@container rounded-sm p-2 pb-12 sm:pb-14"
        }
      `}
    >
      <img
        src={imageUrl}
        alt={photo.title || "Gallery photo"}
        className={`w-full h-auto object-contain ${
          isViewB ? "max-h-[50vh] min-h-[30vh]" : ""
        }`}
        loading="lazy"
        draggable={false}
      />

      {/* Bottom Text Wrapper */}
      <div
        className={`
          absolute bottom-0 left-0 w-full flex justify-between items-center gap-2 overflow-hidden
          ${isViewB ? "px-6 pb-6" : "px-3 pb-4"}
        `}
      >
        <span
          className={`
            font-bold tracking-widest font-orbitron whitespace-nowrap
            ${isViewB ? "text-lg" : "text-[clamp(0.45rem,4.5cqi,0.8rem)]"}
            ${theme.textPrimary} /* Use theme text color */
          `}
        >
          {"Subject " + photo.collection_id}:{photo.position}
        </span>

        <span
          className={`
            font-bold tracking-widest uppercase font-orbitron text-right whitespace-nowrap
            ${isViewB ? "text-sm" : "text-[clamp(0.4rem,3.5cqi,0.7rem)]"}
            ${theme.textPrimary}
          `}
        >
          {photo.artist_name || "Artist Name"}
        </span>
      </div>
    </div>
  );
}
