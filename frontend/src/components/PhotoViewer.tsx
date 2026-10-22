import { useEffect, useRef } from "react";
import type { Photo } from "../types/photo";
import { PolaroidCard } from "./PolaroidCard";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoViewerProps {
  photos: Photo[];
  currentPhotoId: number;
  onClose: () => void;
}

export function PhotoViewer({
  photos,
  currentPhotoId,
  onClose,
}: PhotoViewerProps) {
  const navigate = useNavigate();
  const stripRef = useRef<HTMLDivElement>(null);

  const currentIndex = photos.findIndex((p) => p.id === currentPhotoId);
  const photo = photos[currentIndex];

  // 1. Auto-scroll the strip (Without the flash)
  useEffect(() => {
    if (stripRef.current && currentIndex !== -1) {
      const activeElement = stripRef.current.children[
        currentIndex
      ] as HTMLElement;
      if (activeElement) {
        // Calculate the center position
        const scrollLeft =
          activeElement.offsetLeft -
          stripRef.current.offsetWidth / 2 +
          activeElement.offsetWidth / 2;

        stripRef.current.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  // 2. Prevent keyboard arrows from scrolling the page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentIndex < photos.length - 1)
          navigate(`/photo/${photos[currentIndex + 1].id}`);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex > 0) navigate(`/photo/${photos[currentIndex - 1].id}`);
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, photos, navigate, onClose]);

  if (!photo) return null;

  const nextPhoto = () => {
    if (currentIndex < photos.length - 1)
      navigate(`/photo/${photos[currentIndex + 1].id}`);
  };

  const prevPhoto = () => {
    if (currentIndex > 0) navigate(`/photo/${photos[currentIndex - 1].id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden"
      onClick={onClose}
    >
      {/* View B Close Button*/}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase z-50 font-space"
      >
        ✕ Close
      </button>

      {/* MAIN PHOTO */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full flex justify-center flex-1 items-center mt-12"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id} // Key on the photo ID triggers the animation
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -50) nextPhoto();
              if (offset.x > 50) prevPhoto();
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <PolaroidCard photo={photo} isViewB={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* REEL STRIP */}
      <div
        ref={stripRef}
        className="mt-6 w-full max-w-4xl flex justify-start sm:justify-center gap-2 overflow-x-auto px-4 py-4 no-scrollbar z-50 scroll-smooth"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.map((p, index) => (
          <div
            key={p.id}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/photo/${p.id}`);
            }}
            className={`w-10 h-14 flex-shrink-0 cursor-pointer transition-all duration-300 ${
              p.id === photo.id
                ? "ring-2 ring-white scale-110 opacity-100"
                : "opacity-40 hover:opacity-80"
            }`}
          >
            <img
              src={p.thumbnail_small}
              alt=""
              className="w-full h-full object-cover rounded-sm pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* ACTION PILL & ARROWS */}
      <div
        className="mt-6 flex items-center gap-4 z-50 mb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={prevPhoto}
          disabled={currentIndex === 0}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800/80 text-white disabled:opacity-30 hover:bg-zinc-700 transition-colors"
        >
          ←
        </button>

        <div className="flex items-center gap-6 px-8 py-4 rounded-full bg-zinc-800/80 backdrop-blur-md text-white shadow-lg border border-zinc-700/50">
          <button
            className="hover:text-white text-xl transition-colors font-space tracking-widest uppercase"
            title="Share"
          >
            Outer
          </button>

          <div className="flex gap-6 items-center">
            <button
              className="hover:text-white text-lg transition-colors"
              title="Favorite"
            >
              ♡
            </button>
            <button
              className="hover:text-white text-lg transition-colors font-sans font-bold font-space"
              title="Info"
            >
              Label
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

        <button
          onClick={nextPhoto}
          disabled={currentIndex === photos.length - 1}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800/80 text-white disabled:opacity-30 hover:bg-zinc-700 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
