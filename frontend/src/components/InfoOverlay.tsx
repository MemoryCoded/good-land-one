import { motion } from "framer-motion";
import type { Photo } from "../types/photo";

interface InfoOverlayProps {
  photo: Photo;
  onClose: () => void;
}

export function InfoOverlay({ photo, onClose }: InfoOverlayProps) {
  // Format the date nicely (e.g., "Oct 24, 2026")
  const dateTaken = photo.date_taken
    ? new Date(photo.date_taken).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown Date";

  // Convert bytes to MB
  const fileSizeMB = (photo.size_bytes / (1024 * 1024)).toFixed(2);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 w-full bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-700/50 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-[60] text-zinc-300 font-orbitron"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-bold text-white tracking-widest uppercase">
          Info
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors text-xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Metadata Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Title
            </p>
            <p className="text-white font-bold">{photo.title || "Untitled"}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Artist
            </p>
            <p className="text-white">
              {photo.artist_name || "Unknown Artist"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Date Taken
            </p>
            <p className="text-white">{dateTaken}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Dimensions
            </p>
            <p className="text-white">
              {photo.width} × {photo.height}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              File Info
            </p>
            <p className="text-white uppercase">
              {photo.mime_type.split("/")[1]} • {fileSizeMB} MB
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Archive ID
            </p>
            <p className="text-white">
              Subject {photo.collection_id}:{photo.position}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
