import type { Photo } from "../types/photo";

// We generate fake photos with varied aspect ratios to test the layout
const generateMockPhoto = (
  id: number,
  aspect: "square" | "tall" | "wide",
): Photo => {
  const sizes = {
    square: { w: 1000, h: 1000 },
    tall: { w: 800, h: 1200 },
    wide: { w: 1600, h: 800 },
  };

  return {
    id,
    collection_id: Math.floor(id / 10) + 1,
    position: (id % 10) + 1,
    title: `Mock Photo ${id}`,
    description: "This is a test description.",
    artist_name: "RANDOMARTIST",
    filename: `mock_${id}.jpg`,
    thumbnail_small: `https://picsum.photos/seed/${id}/400/${
      sizes[aspect].h / 2
    }`,
    thumbnail_medium: `https://picsum.photos/seed/${id}/${sizes[aspect].w}/${sizes[aspect].h}`,
    thumbnail_large: `https://picsum.photos/seed/${id}/${
      sizes[aspect].w * 1.5
    }/${sizes[aspect].h * 1.5}`,
    width: sizes[aspect].w,
    height: sizes[aspect].h,
    mime_type: "image/jpeg",
    size_bytes: 1024 * 1024,
    date_taken: new Date(2024, 2, 1).toISOString(),
    canvas_theme: id % 3 === 0 ? "dark" : "white", // Mix of themes
    uploaded_at: new Date().toISOString(),
  };
};

const aspects: ("square" | "tall" | "wide")[] = [
  "square",
  "tall",
  "wide",
  "tall",
  "wide",
];

export const MOCK_PHOTOS = Array.from({ length: 50 }).map((_, i) =>
  generateMockPhoto(i + 1, aspects[i % aspects.length]),
);
