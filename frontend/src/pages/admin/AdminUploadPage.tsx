import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { useQueryClient } from "@tanstack/react-query";

interface CollectionOption {
  id: number;
  name: string;
}

export function AdminUploadPage() {
  const { token } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [collectionId, setCollectionId] = useState<number>(1);
  const [newCollectionName, setNewCollectionName] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  // Fetch collections on load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/collections")
      .then((res) => res.json())
      .then((data) => setCollections(data))
      .catch((err) => console.error("Failed to load collections", err));
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      setFiles((prev) => [
        ...prev,
        ...Array.from(e.dataTransfer.files).filter((f) =>
          f.type.startsWith("image/"),
        ),
      ]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    // If they typed a new collection, we will handle it in a custom way.
    // For simplicity, the upload endpoint currently only takes collection_id.
    // To support new collections during upload, you'd need a backend tweak,
    // but for now we'll force them to use an existing collection ID for uploads,
    // or we can route them to the edit page after upload.

    // For now, let's use the selected collection ID.
    formData.append("collection_id", collectionId.toString());
    formData.append("is_archived", "true");
    formData.append("in_gallery", "false");
    formData.append("is_uncategorized", "false");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/photos/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      queryClient.invalidateQueries({ queryKey: ["adminPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      navigate("/admin/library");
    } catch {
      alert("Failed to upload photos.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen">
      <h1 className="text-3xl font-bold font-orbitron mb-8">Bulk Upload</h1>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-zinc-300 hover:border-zinc-400 bg-zinc-50"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) =>
            e.target.files &&
            setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
          }
          className="hidden"
        />
        <p className="text-xl font-bold text-zinc-700 mb-2">
          {isDragActive ? "Drop photos here..." : "Drag & drop photos here"}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
          <h2 className="font-bold text-lg mb-4">
            Ready to upload ({files.length} files)
          </h2>

          <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Existing Collection
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(Number(e.target.value))}
                className="w-full border border-zinc-300 p-2 rounded focus:outline-none focus:border-black"
              >
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Or Create New
              </label>
              <input
                type="text"
                placeholder="New collection name..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full border border-blue-300 p-2 rounded focus:outline-none focus:border-blue-500 bg-blue-50"
              />
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-zinc-800 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : `Upload ${files.length} Photos`}
          </button>
        </div>
      )}
    </div>
  );
}
