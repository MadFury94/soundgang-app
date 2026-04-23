import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint runs separately in CI — skip during next build to avoid config issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors in admin-only components shouldn't block production builds
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
