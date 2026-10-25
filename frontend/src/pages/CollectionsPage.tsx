import { useCollections } from "../hooks/useCollections";
import { CollectionCard } from "../components/CollectionCard";

export function CollectionsPage() {
  const { collections } = useCollections();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <h1
        className="text-5xl font-bold text-[#6c85d7] mb-8 font-alternate tracking-tight pb-5"
        style={{
          textShadow: `
                0px 6px 0px rgb(217, 17, 57),
                0px 12px 0px rgb(234, 146, 168),
                0px 10px 30px rgba(120, 63, 63, 0.4)
              `,
        }}
      >
        All The Collections
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
