import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // devIndicators: { ... }, // Keep other devIndicators if needed, but allowedDevOrigins is top-level
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.12.230:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.12.230:3000"
  ],
};

export default nextConfig;
