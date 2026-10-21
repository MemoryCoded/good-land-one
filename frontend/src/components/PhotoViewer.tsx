import type { Photo } from "../types/photo";

interface PhotoViewerProps {
  photo: Photo;
  onClose: () => void;
}

export function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
  const theme = photo.canvas_theme || "white";
  const isDark = theme === "dark";
  const imageUrl = `https://picsum.photos/seed/${photo.id}/1200/900`;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8">
      <button
        onClick={onClose}
        className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors text-lg"
      >
        ✕
      </button>

      {/* The Polaroid Frame */}
      <div
        className={`
        relative w-full max-w-4xl p-4 pb-24 shadow-2xl transition-colors duration-500
        ${isDark ? "bg-zinc-900 border border-zinc-700" : "bg-white"}
      `}
      >
        <img
          src={imageUrl}
          alt={photo.title || ""}
          className="w-full h-auto max-h-[70vh] object-contain"
        />

        {/* The Bottom Strip */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <span
            className={`text-xl font-bold tracking-widest ${
              isDark ? "text-zinc-400" : "text-gray-900"
            }`}
          >
            {photo.collection_id}.{photo.position}
          </span>

          <span
            className={`text-sm font-bold tracking-widest uppercase ${
              isDark ? "text-zinc-400" : "text-gray-900"
            }`}
          >
            DroneShots / {photo.artist_name || "Artist"}
          </span>
        </div>
      </div>

      {/* Action Pill */}
      <div className="mt-8 flex items-center gap-6 px-8 py-4 rounded-full bg-zinc-800/80 backdrop-blur-md text-white/70 border border-zinc-700/50 shadow-lg">
        <button
          className="hover:text-white text-xl transition-colors"
          title="Share"
        >
          ↑
        </button>
        <div className="flex gap-6">
          <button
            className="hover:text-white text-lg transition-colors"
            title="Favorite"
          >
            ♡
          </button>
          <button
            className="hover:text-white text-lg transition-colors"
            title="Info"
          >
            ⓘ
          </button>
          <button
            className="hover:text-white text-lg transition-colors"
            title="Canvas"
          >
            ▣
          </button>
        </div>
        <button
          className="hover:text-red-400 text-lg transition-colors ml-4"
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
