import { useState } from "react";
import { usePhotos } from "./hooks/usePhotos";
import { PhotoGrid } from "./components/PhotoGrid";
import { PhotoViewer } from "./components/PhotoViewer";
import type { Photo } from "./types/photo";

function App() {
  const { data: photos, isLoading, isError } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Manila Header (Simplified for now) */}
      <header className="sticky top-0 z-10 bg-[#E8D5A5] px-8 py-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 border-l-4 border-gray-800 pl-3">
            Library | Landing One
          </h1>
          <p className="text-gray-600 text-xs ml-4 mt-1">Oct 2026</p>
        </div>
        <div className="flex gap-6 text-sm font-semibold text-gray-800">
          <button className="hover:text-black">Search</button>
          <button className="hover:text-black">Select</button>
          <button className="hover:text-black">Seek</button>
          <button className="hover:text-black">Collections</button>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {isLoading && (
          <div className="p-12 text-center text-gray-400">Loading ...</div>
        )}
        {isError && (
          <div className="p-12 text-center text-red-500">Failed to load</div>
        )}

        {photos && (
          <PhotoGrid photos={photos} onPhotoClick={setSelectedPhoto} />
        )}
      </main>

      {/* View B Overlay */}
      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}

export default App;
