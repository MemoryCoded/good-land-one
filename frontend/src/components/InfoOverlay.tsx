import { motion } from "framer-motion";
import type { Photo } from "../types/photo";

interface InfoOverlayProps {
  photo: Photo;
  onClose: () => void;
}

export function InfoOverlay({ photo, onClose }: InfoOverlayProps) {
  const dateTaken = photo.date_taken
    ? new Date(photo.date_taken).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown Date";
  const fileSizeMB = (photo.size_bytes / (1024 * 1024)).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      // Changed to absolute so it sits in the Reel Strip slot
      className="absolute inset-x-0 bottom-0 w-full max-w-4xl mx-auto bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-700/50 rounded-t-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 text-zinc-300 font-orbitron flex flex-col max-h-[30vh]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 shrink-0">
        <h2 className="text-lg font-bold text-white tracking-widest uppercase">
          Exhibit Label
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors text-xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 overflow-y-auto no-scrollbar text-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-orbitron">
              Title
            </p>
            <p className="text-white">{photo.title || "Untitled"}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Artist
            </p>
            <p className="text-white">
              {photo.artist_name || "Unknown Artist"}
            </p>
          </div>
          {/* NEW: Description */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Description
            </p>
            <p className="text-white text-sm whitespace-pre-wrap font-alternate">
              {photo.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Date Taken
            </p>
            <p className="text-white">{dateTaken}</p>
          </div>
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
              Subject {photo.collection_sort_order}.{photo.position}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
