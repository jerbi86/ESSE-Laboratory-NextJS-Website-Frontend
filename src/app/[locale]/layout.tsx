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
  params: Promise<any>;
}): Promise<Metadata> {
  const resolved = await params;
  const locale: string = resolved.locale ?? resolved.lang ?? "en";

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

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<any>;
}) {
  const { children, params } = props;
  const resolved = await params;
  const locale: string = resolved.locale ?? resolved.lang ?? "en";

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
