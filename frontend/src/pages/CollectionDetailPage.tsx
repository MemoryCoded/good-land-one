// This component is responsible for reading the URL, finding the matching photos, and rendering the grid.

import { useParams, useNavigate } from "react-router-dom";
import { MOCK_PHOTOS } from "../data/mockPhotos";
import { PhotoGrid } from "../components/PhotoGrid";
import { useGalleryStore } from "../store/useGalleryStore";

//import { useState } from "react";

export function CollectionDetailPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  // Define isdark
  const pageTheme = useGalleryStore((state) => state.pageTheme);
  const isDark = pageTheme === "Dark";

  // Map colllection name using ID

  const collectionMap: Record<string, number> = {
    Droneshots: 1,
    "Test Collection": 2,
    Landscapes: 3,
    "Natural World": 4,
    Sights: 5,
    Bridges: 6,
  };

  const collectionId = collectionMap[name || ""];

  const collectionPhotos = MOCK_PHOTOS.filter(
    (photo) => photo.collection_id === collectionId,
  );

  return (
    <div className="min-h-screen font-sans pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 mb-4">
        {/* 3. Dynamic Text Colors based on theme */}
        <h1
          className={`text-3xl font-bold font-alternate uppercase tracking-widest ${
            isDark ? "text-white" : "text-[#1c4a98]"
          }`}
        >
          {name}
        </h1>
        <p className="text-gray-500 font-extrabold text-xl mt-1 font-alternate">
          {collectionPhotos.length}{" "}
          {collectionPhotos.length > 1 ? "Photos" : "Photo"}
        </p>
      </div>

      {/* Reusing the PhotoGrid Component */}
      <PhotoGrid
        photos={collectionPhotos}
        onPhotoClick={(photo) =>
          navigate(`/photo/${photo.id}`, {
            state: { scrollY: window.scrollY },
          })
        }
        onCollectionVisible={() => {}} // Don't need the observer here
      />
    </div>
  );
}
