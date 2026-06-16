import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.12.230:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.12.230:3000"
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a8aswb0equnjn0q3.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;