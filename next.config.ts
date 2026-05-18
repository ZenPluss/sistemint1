import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "*.globalsuzuki.com" },
      { protocol: "https", hostname: "*.suzuki.co.id" },
      { protocol: "https", hostname: "suzukicycles.com" },
      { protocol: "https", hostname: "i.ibb.co.com" },
    ],
  },
};

export default nextConfig;

