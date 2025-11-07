import fetchContentType from "@/lib/strapi/fetchContentType";
import Hero from "@/components/Hero";
import ClientSlugHandler from "../ClientSlugHandler";
import PublicationsList from "@/components/publications/PublicationsList";
import { Publication } from "@/types/types";
import type { Metadata } from "next";

type PublicationsIndexParams = {
  locale: string;
};

interface PublicationsIndexProps {
  // Match Next's PageProps constraint
  params: Promise<PublicationsIndexParams>;
}

export default async function PublicationsIndex({
  params,
}: PublicationsIndexProps) {
  const { locale } = await params;

  const res = await fetchContentType("publications?populate=*", {
    populate: {
      type: { populate: "*" },
      members: { populate: "*" },
      non_members: { populate: "*" },
      publisher: { populate: "*" },
      attachements: {
        populate: "*",
      },
    },
    locale,
    pagination: { page: 1, pageSize: 500 },
  });

  const publications: Publication[] = res?.data || [];

  const texts =
    locale === "en"
      ? {
          title: "Publications",
          subtitle: "Explore all publications of the website",
        }
      : {
          title: "Publications",
          subtitle: "Découvrez toutes les publications du site",
        };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler
        localizedSlugs={{ en: "publications", fr: "publications" }}
      />

      <Hero title={texts.title} description={texts.subtitle} size="lg" />

      <section className="container mx-auto py-12 max-w-5xl px-4">
        <PublicationsList publications={publications} locale={locale} />
      </section>
    </main>
  );
}

export async function generateMetadata(
  { params }: PublicationsIndexProps
): Promise<Metadata> {
  const { locale } = await params;
  const title = "Publications";
  const description =
    locale === "en"
      ? "Explore all publications of the website"
      : "Découvrez toutes les publications du site";

  return {
    title,
    description,
    openGraph: { title, description },
  };
}
