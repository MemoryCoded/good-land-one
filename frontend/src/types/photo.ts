// This interface exactly matches your backend's Pydantic schema and Database model.
export interface Photo {
  id: number;
  collection_id: number;
  collection_name: string | null;
  collection_sort_order: number | null;
  position: number;
  title: string | null;
  description: string | null;
  artist_name: string | null;
  copyright_override: string | null;
  canvas_theme: string | null;
  filename: string;
  thumbnail_small: string;
  thumbnail_medium: string;
  thumbnail_large: string;
  mime_type: string;
  size_bytes: number;
  width: number;
  height: number;
  date_taken: string | null;
  date_source: string | null;
  print_available: boolean;
  base_price_cents: number | null;
  edition_size: number | null;
  edition_number: number | null;
  uploaded_at: string;

  // NEW FIELDS (Added recently for Admin & UNCAT logic)
  is_archived: boolean;
  in_gallery: boolean;
  is_uncategorized: boolean;
}
