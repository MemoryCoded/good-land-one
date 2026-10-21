// tells TypeScript exactly what data comes back from your FastAPI backend.

export interface Photo {
  id: number;
  collection_id: number;
  position: number;
  title: string | null;
  description: string | null;
  artist_name: string | null;
  filename: string;
  thumbnail_small: string;
  thumbnail_medium: string;
  thumbnail_large: string;
  width: number;
  height: number;
  mime_type: string;
  size_bytes: number;
  date_taken: string | null;
  canvas_theme: string | null;
  uploaded_at: string;
}
