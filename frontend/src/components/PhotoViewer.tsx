import { useEffect, useRef, useState } from "react";
import type { Photo } from "../types/photo";
import { PolaroidCard } from "./PolaroidCard";
import { InfoOverlay } from "./InfoOverlay";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGalleryStore } from "../store/useGalleryStore";
import { getFullImageUrl } from "../utils/imageHelper";

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
  const mainPhotoRef = useRef<HTMLDivElement>(null);

  const togglePhotoTheme = useGalleryStore((state) => state.togglePhotoTheme);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentIndex = photos.findIndex((p) => p.id === currentPhotoId);
  const photo = photos[currentIndex];

  const [showInfo, setShowInfo] = useState(false);

  // 1. CALCULATE COLLECTION ORDER FOR NUMBERING
  const collectionOrderMap: Record<number, number> = {};
  let currentOrder = 1;
  const uniqueCollections = Array.from(
    new Set(photos.map((p) => p.collection_id)),
  );
  uniqueCollections.forEach((id) => {
    collectionOrderMap[id] = currentOrder++;
  });

  // Override the photo with the correct display order
  const displayPhoto = photo
    ? {
        ...photo,
        collection_sort_order: collectionOrderMap[photo.collection_id] || 1,
      }
    : null;

  // 2. Define functions
  const nextPhoto = () => {
    if (currentIndex < photos.length - 1)
      navigate(`/photo/${photos[currentIndex + 1].id}`);
  };
  const prevPhoto = () => {
    if (currentIndex > 0) navigate(`/photo/${photos[currentIndex - 1].id}`);
  };

  // 3. Auto-scroll the strip
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
          container.scrollTo({ left: scrollPos, behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // 4. Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextPhoto();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevPhoto();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, photos, navigate, onClose]);

  // 5. Trackpad Swipe
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (scrollTimeout.current) return;
        if (e.deltaX > 30) nextPhoto();
        else if (e.deltaX < -30) prevPhoto();
        scrollTimeout.current = setTimeout(() => {
          scrollTimeout.current = null;
        }, 400);
      }
    };
    const photoRef = mainPhotoRef.current;
    if (photoRef) {
      photoRef.addEventListener("wheel", handleWheel, { passive: false });
      return () => photoRef.removeEventListener("wheel", handleWheel);
    }
  }, [currentIndex, photos]);

  if (!displayPhoto) return null;

  return (
    // 1. Entire page scrolls naturally
    <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto select-none no-scrollbar">
      {/* 2. min-h-screen keeps the footer pushed down if the photo is small */}
      <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8">
        {/* HEADER: Close Button */}
        <div className="flex-shrink-0 flex items-center h-12 z-50">
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase font-space"
          >
            ✕ Close
          </button>
        </div>
        {/* MAIN PHOTO */}
        <div
          ref={mainPhotoRef}
          className="w-full flex justify-center items-center py-4"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={displayPhoto.id}
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
              className="flex justify-center cursor-grab active:cursor-grabbing w-full"
            >
              <PolaroidCard photo={displayPhoto} isViewB={true} />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* FOOTER: Reel Strip & Action Pill */}
        <div className="flex-shrink-0 w-full flex flex-col items-center z-50 mt-4">
          {/* REEL STRIP */}
          <div
            ref={stripRef}
            className="w-full max-w-4xl flex justify-start gap-3 overflow-x-auto px-8 py-3 no-scrollbar scroll-smooth"
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
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110 opacity-100 z-10 shadow-xl"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                <img
                  src={getFullImageUrl(p.thumbnail_small)}
                  alt=""
                  className="w-full h-full object-cover rounded-sm pointer-events-none"
                />
              </div>
            ))}
          </div>

          {/* ACTION PILL */}
          <div className="flex items-center justify-center w-full max-w-full px-2 pb-4">
            <button
              onClick={prevPhoto}
              disabled={currentIndex === 0}
              className="hidden sm:flex w-11 h-11 items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg disabled:opacity-30 hover:bg-blue-600 transition-colors font-space text-lg mr-3"
            >
              ←
            </button>

            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar max-w-full px-2 py-2">
              <button
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:bg-zinc-700 transition-colors font-space tracking-widest uppercase text-[10px] sm:text-sm whitespace-nowrap"
                title="Share"
              >
                Links
              </button>
              <button
                className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:bg-zinc-700 transition-colors text-lg sm:text-xl"
                title="Favorite"
              >
                ♡
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(true);
                }}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:bg-zinc-700 transition-colors font-space font-bold text-[10px] sm:text-sm tracking-widest whitespace-nowrap"
                title="Info"
              >
                LABEL
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePhotoTheme(displayPhoto.id);
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:bg-zinc-700 transition-colors text-lg sm:text-xl"
              >
                ▣
              </button>
            </div>

            <button
              onClick={nextPhoto}
              disabled={currentIndex === photos.length - 1}
              className="hidden sm:flex w-11 h-11 items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg disabled:opacity-30 hover:bg-red-600 transition-colors font-space text-lg ml-3"
            >
              →
            </button>
          </div>
        </div>{" "}
        {/* <-- FIXED: Added missing closing div for Footer */}
      </div>

      <AnimatePresence>
        {showInfo && (
          <InfoOverlay
            photo={displayPhoto}
            onClose={() => setShowInfo(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
