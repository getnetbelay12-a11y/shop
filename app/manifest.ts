import type { MetadataRoute } from "next";
import { APP_NAME } from "@/config/app";
import { SITE_TITLE } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: APP_NAME,
    description: `${APP_NAME} is an AI-powered social commerce platform for seller-first storefronts.`,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ee",
    theme_color: "#0f766e",
    icons: []
  };
}
