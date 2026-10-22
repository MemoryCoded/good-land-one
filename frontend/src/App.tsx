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
import type { Photo } from "./types/photo";

function App() {
  const photos = MOCK_PHOTOS;
  const navigate = useNavigate();

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
              // Capture the exact scroll Y position and pass it in the state
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

        <Route path="/photo/:id" element={<PhotoRoute photos={photos} />} />
      </Routes>
    </div>
  );
}

function PhotoRoute({ photos }: { photos: Photo[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPhoto = photos.find((p) => p.id === Number(id));

  const handleClose = () => {
    // Read the saved scrollY from location.state (fallback to 0 if not found)
    const savedScrollY = location.state?.scrollY || 0;
    // Navigate back to root, passing the scroll position so the grid knows where to go
    navigate("/", { state: { restoreScrollY: savedScrollY }, replace: true });
  };

  if (!selectedPhoto)
    return <div className="p-12 text-center">Photo not found</div>;

  return <PhotoViewer photo={selectedPhoto} onClose={handleClose} />;
}

export default App;
