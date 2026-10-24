import type { Photo } from "../types/photo";

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
  const isDark = photo.canvas_theme === "dark";
  const imageUrl = getPlaceholderUrl(photo.id, isViewB ? "large" : "small");

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col shadow-sm hover:shadow-md transition-all duration-300
        ${onClick ? "cursor-pointer hover:opacity-90" : ""}
        ${
          isDark
            ? "bg-zinc-900 border border-zinc-800"
            : "bg-blend-luminosity bg-zinc-300"
        }

        /* FIXED: Only use @container when NOT in View B */
        ${
          isViewB
            ? "w-full max-w-4xl shadow-2xl p-4 pb-20"
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
            ${isDark ? "text-zinc-200" : "text-gray-900"}
          `}
        >
          {"Subject " + photo.collection_id}:{photo.position}
        </span>

        <span
          className={`
            font-bold tracking-widest uppercase font-orbitron text-right whitespace-nowrap
            ${isViewB ? "text-sm" : "text-[clamp(0.4rem,3.5cqi,0.7rem)]"}
            ${isDark ? "text-zinc-200" : "text-gray-900"}
          `}
        >
          {photo.artist_name || "Artist Name"}
        </span>
      </div>
    </div>
  );
}
