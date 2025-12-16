/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.codebazeacademy.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
