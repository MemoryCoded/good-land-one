import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useGalleryStore } from "../store/useGalleryStore";
import type { Photo } from "../types/photo";
import { PolaroidCard } from "./PolaroidCard";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onCollectionVisible: (title: string, date: string) => void;
}

export function PhotoGrid({
  photos,
  onPhotoClick,
  onCollectionVisible,
}: PhotoGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const location = useLocation();

  // 1. Grab the state from our Zustand whiteboard
  const { zoomLevel, zoomIn, zoomOut } = useGalleryStore();

  // 2. Scroll Restoration (from the previous step)
  useEffect(() => {
    if (location.state?.restoreScrollY !== undefined) {
      setTimeout(() => {
        window.scrollTo({
          top: location.state.restoreScrollY,
          behavior: "instant",
        });
      }, 10);
    }
  }, [location.state]);

  // 3. Listen for Cmd+Scroll (Mac) or Ctrl+Scroll (Windows)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // e.metaKey is Cmd on Mac, e.ctrlKey is Ctrl on Windows
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Stop the browser's default zoom
        if (e.deltaY < 0) zoomOut(); // Scrolled up
        if (e.deltaY > 0) zoomIn(); // Scrolled down
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [zoomIn, zoomOut]);

  // 4. Group photos and Observer (Same as before)
  const groupedPhotos = photos.reduce(
    (acc, photo) => {
      if (!acc[photo.collection_id]) acc[photo.collection_id] = [];
      acc[photo.collection_id].push(photo);
      return acc;
    },
    {} as Record<number, Photo[]>,
  );

  const collectionNames: Record<number, string> = {
    1: "Droneshots",
    2: "Test Collection",
    3: "Landscapes",
    4: "Natural World",
    5: "Sights",
    6: "Bridges",
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const title =
              entry.target.getAttribute("data-title") || "Virtual Gallery";
            const date = entry.target.getAttribute("data-date") || "Oct 2026";
            onCollectionVisible(title, date);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" },
    );
    const sections = document.querySelectorAll(".collection-section");
    sections.forEach((section) => observerRef.current?.observe(section));
    return () => observerRef.current?.disconnect();
  }, [photos, onCollectionVisible]);

  // 5. Dynamic Tailwind Classes based on zoomLevel
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
    5: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5",
  }[zoomLevel];

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {Object.entries(groupedPhotos).map(([collectionId, collectionPhotos]) => {
        const firstPhoto = collectionPhotos[0];
        const rawDate = firstPhoto.date_taken || firstPhoto.uploaded_at;
        const formattedDate = new Date(rawDate).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        const collectionName =
          collectionNames[Number(collectionId)] || "Untitled";

        return (
          <div
            key={collectionId}
            className="collection-section px-4 sm:px-8 pt-12 pb-4"
            data-title={`Virtual Gallery | ${collectionName}`}
            data-date={formattedDate}
          >
            {/* 6. The Framer Motion Grid */}
            <motion.div layout className={`grid ${gridCols} gap-4 items-start`}>
              {collectionPhotos.map((photo) => (
                <motion.div
                  layout
                  key={photo.id}
                  onClick={() => onPhotoClick(photo)}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="cursor-pointer"
                >
                  <PolaroidCard photo={photo} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
