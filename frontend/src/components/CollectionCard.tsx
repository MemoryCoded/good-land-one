import { Link } from "react-router-dom";
import type { Collection } from "../hooks/useCollections";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      to={`/collections/${encodeURIComponent(collection.name)}`}
      className="group relative block w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 isolate transform-gpu"
    >
      {/* Background Image */}
      <img
        src={collection.coverPhoto}
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 backface-visibility-hidden"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* TEXTURE 1: Photographic Grain */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none rounded-lg"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* TEXTURE 2: Inner Shadow + Ring */}
      <div className="absolute inset-0 pointer-events-none rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] ring-1 ring-inset ring-white/200" />

      {/* Folder Tab Visual (Top Left) */}
      <div
        // FIXED: Added rounded-tl-lg (matches parent curve), z-20 (sits above shadows), and adjusted border
        className="absolute top-0 left-0 px-5 py-2.5 rounded-tl-m rounded-br-xl font-bold text-lg tracking-wide font-alternate text-gray-200 bg-linear-to-br from-blue-200 via-blue-400 to-blue-600 border-b border-r border-zinc-900/50 transform-gpu z-20"
        style={{
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.4), inset 0px -2px 2px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        {collection.date}
      </div>

      {/* Text Content (Bottom) */}
      <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end font-alternate z-10">
        <div>
          <h3 className="text-white text-3xl font-bold tracking-tight mb-1 group-hover:text-[#1bda09] transition-colors drop-shadow-md">
            {collection.name}
          </h3>
          <p className="text-white/70 text-m font-semibold drop-shadow-md">
            {collection.photoCount} photos
          </p>
        </div>
      </div>
    </Link>
  );
}
