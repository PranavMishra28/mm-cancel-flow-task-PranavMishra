import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        lightningcss: require.resolve('lightningcss'),
      },
    },
  },
};

export default nextConfig;
