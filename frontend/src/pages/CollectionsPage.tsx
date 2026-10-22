import { useCollections } from "../hooks/useCollections";
import { CollectionCard } from "../components/CollectionCard";

export function CollectionsPage() {
  const { collections } = useCollections();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-space tracking-tight">
        All Collections
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
