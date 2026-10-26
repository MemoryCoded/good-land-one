import { useEffect, useRef, useState } from "react";
import type { Photo } from "../types/photo";
import { PolaroidCard } from "./PolaroidCard";
import { InfoOverlay } from "./InfoOverlay";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGalleryStore } from "../store/useGalleryStore";

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

  // Toggle Function from Zustand
  const togglePhotoTheme = useGalleryStore((state) => state.togglePhotoTheme);

  // 1. Ref for the trackpad throttle
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentIndex = photos.findIndex((p) => p.id === currentPhotoId);
  const photo = photos[currentIndex];

  const [showInfo, setShowInfo] = useState(false);

  // 2. Define functions BEFORE the effects that use them
  const nextPhoto = () => {
    if (currentIndex < photos.length - 1)
      navigate(`/photo/${photos[currentIndex + 1].id}`);
  };

  const prevPhoto = () => {
    if (currentIndex > 0) navigate(`/photo/${photos[currentIndex - 1].id}`);
  };

  // 3. Auto-scroll the strip to center the active photo
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

  // 5. Trackpad Horizontal Swipe
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only triggers for horizontal swipe
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault(); // Prevent whole page scroll

        if (scrollTimeout.current) return; // Throttle

        if (e.deltaX > 30) {
          nextPhoto();
        } else if (e.deltaX < -30) {
          prevPhoto();
        }

        // Lock swipe for 400ms so it doesn't skip photos
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

  // 6. NOW it is safe to do an early return
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      {/* View B Close Button */}
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
      <div
        ref={mainPhotoRef}
        className="w-full flex-1 min-h-0 justify-center flex items-center mt-12"
      >
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
            className="w-full max-w-4xl flex justify-center cursor-grab active:cursor-grabbing"
          >
            <PolaroidCard photo={photo} isViewB={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* REEL STRIP */}
      <div
        ref={stripRef}
        className="flex-shrink-0 my-6 w-full max-w-4xl flex justify-start gap-3 overflow-x-auto px-8 py-4 no-scrollbar z-50 scroll-smooth"
      >
        {/* Note: If you added the invisible spacers earlier, keep them here */}
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
              src={p.thumbnail_small}
              alt=""
              className="w-full h-full object-cover rounded-sm pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* ACTION PILL & ARROWS */}
      <div className="mt-8 flex items-center justify-center w-full max-w-full z-50 mb-4 px-2">
        {/* Left Arrow */}
        <button
          onClick={prevPhoto}
          disabled={currentIndex === 0}
          className="hidden sm:flex w-11 h-11 items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg disabled:opacity-30 hover:bg-blue-600 transition-colors font-space text-lg mr-3"
        >
          ←
        </button>

        {/* Floating Items */}
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

          {/* LABEL Button */}
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

          {/*Canvas button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Stop click from closing viewer
              togglePhotoTheme(photo.id);
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg hover:bg-zinc-700 transition-colors text-lg sm:text-xl"
          >
            ▣
          </button>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextPhoto}
          disabled={currentIndex === photos.length - 1}
          className="hidden sm:flex w-11 h-11 items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-white border border-zinc-700/50 shadow-lg disabled:opacity-30 hover:bg-red-600 transition-colors font-space text-lg ml-3"
        >
          →
        </button>
      </div>
      {/* Info Overlay*/}
      <AnimatePresence>
        {showInfo && (
          <InfoOverlay photo={photo} onClose={() => setShowInfo(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
