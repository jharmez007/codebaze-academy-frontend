import type { NextConfig } from "next";

const backendUrl = "/api";

const nextConfig: NextConfig = {
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
