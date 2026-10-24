// This component is responsible for reading the URL, finding the matching photos, and rendering the grid.

import { useParams, useNavigate } from "react-router-dom";
import { MOCK_PHOTOS } from "../data/mockPhotos";
import { PhotoGrid } from "../components/PhotoGrid";
import { useState } from "react";

export function CollectionDetailPage() {
  const { name } = useParams();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-zinc-50 font-sans pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 mb-4">
        <h1 className="text-3xl font-bold text-[#344373] font-alternate uppercase tracking-widest pb-3">
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
