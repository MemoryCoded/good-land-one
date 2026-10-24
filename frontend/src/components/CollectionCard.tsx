import { Link } from "react-router-dom";
import type { Collection } from "../hooks/useCollections";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      // In case of spaces
      to={`/collections/${encodeURIComponent(collection.name)}`}
      className="group relative block w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Background Image */}
      <img
        src={collection.coverPhoto}
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Folder Tab Visual (Top Left) */}
      <div className="absolute top-0 left-0 bg-[#c2cde6] text-gray-900 px-4 py-1 rounded-br-lg font-bold text-m tracking-wide shadow-sm font-alternate">
        {collection.date}
      </div>

      {/* Text Content (Bottom) */}
      <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end font-alternate">
        <div>
          <h3 className="text-white text-3xl font-bold tracking-tight mb-1 group-hover:text-[#E8D5A5] transition-colors">
            {collection.name}
          </h3>
          <p className="text-white/70 text-m font-semibold">
            {collection.photoCount} photos
          </p>
        </div>
      </div>
    </Link>
  );
}
