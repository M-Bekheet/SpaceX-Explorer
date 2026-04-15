import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images2.imgbox.com" },
      { protocol: "https", hostname: "**.staticflickr.com" },
      { protocol: "https", hostname: "farm*.staticflickr.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "*.spacex.com" },
    ],
  },
};

export default nextConfig;
