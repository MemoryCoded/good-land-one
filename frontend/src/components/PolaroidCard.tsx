import type { Photo } from "../types/photo";

interface PolaroidCardProps {
  photo: Photo;
  onClick?: () => void;
  isViewB?: boolean;
}

// Temporary placeholder image logic
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
        relative flex flex-col p-3 pb-16 shadow-sm hover:shadow-md transition-all duration-300
        ${onClick ? "cursor-pointer hover:opacity-90" : ""}
        ${isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white"}
        ${isViewB ? "max-w-4xl w-full shadow-2xl p-4 pb-24" : "rounded-sm"}
      `}
    >
      <img
        src={imageUrl}
        alt={photo.title || "Gallery photo"}
        className={`w-full h-auto object-contain ${
          isViewB ? "max-h-[70vh]" : ""
        }`}
        loading="lazy"
      />

      {/* Bottom Left: Number */}
      <span
        className={`
        absolute font-bold tracking-widest font-orbitron
        ${
          isViewB
            ? "bottom-6 left-6 text-xl"
            : "bottom-3 left-2 text-[clamp(0.5rem,1.5vw,0.75rem)]"
        }
        ${isDark ? "text-zinc-400" : "text-gray-900"}
      `}
      >
        {"#" + photo.collection_id}.{photo.position}
      </span>

      {/* Bottom Right: Signature */}
      <span
        className={`
        absolute font-bold tracking-widest uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[60%] font-orbitron
        ${
          isViewB
            ? "bottom-6 right-6 text-sm"
            : "bottom-3 right-2 text-[clamp(0.4rem,1vw,0.65rem)]"
        }
        ${isDark ? "text-zinc-400" : "text-gray-900"}
      `}
      >
        {photo.artist_name || "Artist Name"}
      </span>
    </div>
  );
}
