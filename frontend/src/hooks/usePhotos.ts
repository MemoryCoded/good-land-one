import { useQuery } from "@tanstack/react-query";
import type { Photo } from "../types/photo";

const fetchPhotos = async (): Promise<Photo[]> => {
  const response = await fetch("http://127.0.0.1:8000/api/photos");

  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }

  return response.json();
};

export function usePhotos() {
  return useQuery({
    queryKey: ["photos"],
    queryFn: fetchPhotos,
  });
}
