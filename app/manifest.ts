import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AutoNewsUA",
    short_name: "AutoNewsUA",
    description: "Automotive news, reviews, and market updates.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#004A9A",
    theme_color: "#005BBB",
    lang: "uk",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
