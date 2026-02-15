import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zlcqqmcvbhixcmeapofz.supabase.co",
      },
    ],
  },
};

export default nextConfig;
