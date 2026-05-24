import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",

        hostname: "placehold.co",
      },

      {
        protocol: "https",

        hostname: "*.tiktokcdn.com",
      },
    ],
  },
};

export default nextConfig;
