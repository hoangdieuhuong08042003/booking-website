import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    domains: [
      "res.cloudinary.com", // ✅ Cloudinary
      "plus.unsplash.com",
      "images.unsplash.com",
      "source.unsplash.com",
      "lh3.googleusercontent.com",
      "images.pexels.com",
    ],
  },
};

export default nextConfig;
