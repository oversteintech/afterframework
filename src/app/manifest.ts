import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "After Framework",
    short_name: "After Framework",
    start_url: "/",
    display: "browser",
    background_color: "#0d1117",
    theme_color: "#0d1117",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
