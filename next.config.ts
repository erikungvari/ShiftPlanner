import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn-icons-png.flaticon.com', 'png.pngtree.com', 'static.thenounproject.com', 'icons.veryicon.com'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ['image/webp'],
  },
};

export default nextConfig;
