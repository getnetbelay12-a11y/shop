import type { Metadata } from "next";
import { APP_NAME } from "@/config/app";
import { SITE_TITLE, SITE_URL } from "@/config/site";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: `${APP_NAME} is an AI-powered social commerce platform for seller-first storefronts.`,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: SITE_TITLE,
    description: `${APP_NAME} is an AI-powered social commerce platform for seller-first storefronts.`,
    url: SITE_URL,
    siteName: SITE_TITLE,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: `${APP_NAME} is an AI-powered social commerce platform for seller-first storefronts.`
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
