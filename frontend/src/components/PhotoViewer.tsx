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

  // 1. Auto-scroll to center (Fixed math for perfect centering)
  useEffect(() => {
    if (stripRef.current && currentIndex !== -1) {
      const timer = setTimeout(() => {
        const container = stripRef.current;
        const activeElement = container?.children[currentIndex] as HTMLElement;

        if (activeElement && container) {
          const scrollPos =
            activeElement.offsetLeft -
            container.offsetWidth / 2 +
            activeElement.offsetWidth / 2;
          container.scrollTo({
            left: scrollPos,
            behavior: "smooth",
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // 2. Keyboard Navigation
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
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* View B Close Button (No background click to close anymore) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase z-50 font-space"
      >
        X Close
      </button>

      {/* MAIN PHOTO */}
      <div className="w-full flex justify-center flex-1 items-center mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
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
        // Changed to justify-start, added mx-auto and space to prevent clipping
        className="mt-8 w-full max-w-4xl flex justify-start gap-3 overflow-x-auto px-8 py-4 no-scrollbar z-50 scroll-smooth"
      >
        {photos.map((p) => (
          <div
            key={p.id}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/photo/${p.id}`);
            }}
            className={`w-10 h-14 flex-shrink-0 cursor-pointer transition-all duration-300 ${
              p.id === currentPhotoId
                ? // Using ring instead of outline so it renders outside the box cleanly
                  "ring-2 ring-white ring-offset-2 ring-offset-black scale-110 opacity-100 z-10 shadow-xl"
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

      {/* ACTION PILL & ARROWS (Gravity applied) */}
      <div className="mt-8 flex items-center gap-3 z-50 mb-4">
        {/* View B Left Arrow */}
        <button
          onClick={prevPhoto}
          disabled={currentIndex === 0}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg disabled:opacity-30 hover:bg-blue-600 transition-colors font-space text-lg"
        >
          ←
        </button>

        {/* The Floating Items */}
        <div className="flex items-center gap-3">
          <button
            className="px-6 py-2.5 rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:bg-zinc-700 transition-colors font-space tracking-widest uppercase text-sm"
            title="Share"
          >
            Outer
          </button>

          <button
            className="w-11 h-11 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:bg-zinc-700 transition-colors text-xl"
            title="Favorite"
          >
            ♡
          </button>

          <button
            className="px-6 py-2.5 rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:bg-zinc-700 transition-colors font-space font-bold text-sm tracking-widest"
            title="Info"
          >
            LABEL
          </button>

          <button
            className="w-11 h-11 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:bg-zinc-700 transition-colors text-xl"
            title="Canvas Toggle"
          >
            ▣
          </button>

          <button
            className="w-11 h-11 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:text-red-400 hover:bg-red-950 transition-colors ml-2 text-lg"
            title="Delete"
          >
            🗑
          </button>
        </div>

        {/* View B Right Arrow */}
        <button
          onClick={nextPhoto}
          disabled={currentIndex === photos.length - 1}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg disabled:opacity-30 hover:bg-red-600 transition-colors font-space text-lg"
        >
          →
        </button>
      </div>
    </div>
  );
}
