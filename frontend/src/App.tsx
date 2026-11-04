import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { PhotoGrid } from "./components/PhotoGrid";
import { PhotoViewer } from "./components/PhotoViewer";
import { ManHeader } from "./components/Header";
import { CollectionsPage } from "./pages/CollectionsPage";
import { CollectionDetailPage } from "./pages/CollectionDetailPage";
import type { Photo } from "./types/photo";
import { usePhotos } from "./hooks/usePhotos";
import { useGalleryStore } from "./store/useGalleryStore";
import { AdminLoginPage } from "./pages/admin/LoginPage";
import { AdminLibraryPage } from "./pages/admin/AdminLibraryPage";
import { AdminEditPage } from "./pages/admin/AdminEditPage"; // <-- Added
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  // 1. FIXED: lowercase isError
  const { data: photos = [], isLoading, isError } = usePhotos();

  const navigate = useNavigate();

  const pageTheme = useGalleryStore((state) => state.pageTheme);
  const isDark = pageTheme === "Dark";

  const [activeDate, setActiveDate] = useState("Oct 2026");

  // State for the Title (updated by observer)
  const [observedTitle, setObservedTitle] = useState<string | null>(null);

  const fallbackTitle =
    photos.length > 0 && photos[0].collection_name
      ? `Exhibition | ${photos[0].collection_name}`
      : "Exhibition";

  const activeTitle = observedTitle || fallbackTitle;

  return (
    <div
      style={{ backgroundColor: isDark ? "#09090b" : "#fafafa" }}
      className={`min-h-screen font-sans transition-colors duration-500 ${
        isDark ? "text-zinc-100" : "text-zinc-900"
      }`}
    >
      <ManHeader title={activeTitle} date={activeDate} />

      {/* 2. ADDED: Loading and Error States */}
      {isLoading ? (
        <div className="flex h-[50vh] items-center justify-center font-orbitron text-xl">
          Loading Gallery...
        </div>
      ) : isError ? (
        <div className="flex h-[50vh] items-center justify-center font-orbitron text-xl text-red-500">
          Failed to connect to backend. Is the server running?
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <PhotoGrid
                photos={photos}
                onPhotoClick={(photo) =>
                  navigate(`/photo/${photo.id}`, {
                    state: { scrollY: window.scrollY },
                  })
                }
                onCollectionVisible={(title, date) => {
                  setObservedTitle(title);
                  setActiveDate(date);
                }}
              />
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin/library"
            element={
              <ProtectedRoute>
                <AdminLibraryPage />
              </ProtectedRoute>
            }
          />

          {/* 3. ADDED: The Edit Route */}
          <Route
            path="/admin/photo/:id"
            element={
              <ProtectedRoute>
                <AdminEditPage />
              </ProtectedRoute>
            }
          />

          {/* Public Routes - 4. FIXED: Passed 'photos' prop */}
          <Route
            path="/collections"
            element={<CollectionsPage photos={photos} />}
          />
          <Route
            path="/collections/:name"
            element={<CollectionDetailPage photos={photos} />}
          />
          <Route path="/photo/:id" element={<PhotoRoute photos={photos} />} />
        </Routes>
      )}
    </div>
  );
}

function PhotoRoute({ photos }: { photos: Photo[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    const savedScrollY = location.state?.scrollY || 0;
    navigate("/", { state: { restoreScrollY: savedScrollY }, replace: true });
  };

  return (
    <PhotoViewer
      photos={photos}
      currentPhotoId={Number(id)}
      onClose={handleClose}
    />
  );
}

export default App;
