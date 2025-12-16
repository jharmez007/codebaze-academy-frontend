// ✅ Helper to fix image paths
export function normalizeImagePath(image?: string | File | null): string {
  if (!image) return "/placeholder.jpg";

  if (typeof image === "string") {
    // Replace Windows-style backslashes with forward slashes
    const fixedPath = image.replace(/\\/g, "/");

    // If it’s already a valid absolute URL, return as-is
    if (fixedPath.startsWith("http://") || fixedPath.startsWith("https://"))
      return fixedPath;

    // Otherwise, build it using your backend’s base URL
    const BASE_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    // Ensure leading slash
    const normalized = fixedPath.startsWith("/") ? fixedPath : `/${fixedPath}`;

    return `${BASE_URL}${normalized}`;
  }

  // Handle case where image is a File object (client preview)
  return URL.createObjectURL(image);
}