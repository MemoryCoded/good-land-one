import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { PolaroidCard } from "../../components/PolaroidCard";
import type { Photo } from "../../types/photo";
import { useQueryClient } from "@tanstack/react-query";

interface CollectionOption {
  id: number;
  name: string;
}

export function AdminEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAdmin();
  const queryClient = useQueryClient();

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");

  // Tracks how many photos exist in the current collection to limit the dropdown
  const [maxPosition, setMaxPosition] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    date_taken: "",
    description: "",
    artist_name: "",
    collection_id: 1,
    position: 1,
    visibility: "archive",
  });

  // 1. Fetch collections, all photos (for max position), and the specific photo
  useEffect(() => {
    // Fetch collections for the dropdown
    fetch("http://127.0.0.1:8000/api/collections")
      .then((res) => res.json())
      .then((data) => setCollections(data))
      .catch((err) => console.error("Failed to load collections", err));

    // Fetch all photos to calculate the max position for the collection
    fetch("http://127.0.0.1:8000/api/admin/photos/library?limit=100", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((allPhotos: Photo[]) => {
        // Now fetch the specific photo being edited
        return fetch(`http://127.0.0.1:8000/api/admin/photos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setPhoto(data);

            // Calculate how many photos are in THIS photo's collection
            const photosInCollection = allPhotos.filter(
              (p) => p.collection_id === data.collection_id,
            ).length;
            setMaxPosition(photosInCollection || 1);

            // Map the 3 database booleans to our single visibility string
            let vis = "archive";
            if (!data.is_archived) {
              if (data.is_uncategorized) vis = "uncat";
              else if (data.in_gallery) vis = "gallery";
            }

            setFormData({
              title: data.title || "",
              date_taken: data.date_taken || "",
              description: data.description || "",
              artist_name: data.artist_name || "",
              collection_id: data.collection_id,
              position: data.position,
              visibility: vis,
            });
          });
      });
  }, [id, token]);

  // 2. Save changes to backend
  const handleSave = async () => {
    const payload = {
      title: formData.title,
      description: formData.description,
      artist_name: formData.artist_name,
      collection_id: formData.collection_id,
      position: formData.position,

      // Format date to ISO string if it exists
      date_taken: formData.date_taken
        ? new Date(formData.date_taken).toISOString()
        : null,

      new_collection_name:
        newCollectionName.trim() !== "" ? newCollectionName.trim() : null,

      // Mutually exclusive logic
      is_archived: formData.visibility === "archive",
      is_uncategorized: formData.visibility === "uncat",
      in_gallery: formData.visibility === "gallery",
    };

    const res = await fetch(`http://127.0.0.1:8000/api/admin/photos/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Failed to save:", errorData);
      alert(`Error: ${JSON.stringify(errorData.detail)}`);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["adminPhotos"] });
    queryClient.invalidateQueries({ queryKey: ["photos"] });
    navigate("/admin/library");
  };

  // 3. Delete Collection
  const handleDeleteCollection = async () => {
    if (
      !window.confirm(
        "Delete this collection? Photos will be moved to Archive.",
      )
    )
      return;

    const res = await fetch(
      `http://127.0.0.1:8000/api/admin/photos/collections/${formData.collection_id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) {
      alert("Failed to delete collection. Check backend logs.");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["adminPhotos"] });
    queryClient.invalidateQueries({ queryKey: ["photos"] });
    navigate("/admin/library");
  };

  // 4. Delete Photo
  const handleDeletePhoto = async () => {
    if (
      !window.confirm("Are you sure you want to permanently delete this photo?")
    )
      return;

    const res = await fetch(`http://127.0.0.1:8000/api/admin/photos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert("Failed to delete photo.");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["adminPhotos"] });
    queryClient.invalidateQueries({ queryKey: ["photos"] });
    navigate("/admin/library");
  };

  if (!photo)
    return (
      <div className="p-12 text-center text-xl font-orbitron">
        Loading Photo...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-8 gap-8 max-w-7xl mx-auto bg-zinc-50">
      {/* Left Side: Live Polaroid Preview */}
      <div className="w-full md:w-1/2 flex justify-center items-start sticky top-8">
        <PolaroidCard photo={{ ...photo, ...formData }} isViewB={true} />
      </div>

      {/* Right Side: The Form */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg border border-zinc-200 h-fit">
        <h2 className="text-2xl font-bold mb-6 font-orbitron text-zinc-900">
          Edit Metadata
        </h2>

        <div className="space-y-4">
          {/* COLLECTION & POSITION ROW */}
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">
                  Collection
                </label>
                <button
                  onClick={handleDeleteCollection}
                  className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
                  title="Delete this collection"
                >
                  Delete Collection
                </button>
              </div>

              <select
                value={formData.collection_id}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    collection_id: Number(e.target.value),
                  });
                  setNewCollectionName("");
                }}
                className="w-full border border-zinc-300 p-2 rounded focus:outline-none focus:border-black mb-2"
              >
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Or type a new collection name..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:border-blue-500 text-sm bg-blue-50"
              />
            </div>

            {/* POSITION INPUT (RESTRICTED DROPDOWN) */}
            <div className="w-24">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Position
              </label>
              <select
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: Number(e.target.value) })
                }
                className="w-full border border-zinc-300 p-2 rounded focus:outline-none focus:border-black"
              >
                {/* Only show numbers from 1 up to the total number of photos in this collection */}
                {Array.from({ length: maxPosition }, (_, i) => i + 1).map(
                  (num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-zinc-300 p-2 rounded focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Date Taken
            </label>
            <input
              type="date"
              value={
                formData.date_taken ? formData.date_taken.split("T")[0] : ""
              }
              onChange={(e) =>
                setFormData({ ...formData, date_taken: e.target.value })
              }
              className="w-full border border-zinc-300 p-2 rounded focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-zinc-300 p-2 rounded focus:outline-none focus:border-black"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Artist Name
            </label>
            <input
              type="text"
              value={formData.artist_name}
              onChange={(e) =>
                setFormData({ ...formData, artist_name: e.target.value })
              }
              className="w-full border border-zinc-300 p-2 rounded focus:outline-none focus:border-black"
            />
          </div>

          <div className="pt-4 border-t border-zinc-200 mt-6">
            <h3 className="font-bold mb-3 text-sm text-zinc-500 uppercase tracking-widest">
              Visibility Settings
            </h3>

            <select
              value={formData.visibility}
              onChange={(e) =>
                setFormData({ ...formData, visibility: e.target.value })
              }
              className="w-full border border-zinc-300 p-2 rounded focus:outline-none focus:border-black"
            >
              <option value="archive">Archive Only (Admin)</option>
              <option value="uncat">Uncategorized (UNCAT)</option>
              <option value="gallery">Public Gallery + Collections</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t border-zinc-200">
            <button
              onClick={() => navigate("/admin/library")}
              className="w-full bg-zinc-200 text-black p-3 rounded font-bold hover:bg-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="w-full bg-black text-white p-3 rounded font-bold hover:bg-zinc-800 transition-colors"
            >
              Save Changes
            </button>
          </div>

          <div className="pt-8 mt-4">
            <button
              onClick={handleDeletePhoto}
              className="w-full bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700 transition-colors shadow-sm"
            >
              Delete Photo Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
