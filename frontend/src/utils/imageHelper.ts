const API_BASE_URL = "http://127.0.0.1:8000";

export const getFullImageUrl = (path: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path; // If it's already a full URL
  return `${API_BASE_URL}${path}`;
};
