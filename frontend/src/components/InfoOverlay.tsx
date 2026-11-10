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
      // CHANGED: bg-black, rounded-2xl (all corners), removed backdrop-blur
      className="absolute inset-x-0 bottom-0 w-full max-w-4xl mx-auto bg-black border border-zinc-800 rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-50 text-white flex flex-col max-h-[35vh] mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0 font-orbitron">
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

      {/* Scrollable Centered Content */}
      <div className="p-6 overflow-y-auto no-scrollbar flex flex-col items-center text-center space-y-6">
        {/* Main Section: Title, Artist, Description */}
        <div className="space-y-6 w-full max-w-2xl flex flex-col items-center">
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 font-orbitron">
              Title
            </p>
            <h3 className="text-2xl text-white font-bold tracking-tight font-alternate">
              {photo.title || "Untitled"}
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 font-orbitron">
              Artist
            </p>
            <p className="text-white text-lg font-alternate">
              {photo.artist_name || "Unknown Artist"}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 font-orbitron">
              Description
            </p>
            <p className="text-white text-sm whitespace-pre-wrap font-alternate leading-relaxed">
              {photo.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="w-24 h-[1px] bg-zinc-800" />

        {/* Technical Details (Centered Flex-Wrap) */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 w-full font-alternate">
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 font-orbitron">
              Date Taken
            </p>
            <p className="text-white text-sm">{dateTaken}</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 font-orbitron">
              Dimensions
            </p>
            <p className="text-white text-sm">
              {photo.width} × {photo.height}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 font-orbitron">
              File Info
            </p>
            <p className="text-white text-sm uppercase">
              {photo.mime_type.split("/")[1]} • {fileSizeMB} MB
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 font-orbitron">
              Archive ID
            </p>
            <p className="text-white text-sm">
              Subject {photo.collection_sort_order}.{photo.position}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
