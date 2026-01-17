import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "necessary-kookabura-751.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
