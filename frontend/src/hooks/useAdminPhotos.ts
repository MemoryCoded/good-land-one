import { useQuery } from "@tanstack/react-query";
import type { Photo } from "../types/photo";
import { useAdmin } from "../context/AdminContext";

export function useAdminPhotos() {
  const { token } = useAdmin();

  return useQuery({
    queryKey: ["adminPhotos"],
    queryFn: async (): Promise<Photo[]> => {
      console.log("FETCHING WITH TOKEN:", token);

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/photos/library?limit=100",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed with status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!token,
  });
}
