import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { MOCK_PHOTOS } from "./data/mockPhotos";
import { PhotoGrid } from "./components/PhotoGrid";
import { PhotoViewer } from "./components/PhotoViewer";
import { ManHeader } from "./components/Header";
import { CollectionsPage } from "./pages/CollectionsPage";
import type { Photo } from "./types/photo";

function App() {
  const photos = MOCK_PHOTOS;
  const navigate = useNavigate(); // <-- Bring the steering wheel back

  const [activeTitle, setActiveTitle] = useState(
    "Virtual Gallery | Test Collection",
  );
  const [activeDate, setActiveDate] = useState("Oct 2026");

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <ManHeader title={activeTitle} date={activeDate} />

      <Routes>
        <Route
          path="/"
          element={
            <PhotoGrid
              photos={photos}
              // FIXED: Actually navigate and save scroll position
              onPhotoClick={(photo) =>
                navigate(`/photo/${photo.id}`, {
                  state: { scrollY: window.scrollY },
                })
              }
              onCollectionVisible={(title, date) => {
                setActiveTitle(title);
                setActiveDate(date);
              }}
            />
          }
        />

        <Route path="/collections" element={<CollectionsPage />} />

        {/* FIXED: Passed photos and current ID to the Viewer */}
        <Route path="/photo/:id" element={<PhotoRoute photos={photos} />} />
      </Routes>
    </div>
  );
}

function PhotoRoute({ photos }: { photos: Photo[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    // Read the saved scrollY from the state, or default to 0
    const savedScrollY = location.state?.scrollY || 0;

    // Navigate back to root, passing the scroll position back
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
