// @ts-nocheck

import React from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { generateMetadataObject } from "@/lib/shared/metadata";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import fetchContentType from "@/lib/strapi/fetchContentType";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Default Global SEO for pages without them
export async function generateMetadata({
  params,
}: {
  // Next is actually giving you params as a plain object, not a Promise
  params: { lang?: "fr" | "en"; locale?: string };
}): Promise<Metadata> {
  const locale = params.locale ?? params.lang ?? "en";

  const pageData = await fetchContentType(
    "global",
    {
      filters: { locale },
      populate: "seo.metaImage",
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang?: "fr" | "en"; locale?: string };
}) {
  const locale = params.locale ?? params.lang ?? "en";

  const pageData = await fetchContentType(
    "global",
    { filters: { locale } },
    true
  );

  return (
    <html lang={locale}>
      <ViewTransitions>
        <CartProvider>
          <body
            className={cn(
              inter.className,
              "bg-charcoal antialiased h-full w-full"
            )}
          >
            <Navbar data={pageData.navbar} locale={locale} />
            {children}
            <Footer data={pageData.footer} locale={locale} />
          </body>
        </CartProvider>
      </ViewTransitions>
    </html>
  );
}
