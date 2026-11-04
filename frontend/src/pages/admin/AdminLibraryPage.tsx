import { useAdminPhotos } from "../../hooks/useAdminPhotos";
import { PolaroidCard } from "../../components/PolaroidCard";
import { Link, useNavigate } from "react-router-dom";

export function AdminLibraryPage() {
  const { data: photos, isLoading, isError } = useAdminPhotos();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="p-12 text-center text-xl font-orbitron">Loading...</div>
    );
  if (isError)
    return (
      <div className="p-12 text-center text-red-500 font-orbitron">
        Failed to load.
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-orbitron text-zinc-900">
          Admin Library
        </h1>
        <Link
          to="/admin/upload"
          className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-zinc-800 transition-colors"
        >
          + Upload Photos
        </Link>
      </div>

      {/* Grid */}
      <div className="@container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {photos?.map((photo) => (
          <div key={photo.id} className="relative group">
            {/* The Polaroid Card */}
            <PolaroidCard photo={photo} />

            {/* Status Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 pointer-events-none">
              {photo.is_archived && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  ARCHIVED
                </span>
              )}
              {photo.in_gallery && (
                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  PUBLIC
                </span>
              )}
            </div>

            {/* Hover Overlay for Admin Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-sm z-20">
              <button
                onClick={() => navigate(`/admin/photo/${photo.id}`)}
                className="bg-white text-black px-4 py-2 rounded font-bold text-sm w-3/4 hover:bg-zinc-200"
              >
                Edit Info
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded font-bold text-sm w-3/4 hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
