import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/openResizer",
  assetPrefix: "/openResizer",
  images: { unoptimized: true },
  poweredByHeader: false,
  devIndicators: false,
};

export default nextConfig;
