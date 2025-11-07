import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ClientSlugHandler from "../../ClientSlugHandler";
import Hero from "@/components/Hero";
import MemberDetail from "@/components/members/MemberDetail";
import { fetchMemberBySlug } from "@/lib/strapi/fetchMemberBySlug";
import { MemberProfile } from "@/types/types";

type MemberPageParams = {
  locale: string;
  slug: string;
};

interface MemberPageProps {
  // Satisfy Next's PageProps constraint (params: Promise<any>)
  params: Promise<MemberPageParams>;
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { locale, slug } = await params;

  const member: MemberProfile | null = await fetchMemberBySlug(slug, locale);
  if (!member) return notFound();

  const localizedSlugs = (member.localizations || []).reduce(
    (acc: Record<string, string>, loc) => {
      acc[loc.locale] = loc.slug;
      return acc;
    },
    { [locale]: slug }
  );

  const fullName = `${member.firstName} ${member.lastName}`.trim();
  const subtitle =
    member.members_roles?.map((r) => r.name).join(" • ") || undefined;

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />

      <Hero title={fullName} description={subtitle} size="lg" />

      <section className="container mx-auto py-12 max-w-6xl px-4">
        <MemberDetail member={member} locale={locale} />
      </section>
    </main>
  );
}

export async function generateMetadata(
  { params }: MemberPageProps
): Promise<Metadata> {
  const { locale, slug } = await params;
  const member = await fetchMemberBySlug(slug, locale);

  if (!member) {
    return {
      title: locale === "en" ? "Member not found" : "Membre introuvable",
    };
  }

  const fullName = `${member.firstName} ${member.lastName}`.trim();
  const description = member.members_roles
    ?.map((r) => r.name)
    .join(" • ");

  return {
    title: fullName,
    description,
    openGraph: {
      title: fullName,
      description,
      images: member.image?.url ? [member.image.url] : [],
    },
  };
}
