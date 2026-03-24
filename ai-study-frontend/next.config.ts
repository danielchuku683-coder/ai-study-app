import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // We removed the 'eslint' block that caused the warning
};

export default nextConfig;