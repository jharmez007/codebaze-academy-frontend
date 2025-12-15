import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const nextConfig: NextConfig = {
  images: backendUrl
    ? {
        remotePatterns: [
          {
            protocol: backendUrl.startsWith("https") ? "https" : "http",
            hostname: new URL(backendUrl).hostname,
            pathname: "/**",
          },
        ],
      }
    : undefined,
};

export default nextConfig;
