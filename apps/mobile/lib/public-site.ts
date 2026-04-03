const PUBLIC_SITE_URL = process.env.EXPO_PUBLIC_PUBLIC_SITE_URL || "https://www.shegahomes.com";

export const publicSiteUrl = PUBLIC_SITE_URL;

export function buildStorefrontUrl(slug: string) {
  return `${PUBLIC_SITE_URL}/shop/${slug}`;
}

export function buildProductUrl(productId: string) {
  return `${PUBLIC_SITE_URL}/product/${productId}`;
}
