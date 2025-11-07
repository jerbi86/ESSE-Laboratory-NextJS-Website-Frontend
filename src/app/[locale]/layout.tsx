import React from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { generateMetadataObject } from "@/lib/shared/metadata";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import fetchContentType from "@/lib/strapi/fetchContentType";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Default Global SEO for pages without their own metadata
export async function generateMetadata(): Promise<Metadata> {
  // If you later move this to a [locale]/layout.tsx, you can use params.locale here
  const locale = "en";

  const pageData = await fetchContentType(
    "global",
    {
      filters: { locale },
      populate: "seo.metaImage",
    },
    true
  );

  const seo = pageData?.seo;
  return generateMetadataObject(seo);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Same note as above: for per-locale navbar/footer, this typically lives in app/[locale]/layout.tsx
  const locale = "en";

  const pageData = await fetchContentType(
    "global",
    { filters: { locale } },
    true
  );

  return (
    <html lang={locale}>
      <body
        className={cn(
          inter.className,
          "bg-charcoal antialiased h-full w-full"
        )}
      >
        <CartProvider>
          <Navbar data={pageData.navbar} locale={locale} />
          {children}
          <Footer data={pageData.footer} locale={locale} />
        </CartProvider>
      </body>
    </html>
  );
}
