import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⬅️ THIS fixes your errors
  },

  images: {
    remotePatterns: [
      {
        protocol: backendUrl.startsWith("https") ? "https" : "http",
        hostname: backendUrl.replace(/^https?:\/\//, "").split(":")[0],
      },
    ],
  },
};

export default nextConfig;
