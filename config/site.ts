import { APP_NAME } from "@/config/app";

export const SITE_DOMAIN = "shegahomes.com";
export const SITE_URL = "https://www.shegahomes.com";
export const SITE_TITLE = `${APP_NAME} by Shega Homes`;

export function buildStorefrontUrl(slug: string) {
  return `${SITE_URL}/shop/${slug}`;
}

export function buildProductUrl(productId: string) {
  return `${SITE_URL}/product/${productId}`;
}
