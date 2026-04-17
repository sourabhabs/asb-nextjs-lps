import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/thank-you.php",
          destination: "/thank-you",
        },
        {
          source: "/thank-you-bba.php",
          destination: "/thank-you-bba",
        },
        {
          source: "/thank-you-bca.php",
          destination: "/thank-you-bca",
        },
        {
          source: "/thank-you-bcom.php",
          destination: "/thank-you-bcom",
        },
        {
          source: "/thank-you-bsc.php",
          destination: "/thank-you-bsc",
        },
      ],
    };
  },
};

export default nextConfig;
