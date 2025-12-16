export function normalizeImagePath(image?: string | File | null): string {
  if (!image) return "/placeholder.jpg";

  if (typeof image === "string") {
    const fixedPath = image.replace(/\\/g, "/");

    // Absolute URL → OK
    if (fixedPath.startsWith("http://") || fixedPath.startsWith("https://")) {
      return fixedPath;
    }

    // 🔥 FORCE absolute URL for backend images
    const BASE_URL = "/api"

    const normalized = fixedPath.startsWith("/")
      ? fixedPath
      : `/${fixedPath}`;

    return `${BASE_URL}${normalized}`;
  }

  return URL.createObjectURL(image);
}
