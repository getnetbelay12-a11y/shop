import { APP_NAME } from "@/config/app";
import { env } from "@/lib/env";

export const SITE_DOMAIN = "shegahomes.com";
export const SITE_URL = env.APP_URL || `https://${SITE_DOMAIN}`;
export const SITE_TITLE = `${APP_NAME} by Shega Homes`;
