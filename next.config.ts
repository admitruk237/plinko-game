import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/plinko-game",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
