import type { Photo } from "../types/photo";
import { PolaroidCard } from "./PolaroidCard";

interface PhotoViewerProps {
  photo: Photo;
  onClose: () => void;
}

export function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8"
      onClick={onClose} // Click background to close
    >
      <button
        onClick={onClose}
        className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors text-lg z-50"
      >
        ✕ Close
      </button>

      {/* Stop propagation so clicking the photo doesn't close it */}
      <div onClick={(e) => e.stopPropagation()}>
        <PolaroidCard photo={photo} isViewB={true} />
      </div>

      {/* Action Pill */}
      <div
        className="mt-8 flex items-center gap-6 px-8 py-4 rounded-full bg-zinc-800/80 backdrop-blur-md text-white/70 border border-zinc-700/50 shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
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
