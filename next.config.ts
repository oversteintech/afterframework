import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/packages", destination: "/en/docs/packages", permanent: true },
      { source: "/standard", destination: "/en/docs/getting-started", permanent: true },
      { source: "/start", destination: "/en/docs/getting-started", permanent: true },
      { source: "/ecosystem", destination: "/en/docs", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/products/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
