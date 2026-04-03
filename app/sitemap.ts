import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const routes = [
  "",
  "/login",
  "/signup",
  "/discover",
  "/shop/demo-style"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : route.startsWith("/shop/") ? 0.9 : 0.7
  }));
}
